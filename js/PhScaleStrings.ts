// Copyright 2021-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import phScale from './phScale.js';

type StringsType = {
  'ph-scale': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'macroStringProperty': LocalizedStringProperty;
    'microStringProperty': LocalizedStringProperty;
    'mySolutionStringProperty': LocalizedStringProperty;
  };
  'choice': {
    'milkStringProperty': LocalizedStringProperty;
    'chickenSoupStringProperty': LocalizedStringProperty;
    'batteryAcidStringProperty': LocalizedStringProperty;
    'vomitStringProperty': LocalizedStringProperty;
    'sodaStringProperty': LocalizedStringProperty;
    'orangeJuiceStringProperty': LocalizedStringProperty;
    'coffeeStringProperty': LocalizedStringProperty;
    'spitStringProperty': LocalizedStringProperty;
    'bloodStringProperty': LocalizedStringProperty;
    'handSoapStringProperty': LocalizedStringProperty;
    'waterStringProperty': LocalizedStringProperty;
    'drainCleanerStringProperty': LocalizedStringProperty;
  };
  'units': {
    'litersStringProperty': LocalizedStringProperty;
    'molesStringProperty': LocalizedStringProperty;
    'molesPerLiterStringProperty': LocalizedStringProperty;
  };
  'pattern': {
    '0value': {
      '1unitsStringProperty': LocalizedStringProperty;
    };
    'H3O': {
      'OH': {
        'ratioStringProperty': LocalizedStringProperty;
      }
    }
  };
  'pHStringProperty': LocalizedStringProperty;
  'acidicStringProperty': LocalizedStringProperty;
  'basicStringProperty': LocalizedStringProperty;
  'neutralStringProperty': LocalizedStringProperty;
  'concentrationStringProperty': LocalizedStringProperty;
  'quantityStringProperty': LocalizedStringProperty;
  'particleCountsStringProperty': LocalizedStringProperty;
  'ratioStringProperty': LocalizedStringProperty;
  'linearStringProperty': LocalizedStringProperty;
  'logarithmicStringProperty': LocalizedStringProperty;
  'offScaleStringProperty': LocalizedStringProperty;
  'keyboardHelpDialog': {
    'chooseASoluteStringProperty': LocalizedStringProperty;
    'soluteStringProperty': LocalizedStringProperty;
    'solutesStringProperty': LocalizedStringProperty;
    'moveThePHProbeStringProperty': LocalizedStringProperty;
    'moveTheGraphIndicatorsStringProperty': LocalizedStringProperty;
    'moveStringProperty': LocalizedStringProperty;
    'moveSlowerStringProperty': LocalizedStringProperty;
  }
};

const PhScaleStrings = getStringModule( 'PH_SCALE' ) as StringsType;

phScale.register( 'PhScaleStrings', PhScaleStrings );

export default PhScaleStrings;
