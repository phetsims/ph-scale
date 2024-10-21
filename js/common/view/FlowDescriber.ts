// Copyright 2024, University of Colorado Boulder

/**
 * This file manages logic for generating strings describing the flow rate.
 *
 * It maps values from the model to enumerated types that are used to generate description strings.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import phScale from '../../phScale.js';

export type FlowRateDescriptor = 'closed' | 'openATinyBit' | 'openALittle' | 'somewhatOpen' | 'halfwayOpen' | 'openALot' | 'fullyOpen';

export default class SolutionDescriber {
  public constructor() {
  }

  public static flowRateToEnum( flowRate: number ): FlowRateDescriptor {
    if ( flowRate === 0 ) {
      return 'closed';
    }
    else if ( flowRate <= 0.10 * 0.25 ) {
      return 'openATinyBit';
    }
    else if ( flowRate <= 0.30 * 0.25 ) {
      return 'openALittle';
    }
    else if ( flowRate < 0.48 * 0.25 ) {
      return 'somewhatOpen';
    }
    else if ( flowRate < 0.52 * 0.25 ) {
      return 'halfwayOpen';
    }
    else if ( flowRate < 1.00 * 0.25 ) {
      return 'openALot'
    }
    else {
      return 'fullyOpen';
    }
  }
}

phScale.register( 'SolutionDescriber', SolutionDescriber );