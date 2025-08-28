// Copyright 2025, University of Colorado Boulder
/**
 * MicroScreenSummaryContent is the description screen summary for the "Micro" screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import phScale from '../../phScale.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';


export default class MicroScreenSummaryContent extends ScreenSummaryContent {

  public constructor( totalVolumeProperty: TReadOnlyProperty<number> ) {
    const isBeakerEmptyProperty = DerivedProperty.valueEqualsConstant( totalVolumeProperty, 0 );
    const currentDetailsStringProperty = new DerivedStringProperty( [
      isBeakerEmptyProperty,
      PhScaleStrings.a11y.commonScreenSummary.currentDetails.emptyBeakerStringProperty,
      PhScaleStrings.a11y.commonScreenSummary.currentDetails.beakerWithSolutionStringProperty
    ], ( isEmpty, emptyString, withSolutionString ) => isEmpty ? emptyString : withSolutionString );


    super( {
      isDisposable: false,
      playAreaContent: PhScaleStrings.a11y.microScreenSummary.playAreaStringProperty,
      controlAreaContent: PhScaleStrings.a11y.microScreenSummary.controlAreaStringProperty,
      currentDetailsContent: currentDetailsStringProperty,
      interactionHintContent: PhScaleStrings.a11y.microScreenSummary.interactionHintStringProperty
    } );
  }
}

phScale.register( 'MicroScreenSummaryContent', MicroScreenSummaryContent );