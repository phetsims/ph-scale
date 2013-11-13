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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @param {string} label optional label
   * @constructor
   */
  function PHFaucetNode( faucet, mvt, decoration ) {
    var scale = 0.6;
    var horizontalPipeLength = mvt.modelToViewX( faucet.location.x - faucet.pipeMinX ) / scale;
    FaucetNode.call( this, faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      decoration: decoration,
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 20,
      scale: scale
    } );
    this.translation = mvt.modelToViewPosition( faucet.location );
  }

  return inherit( FaucetNode, PHFaucetNode );
} );