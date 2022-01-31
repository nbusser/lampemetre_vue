/* eslint-disable no-await-in-loop */
/* eslint-disable no-bitwise */

const writeByteSerial = async (
  serialWriter: WritableStreamDefaultWriter<Uint8Array>, value: number,
): Promise<void> => {
  const data = new Uint8Array([value]);
  await serialWriter.write(data);
};

const readBytesSerial = async (
  serialReader: ReadableStreamDefaultReader<Uint8Array>, nBytes: number,
) : Promise<number[]> => {
  let i = 0;
  const readBuffer = [];
  while (i < nBytes) {
    const { value } = await serialReader.read();

    if (!value) {
      throw Error('read value is empty');
    }

    for (let j = 0; j < value.length; j += 1) {
      readBuffer.push(value[j]);
    }
    i += value.length;
  }
  return readBuffer;
};

const readBytesSerialWithTimeout = (
  serialReader: ReadableStreamDefaultReader<Uint8Array>, nBytes: number, timeout: number,
): Promise<number[]> => new Promise((resolve, reject) => {
  readBytesSerial(serialReader, nBytes).then(resolve, reject);
  setTimeout(() => { reject(Error('Timeout while reading')); }, timeout);
});

const readBytesSerialPackUint16 = async (
  serialReader: ReadableStreamDefaultReader<Uint8Array>, nBytes: number, timeout: number,
): Promise<number[]> => {
  if (nBytes % 2 !== 0) {
    throw Error('n_bytes must be even to pack reading result in 16-bits words');
  }

  const readBuffer = await readBytesSerialWithTimeout(serialReader, nBytes, timeout);

  const uint16Values = [];
  for (let i = 0; i < readBuffer.length; i += 2) {
    const val = (readBuffer[i] << 8) + readBuffer[i + 1];
    uint16Values.push(val);
  }

  return uint16Values;
};

const acquireTensionsAnode = async (
  serialReader: ReadableStreamDefaultReader<Uint8Array>,
  serialWriter: WritableStreamDefaultWriter<Uint8Array>,
): Promise<number[]> => {
  let readBuffer = [];
  try {
    await writeByteSerial(serialWriter, 101);

    const bytesToRead = 128;
    readBuffer = await readBytesSerialPackUint16(serialReader, bytesToRead, 1500);
  } catch {
    throw Error('Impossible d\'obtenir les valeurs de tension anode');
  }

  const uAnodeSamples = [];
  for (let i = 0; i < readBuffer.length; i += 1) {
    const voltage = Math.round(readBuffer[i] * 4.6875) / 10;
    uAnodeSamples.push(voltage);
  }

  return uAnodeSamples;
};

export enum SamplingMode {
  AN1,
  AN2,
}

const acquireCurrentCathode = async (
  serialReader: ReadableStreamDefaultReader<Uint8Array>,
  serialWriter: WritableStreamDefaultWriter<Uint8Array>,
  uGrid: number,
  samplingMode: SamplingMode,
): Promise<number[]> => {
  const iCathodeSample = [];
  try {
    // The value "scale" depends on the sampling mode
    const samplingMultiplier = samplingMode === SamplingMode.AN1 ? (1 / 32) : (1 / 4);

    const uGridToSend = 150 + (uGrid * 2);

    await writeByteSerial(serialWriter, uGridToSend);

    const bytesToRead = 128;
    const readBuffer = await readBytesSerialPackUint16(serialReader, bytesToRead, 15000);
    for (let i = 0; i < readBuffer.length; i += 1) {
      const current = readBuffer[i] * samplingMultiplier;
      iCathodeSample.push(current);
    }
  } catch (error) {
    alert(error);
    throw Error('Impossible d\'obtenir les valeurs d\'intensité cathode');
  }

  return iCathodeSample;
};

const getSerialConnection = async (): Promise<SerialPort> => {
  // Get all serial ports the user has previously granted the website access to.
  const ports = await navigator.serial.getPorts();
  let serialConnection;

  if (ports.length > 0) {
    [serialConnection] = ports;
  } else {
    // Filter on devices with the valid USB Vendor/Product IDs.
    const filters = [
      { usbVendorId: 0x0403, usbProductId: 0x6001 },
    ];

    // Prompt user to select a device matching filters.
    serialConnection = await navigator.serial.requestPort({ filters });
  }

  // Wait for the serial port to open.
  await serialConnection.open({
    baudRate: 2400,
    dataBits: 8,
    stopBits: 2,
    parity: 'none',
  });

  return serialConnection;
};

export type CaptureData = {
  tensionsAnode: number[],
  currentsCathode: number[],
};

const captureSerial = async (
  serialReader: ReadableStreamDefaultReader<Uint8Array>,
  serialWriter: WritableStreamDefaultWriter<Uint8Array>,
  uGrid: number, samplingMode: SamplingMode,
): Promise<CaptureData> => {
  const tensionsAnode = await acquireTensionsAnode(serialReader, serialWriter);

  const sampling = samplingMode === SamplingMode.AN1 ? 32 : 50;

  await writeByteSerial(serialWriter, sampling);

  const currentsCathode = await acquireCurrentCathode(
    serialReader, serialWriter, uGrid, samplingMode,
  );

  await writeByteSerial(serialWriter, 105);

  return { tensionsAnode, currentsCathode };
};

