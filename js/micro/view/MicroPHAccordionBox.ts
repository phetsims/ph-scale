// Copyright 2022-2023, University of Colorado Boulder

/**
 * MicroPHAccordionBox is the pH accordion box (aka meter) for the 'Micro' screen.
 * It is display-only; the pH is not editable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PHAccordionBox from '../../common/view/PHAccordionBox.js';
import phScale from '../../phScale.js';
import { PHValue } from '../../common/model/PHModel.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MicroPHAccordionBox extends PHAccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param tandem
   */
  public constructor( pHProperty: ReadOnlyProperty<PHValue>, probeYOffset: number, tandem: Tandem ) {

    const numberDisplay = new NumberDisplay( pHProperty, PHScaleConstants.PH_RANGE, {
      decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
      cornerRadius: PHAccordionBox.CORNER_RADIUS,
      textOptions: {
        font: new PhetFont( 28 ),
        stringPropertyOptions: { phetioHighFrequency: true }
      },
      backgroundFill: 'white',
      backgroundStroke: 'darkGray',
      xMargin: 8,
      yMargin: 5,
      tandem: tandem.createTandem( 'numberDisplay' )
    } );

    super( numberDisplay, probeYOffset, tandem );

    this.accordionBox.addLinkedElement( pHProperty, {
      tandemName: 'pHProperty'
    } );
  }
}

phScale.register( 'MicroPHAccordionBox', MicroPHAccordionBox );