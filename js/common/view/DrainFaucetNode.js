// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const SCALE = 0.6;

  class DrainFaucetNode extends FaucetNode {

    /**
     * @param {Faucet} faucet
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( faucet, modelViewTransform, options ) {

      const horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) ) / SCALE;

      options = merge( {

        // FaucetNode options
        horizontalPipeLength: horizontalPipeLength,
        verticalPipeLength: 5,
        tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
        tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL,
        shooterOptions: {
          touchAreaXDilation: 37,
          touchAreaYDilation: 60
        },

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );
      this.translation = modelViewTransform.modelToViewPosition( faucet.position );
      this.setScaleMagnitude( -SCALE, SCALE ); // reflect horizontally
    }
  }

  return phScale.register( 'DrainFaucetNode', DrainFaucetNode );
} );