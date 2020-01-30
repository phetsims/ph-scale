// Copyright 2013-2020, University of Colorado Boulder

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
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );
  const Solute = require( 'PH_SCALE/common/model/Solute' );
  const Solution = require( 'PH_SCALE/common/model/Solution' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );

  class MySolutionModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      // @public Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
      this.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

      //TODO #92 this is problematic, we probably do not want to instrument sub-elements soluteVolumeProperty and waterVolumeProperty
      //TODO #92 a new solute is created for every pH change by Solute.createCustom
      // @public Solution in the beaker
      this.solution = new Solution( new Property( Solute.createCustom( 7 ) ), 0.5, 0, this.beaker.volume, {
        tandem: tandem.createTandem( 'solution' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.beaker.reset();
      this.solution.reset();
    }
  }

  return phScale.register( 'MySolutionModel', MySolutionModel );
} );
