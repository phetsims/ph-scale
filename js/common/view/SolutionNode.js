// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Utils = require( 'DOT/Utils' );

  /**
   * @param {Solution} solution
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function SolutionNode( solution, beaker, modelViewTransform ) {

    const self = this;

    Rectangle.call( this, 0, 0, 1, 1, { lineWidth: 1 } ); // size and color set dynamically

    /*
     * Updates the color of the solution, accounting for saturation.
     * @param {Color} color
     */
    solution.colorProperty.link( function( color ) {
      self.fill = color;
      self.stroke = color.darkerColor();
    } );

    /*
     * Updates the amount of stuff in the beaker, based on solution volume.
     * @param {number} volume
     */
    const viewPosition = modelViewTransform.modelToViewPosition( beaker.position );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.volumeProperty.link( function( volume ) {
      assert && assert( volume >= 0 );

      // min non-zero volume, so that the solution is visible to the user and detectable by the concentration probe
      if ( volume !== 0 && volume < PHScaleConstants.MIN_SOLUTION_VOLUME ) {
        volume = PHScaleConstants.MIN_SOLUTION_VOLUME;
      }

      // determine dimensions in model coordinates
      const solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );

      // shape
      self.setRect( viewPosition.x - (viewWidth / 2), viewPosition.y - viewHeight, viewWidth, viewHeight );
    } );
  }

  phScale.register( 'SolutionNode', SolutionNode );

  return inherit( Rectangle, SolutionNode );
} );