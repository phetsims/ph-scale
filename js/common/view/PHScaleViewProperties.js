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

  class PHScaleViewProperties {

    constructor() {

      // @public
      this.ratioVisibleProperty = new BooleanProperty( false );
      this.moleculeCountVisibleProperty = new BooleanProperty( false );
      this.pHMeterExpandedProperty = new BooleanProperty( true );
      this.graphExpandedProperty = new BooleanProperty( true );
    }

    /**
     * @public
     */
    reset() {
      this.ratioVisibleProperty.reset();
      this.moleculeCountVisibleProperty.reset();
      this.pHMeterExpandedProperty.reset();
      this.graphExpandedProperty.reset();
    }
  }

  return phScale.register( 'PHScaleViewProperties', PHScaleViewProperties );
} );
