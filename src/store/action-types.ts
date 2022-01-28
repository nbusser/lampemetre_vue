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
  ADD_TUBE(ctx: AAC, payload: { tube: ModelTube }): void;
  REMOVE_TUBE(ctx: AAC, payload: { tube: ModelTube }): void;
  CREATE_TUBE(ctx: AAC, payload: { name: string }): void
  CREATE_CAPTURE(ctx: AAC, payload: { tube: ModelTube, uAnode: number[], uGrid: number, iCathode: number[] }): void
  DELETE_CAPTURE(ctx: AAC, payload: { tube: ModelTube, uGrid: number }): void
  SELECT_CAPTURE_TUBE(ctx: AAC, payload: { tube: ModelTube, uGrid: number }): void
}

export type ActionTypes = keyof Actions;
