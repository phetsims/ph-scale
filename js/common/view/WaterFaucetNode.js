// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Water} water
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function WaterFaucetNode( water, faucet, mvt ) {

    Node.call( this );

    var scale = 0.6;
    var tapToDispenseAmount = Math.pow( 10, -PHScaleConstants.VOLUME_DECIMAL_PLACES ); // L
    var tapToDispenseInterval = 500; // ms

    var horizontalPipeLength = Math.abs( mvt.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    var faucetNode = new FaucetNode( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 20,
      tapToDispenseFlowRate: tapToDispenseAmount / ( tapToDispenseInterval / 1000 ), // L/sec
      tapToDispenseInterval: tapToDispenseInterval
    } );
    faucetNode.translation = mvt.modelToViewPosition( faucet.location );
    faucetNode.setScaleMagnitude( -scale, scale ); // reflect
    this.addChild( faucetNode );

    // decorate the faucet with the name of the water
    var labelNode = new Text( water.name, { font: new PhetFont( 28 ) } );
    this.addChild( labelNode );
    labelNode.right = faucetNode.left + 190;
    labelNode.bottom = faucetNode.centerY - 40;
  }

  return inherit( Node, WaterFaucetNode );
} );
