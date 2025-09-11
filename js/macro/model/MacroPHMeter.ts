// Copyright 2013-2025, University of Colorado Boulder

/**
 * Model of the pH meter.
 * <p/>
 * NOTE: Determining when the probe is in one of the various fluids is handled in the view,
 * where testing node intersections simplifies the process. Otherwise, we'd need to
 * model the shapes of the various fluids, an unnecessary complication.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { PHValue } from '../../common/model/PHModel.js';
import PHMovable from '../../common/model/PHMovable.js';
import phScale from '../../phScale.js';

type SelfOptions = EmptySelfOptions;

type MacroPHMeterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MacroPHMeter {

  // pH value displayed by the meter, null if the meter is not reading a value
  public readonly pHProperty: Property<PHValue>;

  // movable probe
  public readonly probe: PHMovable;

  public constructor(
    public readonly bodyPosition: Vector2, // fixed position of the meter's body
    probePosition: Vector2,
    probeDragBounds: Bounds2,
    providedOptions: MacroPHMeterOptions ) {

    const options = providedOptions;

    this.pHProperty = new Property<PHValue>( null, {
      tandem: options.tandem.createTandem( 'pHProperty' ),
      phetioFeatured: true,
      phetioValueType: NullableIO( NumberIO ),
      phetioReadOnly: true, // because this depends on where the probe is positioned
      phetioHighFrequency: true
    } );

    this.probe = new PHMovable( probePosition, probeDragBounds, {
      tandem: options.tandem.createTandem( 'probe' ),
      positionPropertyOptions: {
        phetioHighFrequency: true
      }
    } );
  }

  public reset(): void {
    this.pHProperty.reset();
    this.probe.reset();
  }
}

phScale.register( 'MacroPHMeter', MacroPHMeter );