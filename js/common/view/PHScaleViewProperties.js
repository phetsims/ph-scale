// Copyright 2016, University of Colorado Boulder

/**
 * View-specific Properties for the 'My Solution' and 'Micro' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var phScale = require( 'PH_SCALE/phScale' );

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
