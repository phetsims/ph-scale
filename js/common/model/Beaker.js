// Copyright 2013-2019, University of Colorado Boulder

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
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );

  /**
   * Constructor
   * @param {Vector2} position bottom center
   * @param {Dimension2} size
   * @param {Object} [options]
   * @constructor
   */
  function Beaker( position, size, options ) {

    options = merge( {
      volume: 1.2 // L
    }, options );

    // @Public
    this.position = position;
    this.size = size;
    this.volume = options.volume;

    // @public convenience properties
    this.left = position.x - ( size.width / 2 );
    this.right = position.x + ( size.width / 2 );
    this.bounds = new Bounds2( this.left, position.y - size.height, this.right, position.y );
  }

  phScale.register( 'Beaker', Beaker );

  return inherit( Object, Beaker, {

    // @public
    reset: function() { /* currently nothing to reset */ }
  } );
} );