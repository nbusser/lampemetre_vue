import * as Excel from 'exceljs';
import * as fs from 'file-saver';
import ModelTube from './model/ModelTube';
import ModelCapture from './model/ModelCapture';
import {
  computeAmplificationFactor,
  computeInternalResistance,
  computeSelectedIcathode,
  computeTransductance,
} from './MeasurementFunctions';

export const exportToExcel = (tubes: ModelTube[], measurements: number[]): void => {
  const workbook = new Excel.Workbook();
  workbook.creator = 'Lampemetre-web';
  workbook.created = new Date();
  workbook.modified = new Date();

  tubes.forEach((tube: ModelTube) => {
    const worksheet = workbook.addWorksheet(tube.name);

    let iter = 1;
    tube.captures.forEach((capture: ModelCapture) => {
      const table: Excel.Table = worksheet.addTable({
        name: `${tube.name} ${capture.toString()}`,
        ref: worksheet.getCell(1, iter).address,
        headerRow: true,
        totalsRow: true,
        columns: [
          {
            name: 'Tension Anode',
            totalsRowLabel: '',
            filterButton: false,
          },
          {
            name: `Intensité cathode (uGrid ${capture.uGrid})`,
            totalsRowFunction: 'none',
            filterButton: false,
          },
        ],
        rows: [
        ],
      });
      for (let i = 0; i < capture.uAnode.length; i += 1) {
        table.addRow([capture.uAnode[i], capture.iCathode[i]]);
      }
      table.commit();
      iter += 3;
    });
  });

  const worksheet = workbook.addWorksheet('Mesures');
  const measuresTable: Excel.Table = worksheet.addTable({
    name: 'Measures',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    columns: [
      { name: 'Tension anode mesure', totalsRowLabel: '', filterButton: false },
      { name: 'Nom du tube', totalsRowLabel: '', filterButton: false },
      { name: 'Tension grille', totalsRowFunction: 'none', filterButton: false },
      { name: 'Courant cathode', totalsRowLabel: 'none', filterButton: false },
      { name: 'Résistance interne', totalsRowFunction: 'none', filterButton: false },
      { name: 'Transductance', totalsRowFunction: 'none', filterButton: false },
      { name: 'Facteur d\'amplification', totalsRowFunction: 'none', filterButton: false },
    ],
    rows: [
    ],
  });
  measurements.forEach((uAnode: number) => {
    tubes.forEach((tube: ModelTube) => {
      const { selectedUgrid } = tube;
      if (selectedUgrid !== null) {
        const values = [uAnode, tube.name, selectedUgrid];

        const measurementsValues: (string | number)[] = [
          computeSelectedIcathode(tube, uAnode),
          computeInternalResistance(tube, uAnode),
          computeTransductance(tube, uAnode),
          computeAmplificationFactor(tube, uAnode),
        ];
        const units: string[] = [
          'mA',
          'kOhm',
          'mA/V (mS)',
          '',
        ];
        measurementsValues.forEach((measurement: string | number, i) => {
          values.push(
            typeof measurement === 'string' ? '/' : `${measurement} ${units[i]}`,
          );
        });

        measuresTable.addRow(values);
        measuresTable.commit();
      }
    });
  });

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, `lampemetre-${new Date().valueOf()}.xlsx`);
  });
};

export const importFromExcel = (excelData: ArrayBuffer): ModelTube[] => {
  console.log(`import ${excelData}`);
  return [];
};
