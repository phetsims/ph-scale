// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet node for this sim.
 * Handles scaling, and adapters our Faucet model to scenery-phet.FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function PHFaucetNode( faucet, mvt ) {
    var scale = 0.6;
    var horizontalPipeLength = mvt.modelToViewX( faucet.location.x - faucet.pipeMinX ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, { horizontalPipeLength: horizontalPipeLength, scale: scale } );
    this.translation = mvt.modelToViewPosition( faucet.location );
  }

  return inherit( FaucetNode, PHFaucetNode );
} );