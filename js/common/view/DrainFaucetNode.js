// Copyright 2013-2019, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function DrainFaucetNode( faucet, modelViewTransform ) {

    var scale = 0.6;

    var horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 5,
      tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
      tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      }
    } );
    this.translation = modelViewTransform.modelToViewPosition( faucet.location );
    this.setScaleMagnitude( -scale, scale ); // reflect horizontally
  }

  phScale.register( 'DrainFaucetNode', DrainFaucetNode );

  return inherit( FaucetNode, DrainFaucetNode );
} );