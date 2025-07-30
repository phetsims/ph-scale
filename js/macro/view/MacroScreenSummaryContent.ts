// Copyright 2025, University of Colorado Boulder

/**
 * MacroScreenSummaryContent is the description screen summary for the "Macro" screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import MacroModel from '../model/MacroModel.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import MacroPHMeterNode from './MacroPHMeterNode.js';
import AccessibleListNode from '../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import Solute from '../../common/model/Solute.js';

export default class MacroScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: MacroModel ) {

    const solutionNameProperty = DerivedProperty.deriveAny(
      [ model.solution.soluteProperty, ...model.solutes.map( solute => solute.nameProperty ) ],
      () => model.solution.soluteProperty.value.nameProperty.value );

    const pHValueStringProperty = MacroPHMeterNode.createPHValueStringProperty( model.pHMeter.pHProperty );

    // Derived Properties to determine which list items can be shown.
    const isBeakerEmptyProperty = DerivedProperty.valueEqualsConstant( model.solution.totalVolumeProperty, 0 );
    const isWaterAndBeakerNotEmptyProperty = new DerivedProperty( [ model.solution.soluteProperty, isBeakerEmptyProperty ],
      ( solute, empty ) => solute === Solute.WATER && !empty );
    const isNotWaterAndBeakerNotEmptyProperty = new DerivedProperty( [ model.solution.soluteProperty, isBeakerEmptyProperty ],
      ( solute, empty ) => solute !== Solute.WATER && !empty );
    const isNotWaterAndPHIsDefinedProperty = new DerivedProperty( [ isWaterAndBeakerNotEmptyProperty, model.pHMeter.pHProperty, isBeakerEmptyProperty ],
      ( isWater, pH, empty ) => !isWater && pH !== null && !empty );
    const isNotWaterAndPHIsNotDefinedProperty = new DerivedProperty( [ isWaterAndBeakerNotEmptyProperty, model.pHMeter.pHProperty, isBeakerEmptyProperty ],
      ( isWater, pH, empty ) => !isWater && pH === null && !empty );

    const currentDetailsNode = new AccessibleListNode( [
      {
        stringProperty: PhScaleStrings.a11y.macroScreenSummary.currentDetails.emptyBeakerStringProperty,
        visibleProperty: isBeakerEmptyProperty
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.macroScreenSummary.currentDetails.beakerWithSolutionStringProperty, {
          solute: solutionNameProperty
        } ),
        visibleProperty: isNotWaterAndBeakerNotEmptyProperty
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.qualitativePHValuePatternStringProperty, {
          pHValue: pHValueStringProperty,
          pHDescription: MacroPHMeterNode.createPHDescriptionStringProperty( model.pHMeter.pHProperty )
        } ),
        visibleProperty: isNotWaterAndPHIsDefinedProperty
      },
      {
        stringProperty: PhScaleStrings.a11y.pHValueUnknownStringProperty,
        visibleProperty: isNotWaterAndPHIsNotDefinedProperty
      },
      {
        stringProperty: PhScaleStrings.a11y.macroScreenSummary.currentDetails.beakerWithWaterStringProperty,
        visibleProperty: isWaterAndBeakerNotEmptyProperty
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.macroScreenSummary.currentDetails.waterPHValuePatternStringProperty, {
          value: pHValueStringProperty
        } ),
        visibleProperty: isWaterAndBeakerNotEmptyProperty
      }
    ], {
      leadingParagraphStringProperty: PhScaleStrings.a11y.macroScreenSummary.currentDetails.currentlyStringProperty
    } );

    const interactionHintStringProperty = new DerivedStringProperty( [
        model.solution.totalVolumeProperty,
        PhScaleStrings.a11y.macroScreenSummary.interactionHint.emptyBeakerStringProperty,
        PhScaleStrings.a11y.macroScreenSummary.interactionHint.beakerWithSolutionStringProperty
      ],
      ( totalVolume, emptyBeaker, beakerWithSolution ) => {
        if ( totalVolume === 0 ) {
          return emptyBeaker;
        }
        else {
          return beakerWithSolution;
        }
      } );

    super( {
      isDisposable: false,
      playAreaContent: PhScaleStrings.a11y.macroScreenSummary.playAreaStringProperty,
      controlAreaContent: PhScaleStrings.a11y.macroScreenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsNode,
      interactionHintContent: interactionHintStringProperty
    } );
  }
}

phScale.register( 'MacroScreenSummaryContent', MacroScreenSummaryContent );