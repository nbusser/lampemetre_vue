import ModelTube from '../model/ModelTube';

export const state = {
  tubes: [] as ModelTube[],
  measurements: new Set() as Set<number>,
};

export type State = typeof state;
