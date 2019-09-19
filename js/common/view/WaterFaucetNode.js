// Copyright 2013-2019, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  /**
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function WaterFaucetNode( faucet, modelViewTransform ) {

    Node.call( this );

    var scale = 0.6;

    var horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.location.x - faucet.pipeMinX ) ) / scale;
    var faucetNode = new FaucetNode( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 20,
      tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
      tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL,
      shooterOptions: {
        touchAreaXDilation: 37,
        touchAreaYDilation: 60
      }
    } );
    faucetNode.translation = modelViewTransform.modelToViewPosition( faucet.location );
    faucetNode.setScaleMagnitude( -scale, scale ); // reflect horizontally
    this.addChild( faucetNode );

    // decorate the faucet with the name of the water
    var labelNode = new Text( Water.name, { font: new PhetFont( 28 ), maxWidth: 85 } );
    this.addChild( labelNode );
    labelNode.left = faucetNode.left + 115;
    labelNode.bottom = faucetNode.centerY - 40;
  }

  phScale.register( 'WaterFaucetNode', WaterFaucetNode );

  return inherit( Node, WaterFaucetNode );
} );
