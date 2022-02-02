import ModelTube from '../model/ModelTube';
import { State } from './state';

export type Mutations<S = State> = {
  EMPTY_TUBES(state: S): void
  ADD_TUBE(state: S, tube: ModelTube): void
  REMOVE_TUBE(state: S, tube: ModelTube): void
  CREATE_TUBE(state: S, name: string): void
  CREATE_CAPTURE(state: S,
    payload: {
      tube: ModelTube,
      uAnode: number[],
      uGrid: number,
      iCathode: number[]
    }): void
  DELETE_CAPTURE(state: S, payload: { tube: ModelTube, uGrid: number }): void
  SELECT_CAPTURE_TUBE(state: S, payload: { tube: ModelTube, uGrid: number }): void
  CHANGE_SMOOTHING_FACTOR(state: S, payload: { tube: ModelTube, smoothingFactor: number }): void
  ADD_MEASUREMENT(state: S, uAnode: number): void
  REMOVE_MEASUREMENT(state: S, uAnode: number): void
  CLEAR_MEASUREMENTS(state: S): void
  CANCEL_PENDING_CAPTURE(state: S, payload: { tube: ModelTube, uGrid: number }): void
  REMOVE_CRASHED_CAPTURE(state: S, payload: { tube: ModelTube, uGrid: number }): void
  SET_NOTES(state: S, newNotes: string): void;
};

export type MurationTypes = keyof Mutations;
