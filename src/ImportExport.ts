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

export const importFromExcel = async (excelData: ArrayBuffer): Promise<ModelTube[]> => {
  const tubes: ModelTube[] = [];

  const wb = new Excel.Workbook();

  const workbook = await wb.xlsx.load(excelData);

  // Each sheet is a tube, except for the 'last' sheet, which is measures sheet
  workbook.eachSheet((worksheet: Excel.Worksheet) => {
    // Ignore sheets named 'Mesures'
    if (worksheet.name !== 'Mesures') {
      const tube = new ModelTube(worksheet.name);

      const captures: ModelCapture[] = [];

      /*
        First, creates all the captures by parsing the header
        The header of each sheet contains n times the following sequence:
        'Tension Anode' | 'Intensité cathode (uGrid x)' | Blank cell
        Each of these sequences define capture for a single grid tension (here labeled 'x').
        */
      const headerRow: Excel.Row = worksheet.getRow(1);
      const regex = /[-+]?\d+(\.\d*)?/; // Used to parse the grid tension from the table header
      const uGridErrorMessage = `Valeur de tension de grille non trouvée dans l'en-tête du tube ${worksheet.name}`;
      for (let c = 2; c < worksheet.columnCount + 1; c += 3) {
        const cellValue = headerRow.getCell(c).value;
        if (cellValue === null || cellValue === undefined) {
          alert(uGridErrorMessage);
          return;
        }

        // See if uGrid is properly defined in the table header
        const foundUGrid = cellValue.toString().match(regex);
        if (foundUGrid === null || foundUGrid === undefined) {
          alert(uGridErrorMessage);
          return;
        }

        // Creates a capture with this uGrid
        const uGrid = Number.parseFloat(foundUGrid.toString());
        captures.push(new ModelCapture([], uGrid, []));
      }

      // Then, the program iterates each rows and extracts the values for each captures in the row
      worksheet.eachRow((row: Excel.Row, rowNumber: number) => {
        if (rowNumber !== 1) {
          for (let c = 1; c < worksheet.columnCount; c += 3) {
            // Gets the correct capture
            const capture = captures[Math.floor(c / 3)];

            // Extracts the content of 'Tension Anode' and 'Intensité cathode' cells
            const uAnodeCellValue = row.getCell(c).value;
            const iCathodeCellValue = row.getCell(c + 1).value;

            if (uAnodeCellValue !== null && uAnodeCellValue !== undefined
                && iCathodeCellValue !== null && iCathodeCellValue !== undefined) {
              // Tries to parse values to float
              const uAnode = Number.parseFloat(uAnodeCellValue.toString());
              const iCathode = Number.parseFloat(iCathodeCellValue.toString());

              // Ends function here if we cannot parse the read values to float
              const parseError = `Erreur lors de la lecture de la catpure de tension grille ${capture.uGrid}.\n
                Valeur non numérique trouvée: `;
              if (Number.isNaN(uAnode)) {
                alert(`${parseError}'${uAnodeCellValue}' (tension anode)`);
                return;
              }
              if (Number.isNaN(iCathode)) {
                alert(`${parseError}'${iCathodeCellValue}' (intensité cathode)`);
                return;
              }

              capture.uAnode.push(uAnode);
              capture.iCathode.push(iCathode);
            }
          }
        }
      });

      // Adds capture to the tube
      captures.forEach((capture) => {
        tube.createCapture(capture.uAnode, capture.uGrid, capture.iCathode);
      });

      tubes.push(tube);
    }
  });
  return tubes;
};