export const performCapture = async (
  uGrid: number, slidingFactor: number,
): Promise<CaptureData> => {
  const serialConnection: SerialPort = await getSerialConnection();

  const serialReader = (<ReadableStream<Uint8Array>>serialConnection.readable).getReader();
  const serialWriter = (<WritableStream<Uint8Array>>serialConnection.writable).getWriter();

  let captureData: CaptureData;
  let tensionsAnode: number[];
  let currentsCathodeRaw: number[];

  try {
    // Perform capture once in sampling mode AN1 (Imax < 32mA)
    captureData = await captureSerial(
      serialReader, serialWriter, uGrid, SamplingMode.AN1,
    );
    tensionsAnode = captureData.tensionsAnode;
    currentsCathodeRaw = captureData.currentsCathode;

    // Counts the number of values being arround max capturable value 32mA
    const epsilon = 0.1;
    const edge = currentsCathodeRaw.filter((current) => Math.abs(current - 32) < epsilon);
    if (edge.length >= 5) {
      // If this number exceeds 5, performs a second capture with sampling mode AN2
      captureData = await captureSerial(
        serialReader, serialWriter, uGrid, SamplingMode.AN2,
      );
      tensionsAnode = captureData.tensionsAnode;
      currentsCathodeRaw = captureData.currentsCathode;
    }
  } finally {
    serialReader.cancel();
    serialReader.releaseLock();

    await serialWriter.close();

    await serialConnection.close();
  }

  // Sliding window average
  const k = slidingFactor;
  const currentsCathode = [];
  for (let i = 0; i < currentsCathodeRaw.length - k; i += 1) {
    const a = Math.max(0, i - k);
    const b = Math.min(currentsCathodeRaw.length - 1, i + k);

    const avg = currentsCathodeRaw.slice(a, b + 1)
      .reduce((prev, curr) => prev + curr, 0) / (b - a + 1);
    currentsCathode.push(
      avg,
    );
  }

  return { tensionsAnode, currentsCathode };
};

const detectErrorTest = (
  array: number[],
  refValue: number,
  tolerance: number,
  toleranceBeta: number,
) => {
  let errorVal;
  for (let i = 0; i < array.length; i += 1) {
    const element = array[i];
    if (Math.abs(refValue - element) > tolerance * refValue + toleranceBeta) {
      errorVal = element;
      break;
    }
  }
  return errorVal;
};

export const performTest = async (): Promise<void> => {
  const serialConnection: SerialPort = await getSerialConnection();

  if (serialConnection.readable === null || serialConnection.writable === null) {
    throw Error('Something went wrong during opening of serial port');
  }

  const serialReader = serialConnection.readable.getReader();
  const serialWriter = serialConnection.writable.getWriter();

  const uAnodeMax = [];
  const iCathode32 = [];
  const iCathode256 = [];
  const uGrid = [];

  try {
    writeByteSerial(serialWriter, 124);

    let toReadCommands = 20;
    const leftovers = [];

    while (toReadCommands > 0) {
      const readBuffer: number[] = await readBytesSerialWithTimeout(
        serialReader, 3 - leftovers.length, 500,
      );
      leftovers.push(...readBuffer);
      while (leftovers.length / 3 >= 1) {
        toReadCommands -= 1;
        const received = leftovers.splice(0, 3);

        const category = received[0];
        const value = (received[1] << 8) + received[2];

        switch (category) {
          case 126:
            uAnodeMax.push(value * 0.46875);
            break;
          case 151:
            iCathode32.push(value * 0.03125);
            break;
          case 111:
            iCathode256.push(value * 0.25);
            break;
          case 107:
            uGrid.push(value);
            break;
          default:
            throw new Error('Le programme a recu une mesure de test invalide');
        }
      }
    }
  } finally {
    await writeByteSerial(serialWriter, 0);

    serialReader.cancel();
    serialReader.releaseLock();

    await serialWriter.close();

    await serialConnection.close();
  }

  let diagnosticMessage = 'Test terminé\n';

  const uAnodeRef = 280;
  const uAnodeError = detectErrorTest(uAnodeMax, uAnodeRef, 0.05, 0);

  const iCathode32Ref = 0;
  const i32CathodeError = detectErrorTest(iCathode32, iCathode32Ref, 0, 0.5);

  const iCathode256Ref = 0;
  const i256CathodeError = detectErrorTest(iCathode256, iCathode256Ref, 0, 0.5);

  const uGridRef = 31;
  const uGridError = detectErrorTest(uGrid, uGridRef, 0, 0);

  if (!(uAnodeError || i32CathodeError || i256CathodeError || uGridError)) {
    diagnosticMessage += 'Aucune anomalie à signaler';
  } else {
    diagnosticMessage += 'Anomalies détectées:\n';

    if (uAnodeError) {
      diagnosticMessage += `-Tension plaque max: ${uAnodeError} capturé (tension de référence ${uAnodeRef}V)\n`;
    }
    if (i32CathodeError) {
      diagnosticMessage += `-Intensité cathode 32mA: ${i32CathodeError} capturé (intensité de référence ${iCathode32Ref}mA)\n`;
    }
    if (i256CathodeError) {
      diagnosticMessage += `-Intensité cathode 32mA: ${i256CathodeError} capturé (intensité de référence ${iCathode256Ref}mA)\n`;
    }
    if (uGridError) {
      diagnosticMessage += `-Tension grille: -${uGridError} capturé (tension de référence -${uGridRef}V)\n`;
    }
  }
  alert(diagnosticMessage);
};
