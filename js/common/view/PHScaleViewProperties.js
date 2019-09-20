// Copyright 2016-2019, University of Colorado Boulder

/**
 * View-specific Properties for the 'My Solution' and 'Micro' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );

  /**
   * @constructor
   */
  function PHScaleViewProperties() {

    // @public
    this.ratioVisibleProperty = new BooleanProperty( false );
    this.moleculeCountVisibleProperty = new BooleanProperty( false );
    this.pHMeterExpandedProperty = new BooleanProperty( true );
    this.graphExpandedProperty = new BooleanProperty( true );
  }

  phScale.register( 'PHScaleViewProperties', PHScaleViewProperties );

  return inherit( Object, PHScaleViewProperties, {

    // @public
    reset: function() {
      this.ratioVisibleProperty.reset();
      this.moleculeCountVisibleProperty.reset();
      this.pHMeterExpandedProperty.reset();
      this.graphExpandedProperty.reset();
    }
  } );
} );
