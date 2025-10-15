// Copyright 2022-2025, University of Colorado Boulder

/**
 * MicroPHAccordionBox is the pH accordion box (aka meter) for the 'Micro' screen.
 * It is display-only; the pH is not editable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ValueChangeUtterance from '../../../../utterance-queue/js/ValueChangeUtterance.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import PHAccordionBox from '../../common/view/PHAccordionBox.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import MicroModel from '../model/MicroModel.js';

export default class MicroPHAccordionBox extends PHAccordionBox {

  /**
   * @param model - the MicroModel
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param tandem
   */
  public constructor( model: MicroModel, probeYOffset: number, tandem: Tandem ) {
    const pHProperty = model.solution.pHProperty;
    const isDispensingProperty = model.dropper.isDispensingProperty;
    const waterFaucetFlowRateProperty = model.waterFaucet.flowRateProperty;
    const drainFaucetFlowRateProperty = model.drainFaucet.flowRateProperty;

    const pHValuePatternStringProperty = new PatternStringProperty( PhScaleStrings.a11y.pHValuePatternStringProperty, {
      pHValue: PHScaleConstants.CREATE_PH_VALUE_FIXED_PROPERTY( pHProperty )
    } );
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

    /**
     * Add accessible context responses for the probe as the pH value changes.
     *
     * When the accordion box is expanded, we only want to announce the pH value when the dropper or faucets
     * are not dispensing.
     */
    const responseUtterance = new ValueChangeUtterance( {
      alert: new PatternStringProperty( PhScaleStrings.a11y.pHValuePatternStringProperty, {
        pHValue: PHScaleConstants.CREATE_PH_VALUE_FIXED_PROPERTY( pHProperty )
      }, {
        hasListenerOrderDependencies: true // This PatternStringProperty must update before the multilink below.
      } )
    } );

    Multilink.multilink( [ pHProperty, isDispensingProperty, waterFaucetFlowRateProperty, drainFaucetFlowRateProperty, this.accordionBox.expandedProperty ],
      ( pH, dropperIsDispensing, waterFaucetFlowRate, drainFaucetFlowRate, expanded ) => {
        !dropperIsDispensing && waterFaucetFlowRate === 0 && drainFaucetFlowRate === 0 && expanded &&
        numberDisplay.addAccessibleContextResponse( responseUtterance, { alertBehavior: 'queue' } );
      } );
  }
}

phScale.register( 'MicroPHAccordionBox', MicroPHAccordionBox );