import ModelCapture from '@/model/ModelCapture';
import { FrozenTube } from './FrozenData';

export const minSmoothingFactor = 0;
export const maxSmoothingFactor = 10;

export default class ModelTube {
  public name: string;

  public captures: Map<number, ModelCapture> = new Map();

  public selectedUgrid: number | null = null;

  public smoothingFactor = 4;

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
    if (capture.uGrid === this.selectedUgrid) {
      this.selectedUgrid = null;
    }
  }

  deleteCaptureByUgrid(uGrid: number): void {
    const toDelete = this.captures.get(uGrid);

    if (toDelete === undefined) {
      throw Error(`Capture for tension grid ${uGrid} does not belong to tube ${this.name}`);
    }
    this.captures.delete(uGrid);
  }

  changeSelectedUgrid(newSelectedUgrid: number): void {
    if (!this.captures.has(newSelectedUgrid)) {
      throw Error(`No capture ${newSelectedUgrid.toString()} for tube ${this.name}`);
    }
    this.selectedUgrid = newSelectedUgrid;
  }

  changeSmoothingFactor(newSmoothingFactor: number): void {
    if (newSmoothingFactor < minSmoothingFactor || newSmoothingFactor > maxSmoothingFactor) {
      throw Error(`Smoothing factor must be between ${minSmoothingFactor} and ${maxSmoothingFactor}`);
    }
    if (this.captures.size > 0) {
      throw Error('Smoothing factor can only be changed if no capture is registered');
    }
    this.smoothingFactor = newSmoothingFactor;
  }

  canChangeSmoothingFactor(): boolean {
    return this.captures.size === 0;
  }

  public toJSON(): FrozenTube {
    const captures = [...this.captures.values()];

    return {
      name: this.name,
      captures: captures.length === 0 ? undefined : captures,
      selectedCaptureUgrid: this.selectedUgrid === null ? undefined : this.selectedUgrid,
      smoothingFactor: this.smoothingFactor,
    };
  }
}
