// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import Water from '../model/Water.js';
import PHScaleConstants from '../PHScaleConstants.js';

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

    const faucetNode = new FaucetNode( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty,
      merge( {}, PHScaleConstants.FAUCET_OPTIONS, {
        horizontalPipeLength: horizontalPipeLength,
        verticalPipeLength: 20,
        tandem: options.tandem.createTandem( 'faucetNode' )
      } ) );
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

phScale.register( 'WaterFaucetNode', WaterFaucetNode );
export default WaterFaucetNode;