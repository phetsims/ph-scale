// Copyright 2013-2021, University of Colorado Boulder

// @ts-nocheck
/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';
import PHScaleConstants from '../PHScaleConstants.js';

class SolutionNode extends Rectangle {

  /**
   * @param {MacroSolution|MicroSolution|MySolution} solution
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( solution, beaker, modelViewTransform, options ) {

    options = merge( {
      lineWidth: 1
    }, options );

    // See https://github.com/phetsims/ph-scale/issues/108
    assert && assert( !options.tandem, 'do not instrument SolutionNode' );

    super( 0, 0, 1, 1, options ); // correct size will be set below

    /*
     * Updates the color of the solution, accounting for saturation.
     * @param {Color} color
     */
    solution.colorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor();
    } );

    /*
     * Updates the amount of stuff in the beaker, based on solution total volume.
     * @param {number} volume
     */
    const viewPosition = modelViewTransform.modelToViewPosition( beaker.position );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.totalVolumeProperty.link( totalVolume => {
      assert && assert( totalVolume >= 0 );

      // min non-zero volume, so that the solution is visible to the user and detectable by the concentration probe
      if ( totalVolume !== 0 && totalVolume < PHScaleConstants.MIN_SOLUTION_VOLUME ) {
        totalVolume = PHScaleConstants.MIN_SOLUTION_VOLUME;
      }

      // determine dimensions in model coordinates
      const solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, totalVolume ); // totalVolume -> height

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );

      // shape
      this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y - viewHeight, viewWidth, viewHeight );
    } );
  }
}

phScale.register( 'SolutionNode', SolutionNode );
export default SolutionNode;