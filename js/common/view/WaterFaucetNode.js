// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  // constants
  const SCALE = 0.6;

  class WaterFaucetNode extends Node {

    /**
     * @param {Faucet} faucet
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( faucet, modelViewTransform, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      const horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) ) / SCALE;

      const faucetNode = new FaucetNode( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, {
        horizontalPipeLength: horizontalPipeLength,
        verticalPipeLength: 20,
        tapToDispenseAmount: PHScaleConstants.TAP_TO_DISPENSE_AMOUNT,
        tapToDispenseInterval: PHScaleConstants.TAP_TO_DISPENSE_INTERVAL,
        shooterOptions: {
          touchAreaXDilation: 37,
          touchAreaYDilation: 60
        },
        tandem: options.tandem.createTandem( 'faucetNode' )
      } );
      faucetNode.translation = modelViewTransform.modelToViewPosition( faucet.position );
      faucetNode.setScaleMagnitude( -SCALE, SCALE ); // reflect horizontally
      this.addChild( faucetNode );

      // decorate the faucet with the name of the water
      const waterLabelNode = new Text( Water.name, {
        font: new PhetFont( 28 ),
        maxWidth: 85,
        left: faucetNode.left + 115,
        bottom: faucetNode.centerY - 40,
        tandem: options.tandem.createTandem( 'waterLabelNode' )
      } );
      this.addChild( waterLabelNode );
    }
  }

  return phScale.register( 'WaterFaucetNode', WaterFaucetNode );
} );
