import { ActionTree } from 'vuex';
import { Actions } from './action-types';
import { State } from './state';

const actions: ActionTree<State, State> & Actions = {
  ADD_TUBE(context, payload) {
    context.commit('ADD_TUBE', payload.tube);
  },
};

export default actions;
