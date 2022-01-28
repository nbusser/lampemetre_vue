import { MutationTree } from 'vuex';
import ModelTube from '../model/ModelTube';
import { Mutations } from './mutation-types';
import { State } from './state';

const mutations: MutationTree<State> & Mutations = {
  ADD_TUBE(state, tube: ModelTube) {
    state.tubes.push(tube);
  },
  REMOVE_TUBE(state, tube: ModelTube) {
    const tubeIndex = state.tubes.findIndex((t) => t === tube);
    if (tubeIndex !== -1) {
      state.tubes.splice(tubeIndex, 1);
    }
  },
  CREATE_TUBE(state, name: string) {
    state.tubes.push(new ModelTube(name));
  },

  CREATE_CAPTURE(
    state,
    payload: {
      tube: ModelTube,
      uAnode: number[],
      uGrid: number,
      iCathode: number[]
    },
  ) {
    const foundTube = state.tubes.find((t: ModelTube) => t === payload.tube);
    if (foundTube === undefined) { return; }
    foundTube.createCapture(payload.uAnode, payload.uGrid, payload.iCathode);
  },

  DELETE_CAPTURE(
    state,
    payload: {
      tube: ModelTube,
      uGrid: number
    },
  ) {
    const foundTube = state.tubes.find((t: ModelTube) => t === payload.tube);
    if (foundTube === undefined) { return; }
    foundTube.deleteCaptureByUgrid(payload.uGrid);
  },

  SELECT_CAPTURE_TUBE(
    state,
    payload: {
      tube: ModelTube,
      uGrid: number
    },
  ) {
    const foundTube = state.tubes.find((t: ModelTube) => t === payload.tube);
    if (foundTube === undefined) { return; }
    const capture = foundTube.captures.get(payload.uGrid);
    if (capture === undefined) { return; }
    foundTube.changeSelectedCapture(capture);
  },
};

export default mutations;
