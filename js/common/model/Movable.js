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
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class Movable {

    /**
     * @param {Vector2} position
     * @param {Bounds2} dragBounds optional, undefined if not provided
     * @param {Object} [options]
     */
    constructor( position, dragBounds, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // @public
      this.positionProperty = new Vector2Property( position, {
        tandem: options.tandem.createTandem( 'positionProperty' )
      } );

      // @public
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
