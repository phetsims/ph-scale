// Copyright 2013-2020, University of Colorado Boulder

/**
 * A movable model element.
 * Semantics of units are determined by the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );

  class Movable {

    /**
     * @param {Vector2} position
     * @param {Bounds2} dragBounds optional, undefined if not provided
     */
    constructor( position, dragBounds ) {

      // @public
      this.positionProperty = new Property( position );
      this.dragBounds = dragBounds;
    }

    /**
     * @public
     */
    reset() {
      this.positionProperty.reset();
    }
  }

  return phScale.register( 'Movable', Movable );
} );
