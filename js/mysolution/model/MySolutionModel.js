// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for the 'My Solution' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Beaker = require( 'PH_SCALE/common/model/Beaker' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );
  const Solute = require( 'PH_SCALE/common/model/Solute' );
  const Solution = require( 'PH_SCALE/common/model/Solution' );
  const Vector2 = require( 'DOT/Vector2' );

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
