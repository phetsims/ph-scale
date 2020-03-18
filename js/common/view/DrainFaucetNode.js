// Copyright 2013-2020, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FaucetNode from '../../../../scenery-phet/js/FaucetNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import PHScaleConstants from '../PHScaleConstants.js';

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

    options = merge( {}, PHScaleConstants.FAUCET_OPTIONS, {

      // FaucetNode options
      horizontalPipeLength: horizontalPipeLength,
      verticalPipeLength: 5,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );
    this.translation = modelViewTransform.modelToViewPosition( faucet.position );
    this.setScaleMagnitude( -SCALE, SCALE ); // reflect horizontally
  }
}

phScale.register( 'DrainFaucetNode', DrainFaucetNode );
export default DrainFaucetNode;