import { ActionContext } from 'vuex';
import { Mutations } from './mutation-types';
import { State } from './state';
import ModelTube from '../model/ModelTube';

// Augmented ActionContext
type AAC = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>;

export interface Actions {
  EMPTY_TUBES(ctx: AAC): void;
  ADD_TUBE(ctx: AAC, payload: { tube: ModelTube }): void;
  REMOVE_TUBE(ctx: AAC, payload: { tube: ModelTube }): void;
  CREATE_TUBE(ctx: AAC, payload: { name: string }): void
  CREATE_CAPTURE(
    ctx: AAC,
    payload: {
      tube: ModelTube,
      uAnode: number[],
      uGrid: number,
      iCathode: number[]
    }): void
  CREATE_CAPTURE_ASYNC(
    ctx: AAC,
    payload: {
      tube: ModelTube,
      uGrid: number,
    }): Promise<void>
  DELETE_CAPTURE(ctx: AAC, payload: { tube: ModelTube, uGrid: number }): void
  SELECT_CAPTURE_TUBE(ctx: AAC, payload: { tube: ModelTube, uGrid: number }): void
  CHANGE_SMOOTHING_FACTOR(ctx: AAC, payload: { tube: ModelTube, smoothingFactor: number }): void
  ADD_MEASUREMENT(ctx: AAC, payload: { uAnode: number }): void;
  REMOVE_MEASUREMENT(ctx: AAC, payload: { uAnode: number }): void;
  CLEAR_MEASUREMENTS(ctx: AAC): void;
  CANCEL_PENDING_CAPTURE(ctx: AAC, payload: { tube: ModelTube, uGrid: number }): void;
  REMOVE_CRASHED_CAPTURE(ctx: AAC, payload: { tube: ModelTube, uGrid: number }): void;
  SET_NOTES(ctx: AAC, payload: { newNotes: string }): void;
}

export type ActionTypes = keyof Actions;
