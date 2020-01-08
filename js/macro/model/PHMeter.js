// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of the pH meter.
 * <p/>
 * NOTE: Determining when the probe is in one of the various fluids is handled in the view,
 * where testing node intersections simplifies the process. Otherwise we'd need to
 * model the shapes of the various fluids, an unnecessary complication.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Movable = require( 'PH_SCALE/common/model/Movable' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} bodyPosition
   * @param {Vector2} probePosition
   * @param {Bounds2} probeDragBounds
   * @constructor
   */
  function PHMeter( bodyPosition, probePosition, probeDragBounds ) {
    this.valueProperty = new Property( null ); // @public null if the meter is not reading a value
    this.bodyPosition = bodyPosition; // @public
    this.probe = new Movable( probePosition, probeDragBounds ); // @public
  }

  phScale.register( 'PHMeter', PHMeter );

  return inherit( Object, PHMeter, {

    // @public
    reset: function() {
      this.valueProperty.reset();
      this.probe.reset();
    }
  } );
} );