// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import phScale from './phScale.js';

type StringsType = {
  'ph-scale': {
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'macroStringProperty': TReadOnlyProperty<string>;
    'microStringProperty': TReadOnlyProperty<string>;
    'mySolutionStringProperty': TReadOnlyProperty<string>;
  };
  'choice': {
    'milkStringProperty': TReadOnlyProperty<string>;
    'chickenSoupStringProperty': TReadOnlyProperty<string>;
    'batteryAcidStringProperty': TReadOnlyProperty<string>;
    'vomitStringProperty': TReadOnlyProperty<string>;
    'sodaStringProperty': TReadOnlyProperty<string>;
    'orangeJuiceStringProperty': TReadOnlyProperty<string>;
    'coffeeStringProperty': TReadOnlyProperty<string>;
    'spitStringProperty': TReadOnlyProperty<string>;
    'bloodStringProperty': TReadOnlyProperty<string>;
    'handSoapStringProperty': TReadOnlyProperty<string>;
    'waterStringProperty': TReadOnlyProperty<string>;
    'drainCleanerStringProperty': TReadOnlyProperty<string>;
  };
  'units': {
    'litersStringProperty': TReadOnlyProperty<string>;
    'molesStringProperty': TReadOnlyProperty<string>;
    'molesPerLiterStringProperty': TReadOnlyProperty<string>;
  };
  'pattern': {
    '0value': {
      '1unitsStringProperty': TReadOnlyProperty<string>;
    }
  };
  'pHStringProperty': TReadOnlyProperty<string>;
  'acidicStringProperty': TReadOnlyProperty<string>;
  'basicStringProperty': TReadOnlyProperty<string>;
  'neutralStringProperty': TReadOnlyProperty<string>;
  'concentrationStringProperty': TReadOnlyProperty<string>;
  'quantityStringProperty': TReadOnlyProperty<string>;
  'moleculeCountStringProperty': TReadOnlyProperty<string>;
  'ratioStringProperty': TReadOnlyProperty<string>;
  'linearStringProperty': TReadOnlyProperty<string>;
  'logarithmicStringProperty': TReadOnlyProperty<string>;
  'offScaleStringProperty': TReadOnlyProperty<string>;
};

const phScaleStrings = getStringModule( 'PH_SCALE' ) as StringsType;

phScale.register( 'phScaleStrings', phScaleStrings );

export default phScaleStrings;
