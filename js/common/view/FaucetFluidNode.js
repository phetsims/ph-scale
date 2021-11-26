// Copyright 2013-2021, University of Colorado Boulder

/**
 * Fluid coming out of a faucet.
 * Origin is at the top center, to simplify alignment with the center of the faucet's spout.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';

class FaucetFluidNode extends Rectangle {

  /**
   * @param {Faucet} faucet
   * @param {Property.<Color>} colorProperty
   * @param {number} height in model coordinates
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( faucet, colorProperty, height, modelViewTransform, options ) {

    options = merge( {

      lineWidth: 1,
      pickable: false
    }, options );

    // See https://github.com/phetsims/ph-scale/issues/107
    assert && assert( !options.tandem, 'do not instrument FaucetFluidNode' );

    super( 0, 0, 0, 0, options );

    // Set the color of the fluid coming out of the spout.
    colorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor();
    } );

    /*
     * Set the width of the shape to match the flow rate.
     * @param {number} flowRate
     */
    const viewPosition = modelViewTransform.modelToViewPosition( faucet.position );
    const viewHeight = modelViewTransform.modelToViewDeltaY( height );
    faucet.flowRateProperty.link( flowRate => {
      if ( flowRate === 0 ) {
        this.setRect( -1, -1, 0, 0 ); // empty rectangle, at a position where we won't intersect with it
      }
      else {
        const viewWidth = modelViewTransform.modelToViewDeltaX( faucet.spoutWidth * flowRate / faucet.maxFlowRate );
        this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y, viewWidth, viewHeight );
      }
    } );
  }
}

phScale.register( 'FaucetFluidNode', FaucetFluidNode );
export default FaucetFluidNode;