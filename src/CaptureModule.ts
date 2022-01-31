import { Mutex } from 'async-mutex';
import CaptureJob from './CaptureJob';
import ModelTube from './model/ModelTube';
import { CaptureData, performCapture } from './Serial';

/*
 * This class handles concurrent jobs for capturing data
 * It handles thread safe job creation and cancelation
*/

interface CrashLog {
  job: CaptureJob,
  error: string,
}

export default class CaptureModule {
  // Job queue
  public waitingQueue: CaptureJob[] = [];

  public graveyard: CrashLog[] = [];

  // Only one job can use the serial communication to capture data
  private serialMutex: Mutex = new Mutex();

  // Only one thread can read/write the job queue
  // Actually useless since Javascript is single threaded
  private queueMutex: Mutex = new Mutex();

  // If a crash has been reported
  private async reportCrash(job: CaptureJob, errorMessage: string): Promise<void> {
    // First, we set the job as done
    const canceled = await this.jobDone(job);
    // If the job have been canceled, we do not put anything in the graveyard
    if (!canceled) {
      // We try to find a similar previous job fail
      const logIndex = this.graveyard.findIndex(
        (log: CrashLog) => log.job.equals(job),
      );
      // If such log exists, we just update the error message
      if (logIndex !== -1) {
        this.graveyard[logIndex].error = errorMessage;
      } else {
        // Otherwise, we create a brand new log
        this.graveyard.push({
          job,
          error: errorMessage,
        });
      }
    }
  }

  // Remove the crash report related to the job, if it exists
  removeCrashReport(job: CaptureJob): void {
    const logIndex = this.graveyard.findIndex(
      (log: CrashLog) => log.job.equals(job),
    );
    if (logIndex !== -1) {
      this.graveyard.splice(logIndex, 1);
    }
  }

  private indexJob(job: CaptureJob): number {
    return this.waitingQueue.findIndex(
      (otherJob) => job.equals(otherJob),
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
      this.graveyard = this.graveyard.filter((log: CrashLog) => log.job.tube === tube);
    } finally {
      queueMutexRelease();
    }
  }

  // Called from the outside to cancel a running (or not) job
  async cancelJob(job: CaptureJob): Promise<void> {
    const queueMutexRelease = await this.queueMutex.acquire();
    try {
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
  async doCapture(job: CaptureJob): Promise<CaptureData | null> {
    const created = await this.enqueueJob(job);
    // If the job already exists, exits
    if (!created) {
      return null;
    }

    // If an error log exists for this capture, remove it
    this.removeCrashReport(job);

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
      } catch (e: any) {
        await this.reportCrash(job, e.message);
        return null;
      } finally {
        serialMutexRelease();
      }
    }
    return result;
  }
}
