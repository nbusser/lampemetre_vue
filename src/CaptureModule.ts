import { Mutex } from 'async-mutex';
import ModelTube from './model/ModelTube';
import { CaptureData, performCapture } from './Serial';

interface CaptureJob {
  tube: ModelTube,
  uGrid: number,
}

/*
 * This class handles concurrent jobs for capturing data
 * It handles thread safe job creation and cancelation
*/
export default class CaptureModule {
  // Job queue
  public waitingQueue: CaptureJob[] = [];

  // Only one job can use the serial communication to capture data
  private serialMutex: Mutex = new Mutex();

  // Only one thread can read/right the job queue
  private queueMutex: Mutex = new Mutex();

  private indexJob(job: CaptureJob): number {
    return this.waitingQueue.findIndex(
      (otherJob) => job.tube === otherJob.tube && job.uGrid === otherJob.uGrid,
    );
  }

  private async hasBeenCanceled(job: CaptureJob): Promise<boolean> {
    const queueMutexRelease = await this.queueMutex.acquire();
    try {
      return await this.indexJob(job) === -1;
    } finally {
      queueMutexRelease();
    }
  }

  // Enqueues job if a similar job have not been set before
  private async enqueueJob(job: CaptureJob): Promise<boolean> {
    const queueMutexRelease = await this.queueMutex.acquire();
    try {
      // Only create the job if it doesn't exist yet
      const index = this.indexJob(job);
      if (index === -1) {
        this.waitingQueue.push(job);
        return true;
      }
      return false;
    } finally {
      queueMutexRelease();
    }
  }

  // Ran internally when the job is done
  // Returns true if the job have been canceled while execution
  private async jobDone(job: CaptureJob): Promise<boolean> {
    const queueMutexRelease = await this.queueMutex.acquire();
    try {
      const index = this.indexJob(job);
      if (index === -1) {
        return true; // Job already been canceled
      }
      // Job has not been canceled
      // We remove it from the job list
      this.waitingQueue.splice(index, 1);
      return false;
    } finally {
      queueMutexRelease();
    }
  }

  async flushJobsTube(tube: ModelTube): Promise<void> {
    const queueMutexRelease = await this.queueMutex.acquire();
    try {
      this.waitingQueue = this.waitingQueue.filter((job: CaptureJob) => job.tube !== tube);
    } finally {
      queueMutexRelease();
    }
  }

  // Called from the outside to cancel a running (or not) job
  async cancelJob(tube: ModelTube, uGrid: number): Promise<void> {
    const queueMutexRelease = await this.queueMutex.acquire();
    try {
      const job : CaptureJob = {
        tube,
        uGrid,
      };

      const index = this.indexJob(job);

      // The job could be already dequeued
      // Then, it is too late to cancel, the capture is already done
      if (index !== -1) {
        // Removes the job from the list
        this.waitingQueue.splice(index, 1);
      }
    } finally {
      queueMutexRelease();
    }
  }

  // Called from the outside to add a CaptureJob to the module
  async doCapture(tube: ModelTube, uGrid: number): Promise<CaptureData | null> {
    const job: CaptureJob = {
      tube,
      uGrid,
    };
    const created = await this.enqueueJob(job);
    // If the job already exists, exits
    if (!created) {
      return null;
    }

    // Returns null if the job have been canceled
    let result: CaptureData | null = null;

    let canceled = await this.hasBeenCanceled(job);
    while (!canceled && result === null) {
      const serialMutexRelease = await this.serialMutex.acquire();
      try {
        // We are first in the queue
        if (this.indexJob(job) === 0) {
          // Performs the serial capture
          result = await performCapture(job.uGrid, job.tube.smoothingFactor);
          // Dequeue job and checks if the job have been cancel while we captured
          canceled = await this.jobDone(job);
          if (canceled) {
            result = null;
          }
        } else {
          // Could not run the capture yet
          // Checks if the job was canceled
          canceled = await this.hasBeenCanceled(job);
        }
      } finally {
        serialMutexRelease();
      }
    }
    return result;
  }
}
