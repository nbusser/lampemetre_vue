import ModelTube from '../model/ModelTube';
import { State } from './state';

export type Mutations<S = State> = {
  ADD_TUBE(state: S, tube: ModelTube): void
  REMOVE_TUBE(state: S, tube: ModelTube): void
};

export type MurationTypes = keyof Mutations;
