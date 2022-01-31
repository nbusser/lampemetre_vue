import CaptureModule from '@/CaptureModule';
import { Color } from '@/Color';
import ModelTube from '../model/ModelTube';

export const state = {
  tubes: [] as ModelTube[],
  measurements: new Set() as Set<number>,

  tubeColors: new Map() as Map<ModelTube, Color>,
  measurementsColors: new Map() as Map<number, Color>,

  captureModule: new CaptureModule() as CaptureModule,
};

export type State = typeof state;
