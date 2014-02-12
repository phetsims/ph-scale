// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function DrainFaucetNode( faucet, mvt ) {

    var scale = 0.6;
    var tapToDispenseAmount = Math.pow( 10, -PHScaleConstants.VOLUME_DECIMAL_PLACES ); // L
    var tapToDispenseInterval = 500; // ms

    var horizontalPipeLength = Math.abs( mvt.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 5,
      tapToDispenseFlowRate: tapToDispenseAmount / ( tapToDispenseInterval / 1000 ), // L/sec
      tapToDispenseInterval: tapToDispenseInterval
    } );
    this.translation = mvt.modelToViewPosition( faucet.location );
    this.setScaleMagnitude( -scale, scale ); // reflect
  }

  return inherit( FaucetNode, DrainFaucetNode );
} );