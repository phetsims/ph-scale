// Copyright 2016, University of Colorado Boulder

/**
 * View-specific Properties for the 'My Solution' and 'Micro' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var phScale = require( 'PH_SCALE/phScale' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function PHScaleViewProperties() {

    // @public
    this.ratioVisibleProperty = new Property( false );
    this.moleculeCountVisibleProperty = new Property( false );
    this.pHMeterExpandedProperty = new Property( true );
    this.graphExpandedProperty = new Property( true );
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
