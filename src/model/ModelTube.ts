import ModelCapture from '@/model/ModelCapture';

export default class ModelTube {
  public name: string;

  public captures: Map<number, ModelCapture> = new Map();

  public selectedCapture: ModelCapture | null = null;

  constructor(name: string) {
    this.name = name;
  }

  createCapture(uAnode: number[], uGrid: number, values: number[]): void {
    const createdCapture = new ModelCapture(uAnode, uGrid, values);

    if (this.captures.has(uGrid)) {
      this.deleteCaptureByUgrid(uGrid);
    }

    this.captures.set(uGrid, createdCapture);
  }

  deleteCapture(capture: ModelCapture): void {
    this.deleteCaptureByUgrid(capture.uGrid);
    if (capture === this.selectedCapture) {
      this.selectedCapture = null;
    }
  }

  deleteCaptureByUgrid(uGrid: number): void {
    const toDelete = this.captures.get(uGrid);

    if (toDelete === undefined) {
      throw Error(`Capture for tension grid ${uGrid} does not belong to tube ${this.name}`);
    }
    this.captures.delete(uGrid);
  }

  changeSelectedCapture(newSelectedCapture: ModelCapture): void {
    if (!this.captures.has(newSelectedCapture.uGrid)) {
      throw Error(`No capture ${newSelectedCapture.toString()} for tube ${this.name}`);
    }
    this.selectedCapture = newSelectedCapture;
  }
}
