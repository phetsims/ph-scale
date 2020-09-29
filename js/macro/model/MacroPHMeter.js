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

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Movable from '../../common/model/Movable.js';
import phScale from '../../phScale.js';

class MacroPHMeter {

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

    // @public value displayed by the meter, null if the meter is not reading a value
    this.pHProperty = new Property( null, {
      tandem: options.tandem.createTandem( 'pHProperty' ),
      phetioType: Property.PropertyIO( NullableIO( NumberIO ) ),
      phetioReadOnly: true, // because this depends on where the probe is positioned
      phetioHighFrequency: true
    } );

    // @public fix position of the meter's body
    this.bodyPosition = bodyPosition;

    // @public position of the meter's movable probe
    this.probe = new Movable( probePosition, probeDragBounds, {
      tandem: options.tandem.createTandem( 'probe' ),
      positionPropertyOptions: {
        phetioHighFrequency: true
      }
    } );
  }

  /**
   * @public
   */
  reset() {
    this.pHProperty.reset();
    this.probe.reset();
  }
}

phScale.register( 'MacroPHMeter', MacroPHMeter );
export default MacroPHMeter;