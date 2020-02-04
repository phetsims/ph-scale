// Copyright 2016-2020, University of Colorado Boulder

/**
 * View-specific Properties for the 'My Solution' and 'Micro' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PHScaleViewProperties {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, 'invalid tandem' );

      // @public
      this.ratioVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'ratioVisibleProperty' )
      } );
      this.moleculeCountVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'moleculeCountVisibleProperty' )
      } );
    }

    /**
     * @public
     */
    reset() {
      this.ratioVisibleProperty.reset();
      this.moleculeCountVisibleProperty.reset();
    }
  }

  return phScale.register( 'PHScaleViewProperties', PHScaleViewProperties );
} );
