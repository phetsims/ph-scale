// Copyright 2002-2013, University of Colorado Boulder

//TODO delete unused strategies (inner types)
/**
 * Visual representation of H3O+/OH- ratio.
 * Molecules are drawn as circles.
 * In the pH range close to neutral, the relationship between number of molecules and pH is log.
 * Outside of that range, we can't possibly draw that many molecules, so we fake it using a linear relationship.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
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
  var MAJORITY_ALPHA = 0.55; // alpha of the majority species, [0-1], transparent-opaque
  var MINORITY_ALPHA = 1.0; // alpha of the minority species, [0-1], transparent-opaque
  var H3O_MAJORITY_COLOR = PHScaleColors.H3O_MOLECULES.withAlpha( MAJORITY_ALPHA );
  var H3O_MINORITY_COLOR = PHScaleColors.H3O_MOLECULES.withAlpha( MINORITY_ALPHA );
  var OH_MAJORITY_COLOR = PHScaleColors.OH_MOLECULES.withAlpha( MAJORITY_ALPHA );
  var OH_MINORITY_COLOR = PHScaleColors.OH_MOLECULES.withAlpha( MINORITY_ALPHA );
  var H3O_RADIUS = 3;
  var OH_RADIUS = H3O_RADIUS;

  //-------------------------------------------------------------------------------------

  /**
   * Draws each molecule as a separate Scenery node.
   * @param {Bounds2} beakerBounds beaker bounds in view coordinate frame
   * @constructor
   */
  function MoleculesNode( beakerBounds ) {
    Node.call( this );
    this.beakerBounds = beakerBounds; // @private
    this.numberOfH3OMolecules = 0; // @private
    this.numberOfOHMolecules = 0; // @private
  }

  inherit( Node, MoleculesNode, {

    /**
     * @param {Number} numberOfH3OMolecules
     * @param {Number} numberOfOHMolecules
     */
    drawMolecules: function( numberOfH3OMolecules, numberOfOHMolecules ) {
      if ( numberOfH3OMolecules !== this.numberOfH3OMolecules || numberOfOHMolecules !== this.numberOfOHMolecules ) {

        this.numberOfH3OMolecules = numberOfH3OMolecules;
        this.numberOfOHMolecules = numberOfOHMolecules;

        this.removeAllChildren();

        // create molecules, minority species in foreground
        if ( numberOfH3OMolecules > numberOfOHMolecules ) {
          this.createMolecules( numberOfH3OMolecules, H3O_RADIUS, H3O_MAJORITY_COLOR );
          this.createMolecules( numberOfOHMolecules, OH_RADIUS, OH_MINORITY_COLOR );
        }
        else {
          this.createMolecules( numberOfOHMolecules, OH_RADIUS, OH_MAJORITY_COLOR );
          this.createMolecules( numberOfH3OMolecules, H3O_RADIUS, H3O_MINORITY_COLOR );
        }
      }
    },

    // @private Adds a specified number of molecule nodes to the scene graph.
    createMolecules: function( count, radius, color ) {
      for ( var i = 0; i < count; i++ ) {
        this.addChild( new Circle( radius, {
          fill: color,
          x: RatioNode.createRandomX( this.beakerBounds ),
          y: RatioNode.createRandomY( this.beakerBounds )
        } ) );
      }
    }
  } );

  //-------------------------------------------------------------------------------------

  /**
   * Draws all molecules directly to Canvas.
   * @param {Bounds2} beakerBounds beaker bounds in view coordinate frame
   * @constructor
   */
  function MoleculesCanvas( beakerBounds ) {
    CanvasNode.call( this, { canvasBounds: beakerBounds } );
    this.numberOfH3OMolecules = 0; // @private
    this.numberOfOHMolecules = 0; // @private
  }

  inherit( CanvasNode, MoleculesCanvas, {

    /**
     * @param {Number} numberOfH3OMolecules
     * @param {Number} numberOfOHMolecules
     */
    drawMolecules: function( numberOfH3OMolecules, numberOfOHMolecules ) {
      console.log( 'MoleculesCanvas.drawMolecules' );//XXX
      if ( numberOfH3OMolecules !== this.numberOfH3OMolecules || numberOfOHMolecules !== this.numberOfOHMolecules ) {
        this.numberOfH3OMolecules = numberOfH3OMolecules;
        this.numberOfOHMolecules = numberOfOHMolecules;
        this.invalidatePaint(); // results in paintCanvas being called
      }
    },

    /**
     * @override
     * @protected
     * @param {CanvasContextWrapper} wrapper
     */
    paintCanvas: function( wrapper ) {
      console.log( 'MoleculesCanvas.paintCanvas' );//XXX
      //TODO draw molecules based on this.numberOfH3OMolecules and this.numberOfOHMolecules, majority species behind minority species
    }
  } );

  //-------------------------------------------------------------------------------------

  /**
   * @param {Beaker} beaker
   * @param {Solution} solution
   * @param {ModelViewTransform2} mvt
   * @param {*} options
   * @constructor
   */
  function RatioNode( beaker, solution, mvt, options ) {

    options = _.extend( {
       strategy: 'nodes' // nodes: draw each molecule as a scenery Node; canvas: draw molecules directly to canvas
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // save constructor args
    thisNode.solution = solution; // @private

    // current pH
    thisNode.pH = null; // @private null to force an update

    // bounds of the beaker, in view coordinates
    var beakerBounds = mvt.modelToViewBounds( beaker.bounds );

    // parent for all molecules
    thisNode.moleculesNode = ( options.strategy === 'nodes' ) ? new MoleculesNode( beakerBounds ) : new MoleculesCanvas( beakerBounds ); // @private
    thisNode.addChild( thisNode.moleculesNode );

    // dev mode, show numbers of molecules in lower-left of beaker
    thisNode.ratioText = new SubSupText( '?', { font: new PhetFont( 30 ), fill: 'black', left: beakerBounds.getCenterX(), bottom: beakerBounds.maxY - 20 } ); // @private
    if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
      thisNode.addChild( thisNode.ratioText );
    }

    // sync view with model
    solution.pHProperty.link( thisNode.update.bind( thisNode ) );

    // clip to the shape of the solution in the beaker
    solution.volumeProperty.link( function( volume ) {
      if ( volume === 0 ) {
        thisNode.clipArea = null;
      }
      else {
        var solutionHeight = beakerBounds.getHeight() * volume / beaker.volume;
        thisNode.clipArea = Shape.rectangle( beakerBounds.minX, beakerBounds.maxY - solutionHeight, beakerBounds.getWidth(), solutionHeight );
      }
    } );
  }

  return inherit( Node, RatioNode, {

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
            numberOfH3O = Math.max( MIN_MINORITY_MOLECULES, RatioNode.computeNumberOfH3O( pH ) );
            numberOfOH = Math.max( MIN_MINORITY_MOLECULES, RatioNode.computeNumberOfOH( pH ) );
          }
          else {
            // # molecules varies linearly in this range
            // N is the number of molecules to add for each 1 unit of pH above or below the thresholds
            var N = ( NUM_PARTICLES_AT_PH_MAX - RatioNode.computeNumberOfOH( BASE_PH_THRESHOLD ) ) / ( PHScaleConstants.PH_RANGE.max - BASE_PH_THRESHOLD );
            var pHDiff;
            if ( pH > BASE_PH_THRESHOLD ) {
              // strong base
              pHDiff = pH - BASE_PH_THRESHOLD;
              numberOfH3O = Math.max( MIN_MINORITY_MOLECULES, ( RatioNode.computeNumberOfH3O( BASE_PH_THRESHOLD ) - pHDiff ) );
              numberOfOH = RatioNode.computeNumberOfOH( BASE_PH_THRESHOLD ) + ( pHDiff * N );
            }
            else {
              // strong acid
              pHDiff = ACID_PH_THRESHOLD - pH;
              numberOfH3O = RatioNode.computeNumberOfH3O( ACID_PH_THRESHOLD ) + ( pHDiff * N );
              numberOfOH = Math.max( MIN_MINORITY_MOLECULES, ( RatioNode.computeNumberOfOH( ACID_PH_THRESHOLD ) - pHDiff ) );
            }
          }

          // convert to integer values
          numberOfH3O = Util.toFixedNumber( numberOfH3O, 0 );
          numberOfOH = Util.toFixedNumber( numberOfOH, 0 );
        }

        // update molecules
        this.moleculesNode.drawMolecules( numberOfH3O, numberOfOH );

        // update dev counts
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