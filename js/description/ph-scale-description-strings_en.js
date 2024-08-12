// Copyright 2023-2024, University of Colorado Boulder

// @author Jonathan Olson <jonathan.olson@colorado.edu>

// eslint-disable

export default () => {
  const soluteMap = {
    batteryAcid: 'battery acid',
    blood: 'blood',
    chickenSoup: 'chicken soup',
    coffee: 'coffee',
    drainCleaner: 'drain cleaner',
    handSoap: 'hand soap',
    milk: 'milk',
    orangeJuice: 'orange juice',
    soda: 'soda',
    spit: 'spit',
    vomit: 'vomit',
    water: 'water'
  };

  const totalVolumeMap = {
    empty: 'empty',
    partiallyFilled: 'partially filled',
    full: 'full'
  };

  return phet.joist.DescriptionContext.registerStrings( {
    locale: 'en',
    screenSummary() {
      return 'Place description of the screen here, or break into multiple paragraphs';
    },
    screenSummarySimStateDescription(
      solute,
      totalVolume
    ) {
      return `The solute is ${soluteMap[ solute ]}, and the total volume is ${totalVolumeMap[ totalVolume ]}.`;
    },
    soluteComboBoxAccessibleName() {
      return 'Solute';
    },
    soluteName( solute ) {
      return soluteMap[ solute ];
    },
    dropperDispensingAlert(
      isDispensing
    ) {
      return isDispensing ? 'Dispensing' : 'Not dispensing';
    }
  } );
};