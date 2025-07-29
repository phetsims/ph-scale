// Copyright 2021-2025, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
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
    'jumpToPositionStringProperty': LocalizedStringProperty;
  };
  'autoFillStringProperty': LocalizedStringProperty;
  'autoFillDescriptionStringProperty': LocalizedStringProperty;
  'a11y': {
    'ratioCheckboxAccessibleNameStringProperty': LocalizedStringProperty;
    'pHValuePatternStringProperty': LocalizedStringProperty;
    'pHValueUnknownStringProperty': LocalizedStringProperty;
    'unknownStringProperty': LocalizedStringProperty;
    'qualitativePHDescription': {
      'extremelyBasicStringProperty': LocalizedStringProperty;
      'highlyBasicStringProperty': LocalizedStringProperty;
      'moderatelyBasicStringProperty': LocalizedStringProperty;
      'slightlyBasicStringProperty': LocalizedStringProperty;
      'neutralStringProperty': LocalizedStringProperty;
      'slightlyAcidicStringProperty': LocalizedStringProperty;
      'moderatelyAcidicStringProperty': LocalizedStringProperty;
      'highlyAcidicStringProperty': LocalizedStringProperty;
      'extremelyAcidicStringProperty': LocalizedStringProperty;
    };
    'macroScreenSummary': {
      'playAreaStringProperty': LocalizedStringProperty;
      'controlAreaStringProperty': LocalizedStringProperty;
      'currentDetails': {
        'emptyBeakerStringProperty': LocalizedStringProperty;
        'currentlyStringProperty': LocalizedStringProperty;
        'beakerWithSolutionStringProperty': LocalizedStringProperty;
        'pHValueStringProperty': LocalizedStringProperty;
      };
      'interactionHint': {
        'emptyBeakerStringProperty': LocalizedStringProperty;
        'beakerWithSolutionStringProperty': LocalizedStringProperty;
      }
    };
    'pHMeter': {
      'headingStringProperty': LocalizedStringProperty;
      'descriptionStringProperty': LocalizedStringProperty;
    };
    'probe': {
      'accessibleNameStringProperty': LocalizedStringProperty;
      'accessibleHelpTextStringProperty': LocalizedStringProperty;
      'accessibleObjectResponses': {
        'insideBeakerStringProperty': LocalizedStringProperty;
        'underWaterFaucetStringProperty': LocalizedStringProperty;
        'underDropperStringProperty': LocalizedStringProperty;
        'underDrainFaucetStringProperty': LocalizedStringProperty;
        'outsideBeakerStringProperty': LocalizedStringProperty;
      }
    };
    'beakerControls': {
      'accessibleHeadingStringProperty': LocalizedStringProperty;
      'soluteComboBox': {
        'accessibleNameStringProperty': LocalizedStringProperty;
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
        'batteryAcidAccessibleNameStringProperty': LocalizedStringProperty;
        'bloodAccessibleNameStringProperty': LocalizedStringProperty;
        'chickenSoupAccessibleNameStringProperty': LocalizedStringProperty;
        'coffeeAccessibleNameStringProperty': LocalizedStringProperty;
        'drainCleanerAccessibleNameStringProperty': LocalizedStringProperty;
        'handSoapAccessibleNameStringProperty': LocalizedStringProperty;
        'milkAccessibleNameStringProperty': LocalizedStringProperty;
        'orangeJuiceAccessibleNameStringProperty': LocalizedStringProperty;
        'sodaPopAccessibleNameStringProperty': LocalizedStringProperty;
        'spitAccessibleNameStringProperty': LocalizedStringProperty;
        'vomitAccessibleNameStringProperty': LocalizedStringProperty;
        'waterAccessibleNameStringProperty': LocalizedStringProperty;
      };
      'dropper': {
        'accessibleNameStringProperty': LocalizedStringProperty;
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
        'accessibleContextResponseStringProperty': LocalizedStringProperty;
      };
      'waterFaucet': {
        'accessibleNameStringProperty': LocalizedStringProperty;
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
      };
      'drainFaucet': {
        'accessibleNameStringProperty': LocalizedStringProperty;
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
      };
      'accessibleHelpTextStringProperty': LocalizedStringProperty;
      'addSoluteButtonStringProperty': LocalizedStringProperty;
      'moveProbeButtonStringProperty': LocalizedStringProperty;
      'dispenseLiquidButtonStringProperty': LocalizedStringProperty;
    }
  }
};

const PhScaleStrings = getStringModule( 'PH_SCALE' ) as StringsType;

phScale.register( 'PhScaleStrings', PhScaleStrings );

export default PhScaleStrings;
