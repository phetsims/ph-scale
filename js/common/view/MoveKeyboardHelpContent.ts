// Copyright 2022-2024, University of Colorado Boulder

/**
 * MoveKeyboardHelpContent is the keyboard-help section that describes how to move things that are draggable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import { MacroPHProbeNode } from '../../macro/view/MacroPHProbeNode.js';

export default class MoveKeyboardHelpContent extends KeyboardHelpSection {

  public constructor( titleProperty: TReadOnlyProperty<string> ) {
    const arrowOrWasdKeysIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const arrowKeysIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const wasdKeysIcon = KeyboardHelpIconFactory.wasdRowIcon();
    const shiftPlusArrowKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcon );
    const shiftPlusWASDKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdKeysIcon );

    const rows = [

      // arrows or WASD, for normal speed
      KeyboardHelpSectionRow.labelWithIcon( PhScaleStrings.keyboardHelpDialog.moveStringProperty,
        arrowOrWasdKeysIcon ),

      // Shift+arrows or Shift+WASD, for slower speed
      KeyboardHelpSectionRow.labelWithIconList( PhScaleStrings.keyboardHelpDialog.moveSlowerStringProperty,
        [ shiftPlusArrowKeysIcon, shiftPlusWASDKeysIcon ] ),

      // Hotkey to jump the pH Probe to specific positions
      KeyboardHelpSectionRow.labelWithIcon( PhScaleStrings.keyboardHelpDialog.jumpPHProbeStringProperty,
        KeyboardHelpIconFactory.fromHotkeyData( MacroPHProbeNode.JUMP_TO_POSITION_HOTKEY_DATA ) )
    ];

    super( titleProperty, rows, {
      isDisposable: false // See https://github.com/phetsims/ph-scale/issues/285
    } );
  }
}

phScale.register( 'MoveKeyboardHelpContent', MoveKeyboardHelpContent );