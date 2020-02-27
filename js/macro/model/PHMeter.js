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
import PropertyIO from '../../../../axon/js/PropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Movable from '../../common/model/Movable.js';
import phScale from '../../phScale.js';

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

phScale.register( 'PHMeter', PHMeter );
export default PHMeter;