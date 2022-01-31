import { Mutex } from 'async-mutex';
import { Queue } from 'queue-typescript';
import ModelTube from './model/ModelTube';
import { CaptureData, performCapture } from './Serial';

interface CaptureJob {
  tube: ModelTube,
  uGrid: number,
}

export default class CaptureModule {
  private mutex: Mutex = new Mutex();

  public waitingQueue: Queue<CaptureJob> = new Queue();

  private isFirst(job: CaptureJob): boolean {
    return (this.waitingQueue.head.tube === job.tube
      && this.waitingQueue.head.uGrid === job.uGrid);
  }

  async doCapture(tube: ModelTube, uGrid: number): Promise<CaptureData> {
    console.log(`Do capture ${uGrid}`);
    const job: CaptureJob = {
      tube,
      uGrid,
    };
    this.waitingQueue.enqueue(job);

    let result: CaptureData | null = null;
    while (result === null) {
      console.log(`${uGrid} got mutex`);
      const release = await this.mutex.acquire();
      try {
        if (this.isFirst(job)) {
          console.log(`${uGrid} run capture`);
          result = await performCapture(job.uGrid, job.tube.smoothingFactor);
          console.log(`${uGrid} capture done`);
          this.waitingQueue.dequeue();
        }
      } finally {
        console.log(`${uGrid} release lock`);
        release();
      }
    }
    return result;
  }
}
