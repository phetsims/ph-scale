// Copyright 2013-2019, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );

  /**
   * @param {Vector2} position
   * @param {Bounds2} dragBounds optional, undefined if not provided
   * @constructor
   */
  function Movable( position, dragBounds ) {

    // @public
    this.positionProperty = new Property( position );
    this.dragBounds = dragBounds;
  }

  phScale.register( 'Movable', Movable );

  return inherit( Object, Movable, {

    // @public
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );
