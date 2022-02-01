import CaptureModule from '@/CaptureModule';
import { Color } from '@/Color';
import Timer from '@/Timer';
import ModelTube from '@/model/ModelTube';
import { reactive } from '@vue/reactivity';

// Used to guarantee reactivity when variables are internally changed
const timer = reactive(new Timer());
timer.initInterval();

export const state = {
  tubes: [] as ModelTube[],
  measurements: new Set() as Set<number>,

  tubeColors: new Map() as Map<ModelTube, Color>,
  measurementsColors: new Map() as Map<number, Color>,

  timer,
  captureModule: new CaptureModule(timer) as CaptureModule,
};

export type State = typeof state;
