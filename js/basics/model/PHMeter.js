// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of the pH meter.
 * <p/>
 * NOTE: Determining when the probe is in one of the various fluids is handled in the view,
 * where testing node intersections simplifies the process. Otherwise we'd need to
 * model the shapes of the various fluids, an unnecessary complication.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( function( require ) {
  'use strict';

  // imports
  var Movable = require( 'PH_SCALE/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} bodyLocation
   * @param {Bounds2} bodyDragBounds
   * @param {Vector2} probeLocation
   * @param {Bounds2} probeDragBounds
   * @constructor
   */
  function PHMeter( bodyLocation, bodyDragBounds, probeLocation, probeDragBounds ) {
    this.valueProperty = new Property( null ); // null if the meter is not reading a value
    this.body = new Movable( bodyLocation, bodyDragBounds );
    this.probe = new Movable( probeLocation, probeDragBounds );
  }

  PHMeter.prototype = {
    reset: function() {
      this.valueProperty.reset();
      this.body.reset();
      this.probe.reset();
    }
  };

  return PHMeter;

} );