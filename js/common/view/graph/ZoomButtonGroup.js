// Copyright 2020, University of Colorado Boulder

/**
 * ZoomButtonGroup is the group of zoom button for the linear graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Tandem = require( 'TANDEM/Tandem' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // constants
  const MAGNIFYING_GLASS_RADIUS = 13;

  class ZoomButtonGroup extends HBox {

    /**
     * @param {NumberProperty} exponentProperty - exponent for the linear graph
     * @param {Object} [options]
     */
    constructor( exponentProperty, options ) {
      assert && assert( exponentProperty.range, 'exponentProperty must have range' );

      options = merge( {
        spacing: 25,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const zoomOutButton = new ZoomButton( {
        in: false,
        radius: MAGNIFYING_GLASS_RADIUS,
        listener: () => exponentProperty.set( this.exponentProperty.get() - 1 ),
        tandem: options.tandem.createTandem( 'zoomOutButton' ),
        phetioDocumentation: 'zoom out button for the linear scale'
      } );

      const zoomInButton = new ZoomButton( {
        in: true,
        radius: MAGNIFYING_GLASS_RADIUS,
        listener: () => this.exponentProperty.set( this.exponentProperty.get() + 1 ),
        tandem: options.tandem.createTandem( 'zoomInButton' ),
        phetioDocumentation: 'zoom in button for the linear scale'
      } );

      // expand touch areas
      zoomOutButton.touchArea = zoomOutButton.localBounds.dilated( 5, 5 );
      zoomInButton.touchArea = zoomOutButton.localBounds.dilated( 5, 5 );

      assert && assert( !options.children, 'ZoomButtonGroup sets children' );
      options.children = [ zoomOutButton, zoomInButton ];

      super( options );

      // enable/disable buttons
      exponentProperty.link( exponent => {
        zoomInButton.enabled = ( exponent > exponentProperty.range.min );
        zoomOutButton.enabled = ( exponent < exponentProperty.range.max );
      } );
    }
  }

  return phScale.register( 'ZoomButtonGroup', ZoomButtonGroup );
} );