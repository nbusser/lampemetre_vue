import ModelTube from './model/ModelTube';

export default class CaptureJob {
  public tube: ModelTube;

  public uGrid: number;

  constructor(tube: ModelTube, uGrid: number) {
    this.tube = tube;
    this.uGrid = uGrid;
  }

  equals(j: CaptureJob): boolean {
    return this.tube === j.tube && this.uGrid === j.uGrid;
  }
}
