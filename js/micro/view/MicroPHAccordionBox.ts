// Copyright 2022-2025, University of Colorado Boulder

/**
 * MicroPHAccordionBox is the pH accordion box (aka meter) for the 'Micro' screen.
 * It is display-only; the pH is not editable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { PHValue } from '../../common/model/PHModel.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import PHAccordionBox from '../../common/view/PHAccordionBox.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class MicroPHAccordionBox extends PHAccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param isDispensingProperty - true if the dropper is dispensing
   * @param waterFaucetFlowRateProperty - flow rate of the water faucet, in liters/second
   * @param drainFaucetFlowRateProperty - flow rate of the drain faucet, in liters/second
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param tandem
   */
  public constructor( pHProperty: ReadOnlyProperty<PHValue>, isDispensingProperty: TReadOnlyProperty<boolean>, waterFaucetFlowRateProperty: TReadOnlyProperty<number>,
                      drainFaucetFlowRateProperty: TReadOnlyProperty<number>, probeYOffset: number, tandem: Tandem ) {
    const pHValuePatternStringProperty = PHScaleConstants.CREATE_PH_VALUE_PATTERN_STRING_PROPERTY( pHProperty );
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
      accessibleParagraph: pHValuePatternStringProperty,
      tandem: tandem.createTandem( 'numberDisplay' )
    } );

    super( numberDisplay, probeYOffset, {
      accordionBoxOptions: {
        tandem: tandem
      },
      accessibleHeading: PhScaleStrings.a11y.pHMeter.headingStringProperty
    } );

    this.accordionBox.addLinkedElement( pHProperty, {
      tandemName: 'pHProperty'
    } );

    Multilink.multilink( [ pHProperty, isDispensingProperty, waterFaucetFlowRateProperty, drainFaucetFlowRateProperty, this.accordionBox.expandedProperty ],
      ( pH, isDispensing, waterFlowRate, drainFlowRate, expanded ) => {
        pH !== null && !isDispensing && waterFlowRate === 0 && drainFlowRate === 0 && expanded &&
        numberDisplay.addAccessibleContextResponse( pHValuePatternStringProperty );
      } );
  }
}

phScale.register( 'MicroPHAccordionBox', MicroPHAccordionBox );