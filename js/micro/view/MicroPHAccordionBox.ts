// Copyright 2022, University of Colorado Boulder

/**
 * MicroPHAccordionBox is the pH accordion box for the 'Micro' screen. It is display-only; the pH is not editable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PHAccordionBox, { PHMeterNodeAccordionBoxOptions } from '../../common/view/PHAccordionBox.js';
import phScale from '../../phScale.js';
import { PHValue } from '../../common/model/PHModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { LinkableElement } from '../../../../tandem/js/PhetioObject.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type SelfOptions = EmptySelfOptions;

export type MicroPHAccordionBoxOptions = SelfOptions & PickRequired<PHMeterNodeAccordionBoxOptions, 'tandem'>;

export default class MicroPHAccordionBox extends PHAccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param [providedOptions]
   */
  public constructor( pHProperty: TReadOnlyProperty<PHValue> & LinkableElement,
                      probeYOffset: number,
                      providedOptions: MicroPHAccordionBoxOptions ) {

    const contentNode = new NumberDisplay( pHProperty, PHScaleConstants.PH_RANGE, {
      decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
      cornerRadius: PHAccordionBox.CORNER_RADIUS,
      textOptions: {
        font: new PhetFont( 28 ),
        textPropertyOptions: { phetioHighFrequency: true }
      },
      backgroundFill: 'white',
      backgroundStroke: 'darkGray',
      xMargin: 8,
      yMargin: 5,
      tandem: providedOptions.tandem.createTandem( 'numberDisplay' )
    } );

    super( contentNode, probeYOffset, providedOptions );

    this.addLinkedElement( pHProperty, {
      tandem: providedOptions.tandem.createTandem( 'pHProperty' )
    } );
  }
}

phScale.register( 'MicroPHAccordionBox', MicroPHAccordionBox );