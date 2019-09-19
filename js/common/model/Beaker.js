// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model of a simple beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );

  /**
   * Constructor
   * @param {Vector2} location bottom center
   * @param {Dimension2} size
   * @param {Object} [options]
   * @constructor
   */
  function Beaker( location, size, options ) {

    options = _.extend( {
      volume: 1.2 // L
    }, options );

    // @Public
    this.location = location;
    this.size = size;
    this.volume = options.volume;

    // @public convenience properties
    this.left = location.x - ( size.width / 2 );
    this.right = location.x + ( size.width / 2 );
    this.bounds = new Bounds2( this.left, location.y - size.height, this.right, location.y );
  }

  phScale.register( 'Beaker', Beaker );

  return inherit( Object, Beaker, {

    // @public
    reset: function() { /* currently nothing to reset */ }
  } );
} );