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
};

export default mutations;
