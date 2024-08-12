// Copyright 2023-2024, University of Colorado Boulder

// @author Jonathan Olson <jonathan.olson@colorado.edu>

// eslint-disable

export default () => {
  const soluteMap = {
    batteryAcid: 'ácido de batería',
    blood: 'sangre',
    chickenSoup: 'sopa de pollo',
    coffee: 'café',
    drainCleaner: 'limpiador de desagües',
    handSoap: 'jabón de manos',
    milk: 'leche',
    orangeJuice: 'jugo de naranja',
    soda: 'gaseosa',
    spit: 'saliva',
    vomit: 'vómito',
    water: 'agua'
  };

  const totalVolumeMap = {
    empty: 'vacía',
    partiallyFilled: 'parcialmente lleno',
    full: 'lleno'
  };

  return phet.joist.DescriptionContext.registerStrings( {
    locale: 'es',
    screenSummary() {
      return 'Coloque la descripción de la pantalla aquí o divídala en varios párrafos';
    },
    screenSummarySimStateDescription(
      solute,
      totalVolume
    ) {
      return `El soluto es ${soluteMap[ solute ]}, y el volumen total es ${totalVolumeMap[ totalVolume ]}.`;
    },
    soluteComboBoxAccessibleName() {
      return 'Soluto';
    },
    soluteName( solute ) {
      return soluteMap[ solute ];
    },
    dropperDispensingAlert(
      isDispensing
    ) {
      return isDispensing ? 'dispensando' : 'no dispensando';
    }
  } );
};