// Copyright 2020-2021, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import phScale from './phScale.js';

type StringsType = {
  'ph-scale': {
    'title': string
  },
  'screen': {
    'macro': string,
    'micro': string,
    'mySolution': string
  },
  'choice': {
    'milk': string,
    'chickenSoup': string,
    'batteryAcid': string,
    'vomit': string,
    'soda': string,
    'orangeJuice': string,
    'coffee': string,
    'spit': string,
    'blood': string,
    'handSoap': string,
    'water': string,
    'drainCleaner': string
  },
  'units': {
    'liters': string,
    'moles': string,
    'molesPerLiter': string
  },
  'pattern': {
    '0value': {
      '1units': string
    }
  },
  'pH': string,
  'acidic': string,
  'basic': string,
  'neutral': string,
  'concentration': string,
  'quantity': string,
  'moleculeCount': string,
  'ratio': string,
  'linear': string,
  'logarithmic': string,
  'offScale': string
};

const phScaleStrings = getStringModule( 'PH_SCALE' ) as StringsType;

phScale.register( 'phScaleStrings', phScaleStrings );

export default phScaleStrings;
