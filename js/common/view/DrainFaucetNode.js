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
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  class DrainFaucetNode extends FaucetNode {

    /**
     * @param {Faucet} faucet
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( faucet, modelViewTransform ) {

      const scale = 0.6;

      const horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) ) / scale;

      super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
        horizontalPipeLength: horizontalPipeLength,
        verticalPipeLength: 5,
        tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
        tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL,
        shooterOptions: {
          touchAreaXDilation: 37,
          touchAreaYDilation: 60
        }
      } );
      this.translation = modelViewTransform.modelToViewPosition( faucet.position );
      this.setScaleMagnitude( -scale, scale ); // reflect horizontally
    }
  }

  return phScale.register( 'DrainFaucetNode', DrainFaucetNode );
} );