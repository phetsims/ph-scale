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
  const merge = require( 'PHET_CORE/merge' );
  const Movable = require( 'PH_SCALE/common/model/Movable' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const Tandem = require( 'TANDEM/Tandem' );

  class PHMeter {

    /**
     * @param {Vector2} bodyPosition
     * @param {Vector2} probePosition
     * @param {Bounds2} probeDragBounds
     * @param {Object} [options]
     */
    constructor( bodyPosition, probePosition, probeDragBounds, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      // @public null if the meter is not reading a value
      this.valueProperty = new Property( null, {
        tandem: options.tandem.createTandem( 'valueProperty' ),
        phetioType: PropertyIO( NullableIO( NumberIO ) ),
        phetioReadOnly: true
      } );

      // @public
      this.bodyPosition = bodyPosition;

      // @public
      this.probe = new Movable( probePosition, probeDragBounds, {
        tandem: options.tandem.createTandem( 'probe' )
      } );
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