// Copyright 2022-2025, University of Colorado Boulder

/**
 * MicroKeyboardHelpContent is the keyboard-help content for the 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import FaucetControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/FaucetControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';

export default class MicroKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Faucet Controls
      new FaucetControlsKeyboardHelpSection(),

      // Choose a Solute
      new ComboBoxKeyboardHelpSection( {
        headingString: PhScaleStrings.keyboardHelpDialog.chooseASoluteStringProperty,
        thingAsLowerCaseSingular: PhScaleStrings.keyboardHelpDialog.soluteStringProperty,
        thingAsLowerCasePlural: PhScaleStrings.keyboardHelpDialog.solutesStringProperty
      } )
    ];

    // Sections in the right column.
    const rightSections = [

      // Choose a Solute
      new ComboBoxKeyboardHelpSection( {
        headingString: PhScaleStrings.keyboardHelpDialog.chooseASoluteStringProperty,
        thingAsLowerCaseSingular: PhScaleStrings.keyboardHelpDialog.soluteStringProperty,
        thingAsLowerCasePlural: PhScaleStrings.keyboardHelpDialog.solutesStringProperty
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

phScale.register( 'MicroKeyboardHelpContent', MicroKeyboardHelpContent );