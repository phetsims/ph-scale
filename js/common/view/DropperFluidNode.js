// Copyright 2013-2021, University of Colorado Boulder

/**
 * Fluid (stock solution) coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';

class DropperFluidNode extends Rectangle {

  /**
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {number} tipWidth
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  constructor( dropper, beaker, tipWidth, modelViewTransform, options ) {

    options = merge( {
      lineWidth: 1
    }, options );

    super( 0, 0, 0, 0, options );

    // shape and position
    const updateShapeAndPosition = () => {
      // path
      if ( dropper.flowRateProperty.get() > 0 ) {
        this.setRect( -tipWidth / 2, 0, tipWidth, beaker.position.y - dropper.positionProperty.get().y );
      }
      else {
        this.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's position
      this.translation = modelViewTransform.modelToViewPosition( dropper.positionProperty.get() );
    };
    dropper.positionProperty.link( updateShapeAndPosition );
    dropper.flowRateProperty.link( updateShapeAndPosition );

    // set color to match solute
    dropper.soluteProperty.link( solute => {
      this.fill = solute.stockColor;
      this.stroke = solute.stockColor.darkerColor();
    } );
  }
}

phScale.register( 'DropperFluidNode', DropperFluidNode );
export default DropperFluidNode;