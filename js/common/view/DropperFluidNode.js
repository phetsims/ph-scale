// Copyright 2002-2013, University of Colorado Boulder

/**
 * Fluid (stock solution) coming out of the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Dropper} dropper
   * @param {Beaker} beaker
   * @param {Solution} solution solution that's in the beaker
   * @param {Number} tipWidth
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function DropperFluidNode( dropper, beaker, solution, tipWidth, mvt ) {

    var thisNode = this;

    Rectangle.call( thisNode, 0, 0, 0, 0, { lineWidth: 1 } );

    // shape and location
    var updateShapeAndLocation = function() {
      // path
      if ( dropper.onProperty.get() && !dropper.emptyProperty.get() ) {

        // min non-zero volume, so that the solution is visible to the user and detectable by the concentration probe
        var solutionVolume = solution.volumeProperty.get();
        if ( solutionVolume > 0 && solutionVolume < PHScaleConstants.MIN_SOLUTION_VOLUME ) {
          solutionVolume = PHScaleConstants.MIN_SOLUTION_VOLUME;
        }

        // solution height in model coordinates
        var solutionHeight = Util.linear( 0, beaker.volume, 0, beaker.size.height, solutionVolume ); // volume -> height

        // top of solution in view coordinates
        var topOfSolution = mvt.modelToViewDeltaY( beaker.location.y - solutionHeight );

        // shape
        thisNode.setRect( -tipWidth / 2, 0, tipWidth, topOfSolution - dropper.locationProperty.get().y );
      }
      else {
        thisNode.setRect( 0, 0, 0, 0 );
      }
      // move this node to the dropper's location
      thisNode.translation = mvt.modelToViewPosition( dropper.locationProperty.get() );
    };
    dropper.locationProperty.link( updateShapeAndLocation );
    dropper.onProperty.link( updateShapeAndLocation );
    dropper.emptyProperty.link( updateShapeAndLocation );
    solution.volumeProperty.link( updateShapeAndLocation );

    // set color to match solute
    dropper.soluteProperty.link( function( solute ) {
      var soluteColor = solute.colorProperty.get();
      thisNode.fill = soluteColor;
      thisNode.stroke = soluteColor.darkerColor();
    } );

    // hide this node when the dropper is invisible
    dropper.visibleProperty.link( function( visible ) {
      thisNode.setVisible( visible );
    } );
  }

  return inherit( Rectangle, DropperFluidNode );
} );