// Copyright 2002-2014, University of Colorado Boulder

/**
 * Alternate implementation of RatioNode that draws molecules directly to Canvas.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
//  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'PH_SCALE/common/view/SubSupText' );
  var Util = require( 'DOT/Util' );

  // constants
  var ACID_PH_THRESHOLD = 6;
  var BASE_PH_THRESHOLD = 8;
  var NUM_PARTICLES_AT_PH7 = 100;
  var NUM_PARTICLES_AT_PH_MAX = 3000;
  var MIN_MINORITY_MOLECULES = 5;
//  var MAJORITY_ALPHA = 0.55; // alpha of the majority species, [0-1], transparent-opaque
//  var MINORITY_ALPHA = 1.0; // alpha of the minority species, [0-1], transparent-opaque
//  var H3O_MAJORITY_COLOR = PHScaleColors.H3O_MOLECULES.withAlpha( MAJORITY_ALPHA );
//  var H3O_MINORITY_COLOR = PHScaleColors.H3O_MOLECULES.withAlpha( MINORITY_ALPHA );
//  var OH_MAJORITY_COLOR = PHScaleColors.OH_MOLECULES.withAlpha( MAJORITY_ALPHA );
//  var OH_MINORITY_COLOR = PHScaleColors.OH_MOLECULES.withAlpha( MINORITY_ALPHA );
//  var H3O_RADIUS = 3;
//  var OH_RADIUS = H3O_RADIUS;

  /**
   * Draws molecules directly to a Canvas.
   * @param canvasBounds
   * @constructor
   */
  function MoleculesCanvasNode( canvasBounds ) {
    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    this.numberOfH3OMolecules = 0; // @private
    this.numberOfOHMolecules = 0; // @private
  }

  inherit( CanvasNode, MoleculesCanvasNode, {

    /**
     * Draws molecules to the Canvas.
     * @param {Number} numberOfH3OMolecules
     * @param {Number} numberOfOHMolecules
     */
    drawMolecules: function( numberOfH3OMolecules, numberOfOHMolecules ) {
      console.log( 'MoleculesCanvasNode.drawMolecules' );//XXX
      if ( numberOfH3OMolecules !== this.numberOfH3OMolecules || numberOfOHMolecules !== this.numberOfOHMolecules ) {
        this.numberOfH3OMolecules = numberOfH3OMolecules;
        this.numberOfOHMolecules = numberOfOHMolecules;
        this.invalidatePaint(); // results in paintCanvas being called
      }
    },

    /**
     * @override
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {
      console.log( 'MoleculesCanvasNode.paintCanvas' );//XXX
      //TODO draw molecules based on this.numberOfH3OMolecules and this.numberOfOHMolecules
    }
  } );

  /**
   * @param {Beaker} beaker
   * @param {Solution} solution
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function RatioNodeWithCanvas( beaker, solution, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // save constructor args
    thisNode.solution = solution; // @private

    // current pH
    thisNode.pH = null; // @private null to force an update

    // bounds of the beaker, in view coordinates
    var beakerBounds = mvt.modelToViewBounds( beaker.bounds );

    // @private molecules will be drawn directly to this Canvas
    thisNode.canvasNode = new MoleculesCanvasNode( beakerBounds );
    //TODO if canvasNode is added to the scene, then the scene doesn't render properly
//    thisNode.addChild( thisNode.canvasNode );

    // dev mode, show numbers of molecules in lower-left of beaker
    thisNode.ratioText = new SubSupText( '?', { font: new PhetFont( 30 ), fill: 'black', left: beakerBounds.getCenterX(), bottom: beakerBounds.maxY - 20 } ); // @private
    if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
      thisNode.addChild( thisNode.ratioText );
    }

    // sync view with model
    solution.pHProperty.link( function() {
      thisNode.update();
    } );

    // clip to the shape of the solution in the beaker
    solution.volumeProperty.link( function( volume ) {
      if ( volume === 0 ) {
        thisNode.clipArea = null;
      }
      else {
        var solutionHeight = thisNode.beakerBounds.getHeight() * volume / beaker.volume;
        thisNode.clipArea = Shape.rectangle( thisNode.beakerBounds.minX, thisNode.beakerBounds.maxY - solutionHeight, thisNode.beakerBounds.getWidth(), solutionHeight );
      }
    } );
  }

  return inherit( Node, RatioNodeWithCanvas, {

    // @override When this node becomes visible, update it.
    setVisible: function( visible ) {
      Node.prototype.setVisible.call( this, visible );
      this.update();
    },

    /**
     * Updates the number of molecules when the pH (as displayed on the meter) changes.
     * If volume changes, we don't create more molecules, we just expose more of them.
     * @private
     */
    update: function() {

      // don't update if not visible
      if ( !this.visible ) {
        return;
      }

      var pH = this.solution.pHProperty.get();
      if ( pH !== null ) {
        pH = Util.toFixedNumber( this.solution.pHProperty.get(), PHScaleConstants.PH_METER_DECIMAL_PLACES );
      }

      if ( this.pH !== pH ) {

        this.pH = pH;
        var numberOfH3O = 0;
        var numberOfOH = 0;

        if ( pH !== null ) {

          // compute number of molecules
          if ( pH >= ACID_PH_THRESHOLD && pH <= BASE_PH_THRESHOLD ) {
            // # molecules varies logarithmically in this range
            numberOfH3O = Math.max( MIN_MINORITY_MOLECULES, RatioNodeWithCanvas.computeNumberOfH3O( pH ) );
            numberOfOH = Math.max( MIN_MINORITY_MOLECULES, RatioNodeWithCanvas.computeNumberOfOH( pH ) );
          }
          else {
            // # molecules varies linearly in this range
            // N is the number of molecules to add for each 1 unit of pH above or below the thresholds
            var N = ( NUM_PARTICLES_AT_PH_MAX - RatioNodeWithCanvas.computeNumberOfOH( BASE_PH_THRESHOLD ) ) / ( PHScaleConstants.PH_RANGE.max - BASE_PH_THRESHOLD );
            var pHDiff;
            if ( pH > BASE_PH_THRESHOLD ) {
              // strong base
              pHDiff = pH - BASE_PH_THRESHOLD;
              numberOfH3O = Math.max( MIN_MINORITY_MOLECULES, ( RatioNodeWithCanvas.computeNumberOfH3O( BASE_PH_THRESHOLD ) - pHDiff ) );
              numberOfOH = RatioNodeWithCanvas.computeNumberOfOH( BASE_PH_THRESHOLD ) + ( pHDiff * N );
            }
            else {
              // strong acid
              pHDiff = ACID_PH_THRESHOLD - pH;
              numberOfH3O = RatioNodeWithCanvas.computeNumberOfH3O( ACID_PH_THRESHOLD ) + ( pHDiff * N );
              numberOfOH = Math.max( MIN_MINORITY_MOLECULES, ( RatioNodeWithCanvas.computeNumberOfOH( ACID_PH_THRESHOLD ) - pHDiff ) );
            }
          }

          // convert to integer values
          numberOfH3O = Util.toFixedNumber( numberOfH3O, 0 );
          numberOfOH = Util.toFixedNumber( numberOfOH, 0 );
        }

        // create molecules
        this.canvasNode.drawMolecules( numberOfH3O, numberOfOH );

        // update counts
        this.ratioText.text = numberOfH3O + ' / ' + numberOfOH;
      }
    }
  }, {

    // @private @static Computes the {Number} number of H3O+ molecules for some {Number} pH.
    computeNumberOfH3O: function( pH ) {
      return Util.toFixedNumber( PHModel.pHToConcentrationH3O( pH ) * ( NUM_PARTICLES_AT_PH7 / 2 ) / 1E-7, 0 );
    },

    // @private @static Computes the {Number} number of OH- molecules for some {Number} pH.
    computeNumberOfOH: function( pH ) {
      return Util.toFixedNumber( PHModel.pHToConcentrationOH( pH ) * ( NUM_PARTICLES_AT_PH7 / 2 ) / 1E-7, 0 );
    },

    // @private @static Creates a random {Number} x-coordinate inside some {Bounds2} bounds.
    createRandomX: function( bounds ) {
      return bounds.x + ( Math.random() * bounds.getWidth() );
    },

    // @private @static Creates a random {Number} y-cordinate inside some {Bounds2} bounds.
    createRandomY: function( bounds ) {
      return bounds.y + ( Math.random() * bounds.getHeight() );
    }
  } );
} );
