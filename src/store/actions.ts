import { ActionTree } from 'vuex';
import { Actions } from './action-types';
import { State } from './state';

const actions: ActionTree<State, State> & Actions = {
  EMPTY_TUBES(context) {
    context.commit('EMPTY_TUBES', undefined);
  },
  ADD_TUBE(context, payload) {
    context.commit('ADD_TUBE', payload.tube);
  },
  REMOVE_TUBE(context, payload) {
    context.commit('REMOVE_TUBE', payload.tube);
  },
  CREATE_TUBE(context, payload) {
    context.commit('CREATE_TUBE', payload.name);
  },
  CREATE_CAPTURE(context, payload) {
    context.commit('CREATE_CAPTURE', payload);
  },
  DELETE_CAPTURE(context, payload) {
    context.commit('DELETE_CAPTURE', payload);
  },
  SELECT_CAPTURE_TUBE(context, payload) {
    context.commit('SELECT_CAPTURE_TUBE', payload);
  },
  CHANGE_SMOOTHING_FACTOR(context, payload) {
    context.commit('CHANGE_SMOOTHING_FACTOR', payload);
  },
};

export default actions;
