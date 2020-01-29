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
  const Movable = require( 'PH_SCALE/common/model/Movable' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );

  class PHMeter {

    /**
     * @param {Vector2} bodyPosition
     * @param {Vector2} probePosition
     * @param {Bounds2} probeDragBounds
     */
    constructor( bodyPosition, probePosition, probeDragBounds ) {
      this.valueProperty = new Property( null ); // @public null if the meter is not reading a value
      this.bodyPosition = bodyPosition; // @public
      this.probe = new Movable( probePosition, probeDragBounds ); // @public
    }

    /**
     * @public
     */
    reset() {
      this.valueProperty.reset();
      this.probe.reset();
    }
  }

  return phScale.register( 'PHMeter', PHMeter );
} );