// Copyright 2022, University of Colorado Boulder

/**
 * MacroKeyboardHelpContent is the keyboard-help content for the 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import phScale from '../../phScale.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import MoveKeyboardHelpContent from '../../common/view/MoveKeyboardHelpContent.js';

export default class MacroKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    const leftColumn = [

      // Move the pH Probe and Dropper
      new MoveKeyboardHelpContent( PhScaleStrings.keyboardHelpDialog.moveThePHProbeAndDropperStringProperty ),

      // Choose a Solute
      new ComboBoxKeyboardHelpSection( {
        headingString: PhScaleStrings.keyboardHelpDialog.chooseASoluteStringProperty,
        thingAsLowerCaseSingular: PhScaleStrings.keyboardHelpDialog.soluteStringProperty,
        thingAsLowerCasePlural: PhScaleStrings.keyboardHelpDialog.solutesStringProperty
      } )
    ];

    const rightColumn = [

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftColumn, rightColumn );
  }
}

phScale.register( 'MacroKeyboardHelpContent', MacroKeyboardHelpContent );