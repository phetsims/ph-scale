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
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import MacroPHMeterNode from './MacroPHMeterNode.js';
import AccessibleListNode from '../../../../scenery-phet/js/accessibility/AccessibleListNode.js';

export default class MacroScreenSummaryContent extends ScreenSummaryContent {

  public constructor( model: MacroModel ) {

    const solutionNameProperty = DerivedProperty.deriveAny(
      [ model.solution.soluteProperty, ...model.solutes.map( solute => solute.nameProperty ) ],
      () => model.solution.soluteProperty.value.nameProperty.value );

    const pHValueStringProperty = new DerivedStringProperty( [ model.pHMeter.pHProperty, PhScaleStrings.a11y.unknownStringProperty ],
      ( ph, unknown ) => ( ph === null ) ? unknown : toFixed( ph, PHScaleConstants.PH_METER_DECIMAL_PLACES ) );

    const currentDetailsNode = new AccessibleListNode( [
      {
        stringProperty: PhScaleStrings.a11y.macroScreenSummary.currentDetails.emptyBeakerStringProperty,
        visibleProperty: DerivedProperty.valueEqualsConstant( model.solution.totalVolumeProperty, 0 )
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.macroScreenSummary.currentDetails.beakerWithSolutionStringProperty, {
          solute: solutionNameProperty
        } ),
        visibleProperty: DerivedProperty.valueNotEqualsConstant( model.solution.totalVolumeProperty, 0 )
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.qualitativePHValuePatternStringProperty, {
          pHValue: pHValueStringProperty,
          pHDescription: MacroPHMeterNode.createPHDescriptionStringProperty( model.pHMeter.pHProperty )
        } ),
        visibleProperty: DerivedProperty.valueNotEqualsConstant( model.pHMeter.pHProperty, null )
      },
      {
        stringProperty: PhScaleStrings.a11y.pHValueUnknownStringProperty,
        visibleProperty: new DerivedProperty( [ model.pHMeter.pHProperty, model.solution.totalVolumeProperty ],
          ( pH, volume ) => pH === null && volume > 0 )
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