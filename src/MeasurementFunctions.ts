import ModelTube from '@/model/ModelTube';
import ModelCapture from '@/model/ModelCapture';

const getSelectedCapture = (tube: ModelTube): ModelCapture | string => {
  if (tube.selectedUgrid === null) {
    return 'Selectionnez une capture en cliquant dessus dans le panneau Tubes';
  }
  const capture = tube.captures.get(tube.selectedUgrid);
  if (capture === undefined) {
    return `La capture ${tube.selectedUgrid} n'existe pas pour le tube ${tube.name}`;
  }
  return capture;
};

const getClosestIndex = (list: number[], refValue: number): number | null => {
  const roughPosition = list.findIndex(
    (value) => value >= refValue,
  );
  if (roughPosition === -1) {
    return null;
  }
  if (roughPosition === 0) {
    return roughPosition;
  }

  return (
    Math.abs(refValue - list[roughPosition])
          < Math.abs(refValue - list[roughPosition - 1])
  ) ? roughPosition : roughPosition - 1;
};

const getClosestUanode = (capture: ModelCapture, uAnode: number) => {
  let closestUanodeIndex = getClosestIndex(capture.uAnode, uAnode);
  if (closestUanodeIndex === null) {
    throw Error(`Aucun échantillon capturé au delà de la tension anode ${uAnode}V`);
  } else if (closestUanodeIndex === 0) {
    closestUanodeIndex += 1;
  } else if (closestUanodeIndex === capture.uAnode.length - 1) {
    closestUanodeIndex -= 1;
  }
  return closestUanodeIndex;
};

const getSortedCaptures = (tube: ModelTube) => {
  const capturesSorted = [...tube.captures.values()].sort((a: ModelCapture, b: ModelCapture) => {
    if (a.uGrid < b.uGrid) {
      return -1;
    } if (a.uGrid > b.uGrid) {
      return 1;
    }
    return 0;
  });
  return capturesSorted;
};

export const computeSelectedIcathode = (
  tube: ModelTube,
  uAnodeMeasurement: number,
): number | string => {
  if (tube.captures.size < 1) {
    return 'Le tube doit contenir au moins une capture';
  }

  const gridCapture = getSelectedCapture(tube);
  if (typeof gridCapture === 'string') {
    return gridCapture;
  }

  const closestUanodeIndex = getClosestUanode(gridCapture, uAnodeMeasurement as number);

  return Number.parseFloat(gridCapture.iCathode[closestUanodeIndex].toFixed(2));
};

export const computeInternalResistance = (
  tube: ModelTube,
  uAnodeMeasurement: number,
): number | string => {
  if (tube.captures.size < 1) {
    return 'Le tube doit contenir au moins une capture';
  }

  const gridCapture = getSelectedCapture(tube);
  if (typeof gridCapture === 'string') {
    return gridCapture;
  }

  const closestUanodeIndex = getClosestUanode(gridCapture, uAnodeMeasurement);

  const lowerMean = (
    (gridCapture.uAnode[closestUanodeIndex] - gridCapture.uAnode[closestUanodeIndex - 1])
      / (
        gridCapture.iCathode[closestUanodeIndex]
        - gridCapture.iCathode[closestUanodeIndex - 1]
      )
  );
  const upperMean = (
    (gridCapture.uAnode[closestUanodeIndex + 1] - gridCapture.uAnode[closestUanodeIndex])
      / (
        gridCapture.iCathode[closestUanodeIndex + 1]
        - gridCapture.iCathode[closestUanodeIndex]
      )
  );
  return (lowerMean + upperMean) / 2;
};

export const computeTransductance = (
  tube: ModelTube,
  uAnodeMeasurement: number,
): number | string => {
  // Transductance and amplification factor calculation require at least 2 captures
  if (tube.captures.size < 2) {
    return 'Le tube doit contenir au moins deux captures';
  }

  const gridCapture = getSelectedCapture(tube);
  if (typeof gridCapture === 'string') {
    return gridCapture;
  }

  const capturesSorted = getSortedCaptures(tube);

  const closestUanodeIndex = getClosestUanode(gridCapture, uAnodeMeasurement);
  const iMeasure = gridCapture.iCathode[closestUanodeIndex];

  // Transductance calculation is always possible

  const calculateTransductance = (relativeCapture: ModelCapture): number => Math.abs(
    (iMeasure - relativeCapture.iCathode[closestUanodeIndex as number])
      / (gridCapture.uGrid - relativeCapture.uGrid),
  );

  const captureIndex = capturesSorted.findIndex((cap) => cap === gridCapture) as number;
  let transductance;
  if (captureIndex !== 0) {
    transductance = calculateTransductance(capturesSorted[captureIndex - 1]);
  } else {
    transductance = calculateTransductance(capturesSorted[captureIndex + 1]);
  }

  return transductance;
};

export const computeAmplificationFactor = (
  tube: ModelTube,
  uAnodeMeasurement: number,
): number | string => {
  // Transductance and amplification factor calculation require at least 2 captures
  if (tube.captures.size < 2) {
    return 'Le tube doit contenir au moins deux captures';
  }

  const gridCapture = getSelectedCapture(tube);
  if (typeof gridCapture === 'string') {
    return gridCapture;
  }

  // Transductance and amplification factor calculation require at least 2 captures

  if (tube.captures.size < 2) {
    return 'Le tube doit contenir au moins deux captures';
  }

  const capturesSorted = getSortedCaptures(tube);

  const closestUanodeIndex = getClosestUanode(gridCapture, uAnodeMeasurement);
  const iMeasure = gridCapture.iCathode[closestUanodeIndex];

  // Amplification factor calculation is not always possible

  const calculateAmplificationFactor = (relativeCapture: ModelCapture): number | null => {
    const closestImeasure = getClosestIndex(relativeCapture.iCathode, iMeasure);

    if (closestImeasure === null) {
      return null;
    }
    return Math.abs(
      (relativeCapture.uAnode[closestImeasure] - uAnodeMeasurement)
      / (gridCapture.uGrid - relativeCapture.uGrid),
    );
  };

  const captureIndex = <number> capturesSorted.findIndex((cap) => cap === gridCapture);
  let amplificationFactor = null;
  if (captureIndex !== 0) {
    amplificationFactor = calculateAmplificationFactor(capturesSorted[captureIndex - 1]);
  }
  if (amplificationFactor === null) {
    amplificationFactor = calculateAmplificationFactor(capturesSorted[captureIndex + 1]);
  }

  if (amplificationFactor !== null) {
    return amplificationFactor;
  }
  return 'Impossible de calculer le facteur d\'amplification avec ces captures';
};
