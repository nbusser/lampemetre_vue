import { MutationTree } from 'vuex';
import { Color, colorBible } from '@/Color';
import ColorStack from '@/ColorStack';
import CaptureJob from '@/CaptureJob';
import ModelTube from '../model/ModelTube';
import { Mutations } from './mutation-types';
import { State } from './state';

const brandNewColorStack = () : ColorStack => new ColorStack(...colorBible);

let tubeColorStack: ColorStack = brandNewColorStack();
let measurementsColorStack: ColorStack = brandNewColorStack();

const mutations: MutationTree<State> & Mutations = {
  EMPTY_TUBES(state) {
    state.tubes = [];
    state.tubeColors.clear();
    tubeColorStack = brandNewColorStack();
  },
  ADD_TUBE(state, tube: ModelTube) {
    state.tubes.push(tube);

    state.tubeColors.set(tube, tubeColorStack.pop());
  },
  REMOVE_TUBE(state, tube: ModelTube) {
    const tubeIndex = state.tubes.findIndex((t) => t === tube);
    if (tubeIndex !== -1) {
      state.tubes.splice(tubeIndex, 1);

      const color: Color = state.tubeColors.get(tube) as Color;
      state.tubeColors.delete(tube);

      tubeColorStack.push(color);

      // Ran asynchronously
      state.captureModule.flushJobsTube(tube);
    }
  },
  CREATE_TUBE(state, name: string) {
    this.ADD_TUBE(state, new ModelTube(name));
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
    {
      tube,
      uGrid,
    },
  ) {
    const foundTube = state.tubes.find((t: ModelTube) => t === tube);
    if (foundTube === undefined) { return; }
    const capture = foundTube.captures.get(uGrid);
    if (capture === undefined) { return; }
    foundTube.changeSelectedUgrid(uGrid);
  },
  CHANGE_SMOOTHING_FACTOR(state, {
    tube,
    smoothingFactor,
  }) {
    const foundTube = state.tubes.find((t: ModelTube) => t === tube);
    if (foundTube === undefined) { return; }
    foundTube.changeSmoothingFactor(smoothingFactor);
  },
  ADD_MEASUREMENT(state, uAnode: number) {
    state.measurements.add(uAnode);

    state.measurementsColors.set(uAnode, measurementsColorStack.pop());
  },
  REMOVE_MEASUREMENT(state, uAnode: number) {
    state.measurements.delete(uAnode);

    const color: Color = state.measurementsColors.get(uAnode) as Color;
    state.measurementsColors.delete(uAnode);
    measurementsColorStack.push(color);
  },
  CLEAR_MEASUREMENTS(state) {
    state.measurements.clear();
    state.measurementsColors.clear();
    measurementsColorStack = brandNewColorStack();
  },
  CANCEL_PENDING_CAPTURE(state, {
    tube,
    uGrid,
  }) {
    // Ran asynchronously
    state.captureModule.cancelJob(new CaptureJob(tube, uGrid));
  },
  REMOVE_CRASHED_CAPTURE(state, {
    tube,
    uGrid,
  }) {
    state.captureModule.removeCrashReport(new CaptureJob(tube, uGrid));
  },
  SET_NOTES(state, newNotes) {
    state.notes = newNotes;
  },
};

export default mutations;
