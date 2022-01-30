import { Stack } from 'stack-typescript';
import { MutationTree } from 'vuex';
import { Color, colorBible } from '@/Color';
import ModelTube from '../model/ModelTube';
import { Mutations } from './mutation-types';
import { State } from './state';

const defaultColor = new Color(0, 0, 0, 1.0);

// TODO: create class ColorStack
const brandNewColorStack = () : Stack<Color> => new Stack(...colorBible);
const popColor = (stack: Stack<Color>): Color => {
  if (stack.size === 0) {
    return defaultColor;
  }
  return stack.pop();
};
const pushColor = (stack: Stack<Color>, toPush: Color) => {
  if (!toPush.equals(defaultColor)) {
    stack.push(toPush);
  }
};

let tubeColorStack = brandNewColorStack();
let measurementsColorStack = brandNewColorStack();

const mutations: MutationTree<State> & Mutations = {
  EMPTY_TUBES(state) {
    state.tubes = [];
    tubeColorStack = brandNewColorStack();
  },
  ADD_TUBE(state, tube: ModelTube) {
    state.tubes.push(tube);

    state.tubeColors.set(tube, popColor(tubeColorStack));
  },
  REMOVE_TUBE(state, tube: ModelTube) {
    const tubeIndex = state.tubes.findIndex((t) => t === tube);
    if (tubeIndex !== -1) {
      state.tubes.splice(tubeIndex, 1);

      const color: Color = state.tubeColors.get(tube) as Color;
      pushColor(tubeColorStack, color);
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

    state.measurementsColors.set(uAnode, popColor(measurementsColorStack));
  },
  REMOVE_MEASUREMENT(state, uAnode: number) {
    state.measurements.delete(uAnode);

    const color: Color = state.measurementsColors.get(uAnode) as Color;
    pushColor(measurementsColorStack, color);
  },
  CLEAR_MEASUREMENTS(state) {
    state.measurements.clear();
    measurementsColorStack = brandNewColorStack();
  },
};

export default mutations;
