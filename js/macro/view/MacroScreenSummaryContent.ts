// Copyright 2025, University of Colorado Boulder

/**
 * MacroScreenSummaryContent is the description screen summary for the "Macro" screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';

export default class MacroScreenSummaryContent extends ScreenSummaryContent {

  public constructor( totalVolumeProperty: TReadOnlyProperty<number> ) {
    const isBeakerEmptyProperty = DerivedProperty.valueEqualsConstant( totalVolumeProperty, 0 );

    // The interaction hint changes depending on whether the beaker is empty or not.
    const interactionHintStringProperty = new DerivedStringProperty( [
        isBeakerEmptyProperty,
        PhScaleStrings.a11y.macroScreenSummary.interactionHint.emptyBeakerStringProperty,
        PhScaleStrings.a11y.macroScreenSummary.interactionHint.beakerWithSolutionStringProperty
      ],
      ( isEmpty, emptyString, withSolutionString ) => isEmpty ? emptyString : withSolutionString );

    // The current details change depending on whether the beaker is empty or not.
    const currentDetailsStringProperty = new DerivedStringProperty( [
      isBeakerEmptyProperty,
      PhScaleStrings.a11y.commonScreenSummary.currentDetails.emptyBeakerStringProperty,
      PhScaleStrings.a11y.commonScreenSummary.currentDetails.beakerWithSolutionStringProperty
    ], ( isEmpty, emptyString, withSolutionString ) => isEmpty ? emptyString : withSolutionString );

    super( {
      isDisposable: false,
      playAreaContent: PhScaleStrings.a11y.macroScreenSummary.playAreaStringProperty,
      controlAreaContent: PhScaleStrings.a11y.macroScreenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: interactionHintStringProperty
    } );
  }
}

phScale.register( 'MacroScreenSummaryContent', MacroScreenSummaryContent );