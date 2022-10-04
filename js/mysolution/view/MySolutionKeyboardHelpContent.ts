// Copyright 2022, University of Colorado Boulder

/**
 * MySolutionKeyboardHelpContent is the keyboard-help content for the 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import phScale from '../../phScale.js';
import MoveKeyboardHelpContent from '../../common/view/MoveKeyboardHelpContent.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';

export default class MySolutionKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    const leftColumn = [

      // Move the Dropper
      new MoveKeyboardHelpContent( PhScaleStrings.keyboardHelpDialog.moveTheGraphIndicatorsStringProperty, 'upDown' )
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

phScale.register( 'MySolutionKeyboardHelpContent', MySolutionKeyboardHelpContent );