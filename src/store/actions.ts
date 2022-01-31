import CaptureJob from '@/CaptureJob';
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
  async CREATE_CAPTURE_ASYNC(context, {
    tube,
    uGrid,
  }) {
    const result = await context.state.captureModule.doCapture(new CaptureJob(tube, uGrid));
    // If capture have been canceled, result is null
    if (result !== null) {
      context.commit('CREATE_CAPTURE', {
        tube,
        uAnode: result.tensionsAnode,
        uGrid,
        iCathode: result.currentsCathode,
      });
    }
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
  ADD_MEASUREMENT(context, payload) {
    context.commit('ADD_MEASUREMENT', payload.uAnode);
  },
  REMOVE_MEASUREMENT(context, payload) {
    context.commit('REMOVE_MEASUREMENT', payload.uAnode);
  },
  CLEAR_MEASUREMENTS(context) {
    context.commit('CLEAR_MEASUREMENTS', undefined);
  },
  CANCEL_PENDING_CAPTURE(context, payload) {
    context.commit('CANCEL_PENDING_CAPTURE', payload);
  },
  REMOVE_CRASHED_CAPTURE(context, payload) {
    context.commit('REMOVE_CRASHED_CAPTURE', payload);
  },
};

export default actions;
