// Copyright 2002-2013, University of Colorado Boulder

/**
 * Visual representation of H3O+/OH- ratio.
 * Molecules are drawn as circles.
 * In pH range 6 to 8, the relationship between number of molecules and pH is log.
 * Outside of that range, we can't possibly draw that many molecules, so we fake it using a linear relationship.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHModel = require( 'PH_SCALE/common/model/PHModel' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'PH_SCALE/common/view/SubSupText' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

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

  /**
   * @param {Number} diameter
   * @constructor
   */
  function MoleculeNode( diameter, options ) {
    options = _.extend( { fill: 'black' }, options );
    Circle.call( this, diameter / 2, options );
  }

  inherit( Circle, MoleculeNode );

  /**
   * @param {Beaker} beaker
   * @param {Solution} solution
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function RatioNode( beaker, solution, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // save constructor args
    thisNode.solution = solution; // @private

    // current pH
    thisNode.pH = null; // @private null to force an update

    // current number of each type of molecule
    thisNode.numberOfH3OProperty = new Property( 0 ); // @private
    thisNode.numberOfOHProperty = new Property( 0 ); // @private

    // bounds of the beaker, in view coordinates
    this.beakerBounds = mvt.modelToViewBounds( beaker.bounds );

    // parent for all molecules
    thisNode.moleculesParent = new Node(); // @private
    thisNode.addChild( thisNode.moleculesParent );

    // dev mode
    if ( window.phetcommon.getQueryParameter( 'dev' ) ) {

      // parent for all dev nodes, in foreground
      var devParent = new Node();
      thisNode.addChild( devParent );

      // show numbers of molecules in lower-left of beaker
      var lowerLeft = mvt.modelToViewPosition( new Vector2( beaker.left, beaker.location.y ) );
      var ratioText = new SubSupText( '?', { font: new PhetFont( 22 ), fill: 'black', left: lowerLeft.x + 50, bottom: lowerLeft.y - 20 } );
      devParent.addChild( ratioText );
      var updateRatioText = function() {
        ratioText.text = this.numberOfH3OProperty.get() + ' / ' + this.numberOfOHProperty.get();
      };
      this.numberOfH3OProperty.link( updateRatioText.bind( this ) );
      this.numberOfOHProperty.link( updateRatioText.bind( this ) );
    }

    // sync view with model
    solution.pHProperty.link( this.update.bind( this ) );

    // clip to the shape of the solution in the beaker
    solution.volumeProperty.link( function( volume ) {
      if ( volume === 0 ) {
        thisNode.clipArea = null;
      }
      else {
        var solutionHeight = beaker.size.height * volume / beaker.volume;
        thisNode.clipArea = Shape.rectangle( beaker.left, beaker.location.y - solutionHeight, beaker.size.width, solutionHeight );
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
        this.moleculesParent.removeAllChildren();
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

          // create molecules, minority species in foreground
          if ( numberOfH3O > numberOfOH ) {
            this.createMolecules( numberOfH3O, H3O_RADIUS, H3O_MAJORITY_COLOR );
            this.createMolecules( numberOfOH, OH_RADIUS, OH_MINORITY_COLOR );
          }
          else {
            this.createMolecules( numberOfOH, OH_RADIUS, OH_MAJORITY_COLOR );
            this.createMolecules( numberOfH3O, H3O_RADIUS, H3O_MINORITY_COLOR );
          }
        }

        // update counts
        this.numberOfH3OProperty.set( numberOfH3O );
        this.numberOfOHProperty.set( numberOfOH );
      }
    },

    // @private Adds a specified number of molecule nodes to the scene graph.
    createMolecules: function( count, radius, color ) {
      for ( var i = 0; i < count; i++ ) {
        this.moleculesParent.addChild( new Circle( radius, {
          fill: color,
          translation: RatioNode.createRandomPoint( this.beakerBounds )
        } ) );
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

    //TODO will result in lots of Vector2 allocations, change to createRandomX and createRandomY ?
    // @ private @static Creates a random {Vector2} point inside some {Bounds2} bounds.
    createRandomPoint: function( bounds ) {
      return new Vector2( bounds.x + ( Math.random() * bounds.getWidth() ), bounds.y + ( Math.random() * bounds.getHeight() ) );
    }
  } );
} );