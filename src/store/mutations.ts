import { MutationTree } from 'vuex';
import ModelTube from '../model/ModelTube';
import { Mutations } from './mutation-types';
import { State } from './state';

const mutations: MutationTree<State> & Mutations = {
  ADD_TUBE(state, tube: ModelTube) {
    state.tubes.push(tube);
  },
};

export default mutations;
