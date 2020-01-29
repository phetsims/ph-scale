// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const phScale = require( 'PH_SCALE/phScale' );

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
        enabled: true
      }, options );

      // @public
      this.position = position;
      this.pipeMinX = pipeMinX;
      this.spoutWidth = options.spoutWidth;
      this.maxFlowRate = options.maxFlowRate;
      this.flowRateProperty = new NumberProperty( options.flowRate );
      this.enabledProperty = new BooleanProperty( options.enabled );

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

  return phScale.register( 'Faucet', Faucet );
} );

