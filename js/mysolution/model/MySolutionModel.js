// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for the 'My Solution' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Beaker = require( 'PH_SCALE/common/model/Beaker' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var phScale = require( 'PH_SCALE/phScale' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   */
  function MySolutionModel() {

    // @public Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
    this.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

    // @public Solution in the beaker
    this.solution = new Solution( new Property( Solute.createCustom( 7 ) ), 0.5, 0, this.beaker.volume );
  }

  phScale.register( 'MySolutionModel', MySolutionModel );

  return inherit( Object, MySolutionModel, {

    // @public
    reset: function() {
      this.beaker.reset();
      this.solution.reset();
    }
  } );
} );
