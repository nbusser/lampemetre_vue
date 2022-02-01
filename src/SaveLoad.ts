/*
Prepares a frozen version of all the tubes via toJSON
These frozen data get rid of all the handlers and complex objects such maps
*/

import * as fs from 'file-saver';
import { FrozenData, FrozenTube } from './model/FrozenData';
import ModelCapture from './model/ModelCapture';
import ModelTube from './model/ModelTube';

interface ApplicationData {
  tubes: ModelTube[],
  measurements: number[],
  notes: string | undefined,
}

export const saveToJSON = (tubes: ModelTube[], measurements: number[], notes: string): void => {
  const frozenTubes: FrozenTube[] = [];
  tubes.forEach((tube: ModelTube) => {
    frozenTubes.push(tube.toJSON());
  });

  // Prepares then a frozen version of all data
  const frozenData: FrozenData = {
    tubes: frozenTubes.length === 0 ? undefined : frozenTubes,
    measurements: measurements.length === 0 ? undefined : measurements,
    notes,
  };

  // Stringifies those frozen data and save it to a file
  const saveJson: string = JSON.stringify(frozenData);

  const saveName = `save-${new Date().valueOf()}.json`;
  fs.saveAs(new Blob([saveJson]), saveName);
};

export const loadFromJSON = (jsonContent: string): ApplicationData => {
  const frozenData: FrozenData = JSON.parse(jsonContent);

  const tubes: ModelTube[] = [];

  if (frozenData.tubes !== undefined) {
    frozenData.tubes.forEach((frozenTube: FrozenTube) => {
      const tube = new ModelTube(frozenTube.name);

      if (frozenTube.smoothingFactor !== undefined) {
        tube.changeSmoothingFactor(frozenTube.smoothingFactor);
      }

      if (frozenTube.captures !== undefined) {
        frozenTube.captures.forEach((capture: ModelCapture) => {
          tube.createCapture(capture.uAnode, capture.uGrid, capture.iCathode);
        });
      }

      if (frozenTube.selectedCaptureUgrid !== undefined) {
        tube.changeSelectedUgrid(frozenTube.selectedCaptureUgrid);
      }

      tubes.push(tube);
    });
  }

  let measurements: number[] = [];

  if (frozenData.measurements !== undefined) {
    measurements = frozenData.measurements;
  }

  return {
    tubes,
    measurements,
    notes: frozenData.notes,
  } as ApplicationData;
};
