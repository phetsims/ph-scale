// Copyright 2022-2025, University of Colorado Boulder

/**
 * MySolutionKeyboardHelpContent is the keyboard-help content for the 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MoveKeyboardHelpContent from '../../common/view/MoveKeyboardHelpContent.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';

export default class MySolutionKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move the Dropper
      new MoveKeyboardHelpContent( PhScaleStrings.keyboardHelpDialog.moveTheGraphIndicatorsStringProperty, {
        dragDirection: 'upDown' // The graph indicators can only be dragged up and down.
      } )
    ];

    // Sections in the right column.
    const rightSections = [
      new SliderControlsKeyboardHelpSection( {
        headingStringProperty: PhScaleStrings.keyboardHelpDialog.spinnerHeadingStringProperty,
        adjustSliderStringProperty: PhScaleStrings.keyboardHelpDialog.adjustSpinnerStringProperty,
        includeSmallerStepsRow: false,
        includeLargerStepsRow: false
      } ),
      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false // See https://github.com/phetsims/ph-scale/issues/285
    } );
  }
}

phScale.register( 'MySolutionKeyboardHelpContent', MySolutionKeyboardHelpContent );