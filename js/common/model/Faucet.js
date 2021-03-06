// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';

class Faucet {

  /**
   * @param {Vector2} position center of output pipe
   * @param {number} pipeMinX x-coordinate of where the pipe starts
   * @param {Object} [options]
   * @constructor
   */
  constructor( position, pipeMinX, options ) {

    options = merge( {
      spoutWidth: 45, // pixels
      maxFlowRate: 0.25, // L/sec
      flowRate: 0,
      enabled: true,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.position = position;
    this.pipeMinX = pipeMinX;
    this.spoutWidth = options.spoutWidth;
    this.maxFlowRate = options.maxFlowRate;

    // @public
    this.flowRateProperty = new NumberProperty( options.flowRate, {
      range: new Range( 0, options.maxFlowRate ),
      units: 'L/s',
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the flow rate of solution coming out of the faucet',
      phetioHighFrequency: true
    } );

    // @public
    this.enabledProperty = new BooleanProperty( options.enabled, {
      tandem: options.tandem.createTandem( 'enabledProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the faucet is enabled'
    } );

    // when disabled, turn off the faucet.
    this.enabledProperty.link( enabled => {
      if ( !enabled ) {
        this.flowRateProperty.set( 0 );
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.flowRateProperty.reset();
    this.enabledProperty.reset();
  }
}

phScale.register( 'Faucet', Faucet );
export default Faucet;