// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function() {
  'use strict';

  /**
   * Constructor
   * @param {Vector2} location bottom center
   * @param {Dimension2} size
   * @param {Number} volume in liters (L)
   * @constructor
   */
  function Beaker( location, size, volume ) {

    this.location = location;
    this.size = size;
    this.volume = volume;

    // convenience properties
    this.left = location.x - ( size.width / 2 );
    this.right = location.x + ( size.width / 2 );
  }

  Beaker.prototype = {
    reset: function() { /* currently nothing to reset */ }
  };

  return Beaker;
} );