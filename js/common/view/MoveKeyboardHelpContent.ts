// Copyright 2022-2025, University of Colorado Boulder

/**
 * MoveKeyboardHelpContent is the keyboard-help section that describes how to move things that are draggable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import AccessibleValueHandlerHotkeyDataCollection from '../../../../sun/js/accessibility/AccessibleValueHandlerHotkeyDataCollection.js';
import { MacroPHProbeNode } from '../../macro/view/MacroPHProbeNode.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';

// The direction in which the draggable can be moved, Both means it can be moved both vertically and horizontally
type DragDirection = 'upDown' | 'both';
type SelfOptions = {
  dragDirection?: DragDirection;
  includeHomeAndEnd?: boolean; // Whether to include the home and end hotkeys
  includeJumpToPosition?: boolean; // Whether to include the jump to position hotkey
};
type MoveKeyboardHelpContentOptions = SelfOptions & KeyboardHelpSectionOptions;
export default class MoveKeyboardHelpContent extends KeyboardHelpSection {

  public constructor( titleProperty: TReadOnlyProperty<string>, providedOptions?: MoveKeyboardHelpContentOptions ) {
    const options = optionize<MoveKeyboardHelpContentOptions, SelfOptions, KeyboardHelpSectionOptions>()( {
      dragDirection: 'both',
      includeJumpToPosition: false,
      includeHomeAndEnd: false
    }, providedOptions );

    const moveHotkeyData = new HotkeyData( {
      keys: options.dragDirection === 'both' ?
        [ 'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown', 'w', 'a', 's', 'd' ] :
        [ 'arrowUp', 'arrowDown', 'w', 's' ],
      repoName: phScale.name,
      keyboardHelpDialogLabelStringProperty: PhScaleStrings.keyboardHelpDialog.moveStringProperty
    } );

    const moveSlowerHotkeyData = new HotkeyData( {
      keys: options.dragDirection === 'both' ?
        [
          'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown',
          'shift+w', 'shift+a', 'shift+s', 'shift+d'
        ] :
        [ 'shift+arrowUp', 'shift+arrowDown', 'shift+w', 'shift+s' ],
      repoName: phScale.name,
      keyboardHelpDialogLabelStringProperty: PhScaleStrings.keyboardHelpDialog.moveSlowerStringProperty
    } );

    const rows = [

      // arrows or WASD, for normal speed
      KeyboardHelpSectionRow.fromHotkeyData( moveHotkeyData ),

      // Shift+arrows or Shift+WASD, for slower speed
      KeyboardHelpSectionRow.fromHotkeyData( moveSlowerHotkeyData ),
      ...( options.includeHomeAndEnd ? [
        KeyboardHelpSectionRow.fromHotkeyData( AccessibleValueHandlerHotkeyDataCollection.HOME_HOTKEY_DATA, {
          labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.jumpToMinimumStringProperty
        } ),
        KeyboardHelpSectionRow.fromHotkeyData( AccessibleValueHandlerHotkeyDataCollection.END_HOTKEY_DATA, {
          labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.jumpToMaximumStringProperty
        } ) ] : [] ),

      // Hotkey to jump the pH Probe to specific positions
      ...( options.includeJumpToPosition ? [ KeyboardHelpSectionRow.fromHotkeyData( MacroPHProbeNode.JUMP_TO_POSITION_HOTKEY_DATA ) ] : [] )
    ];

    super( titleProperty, rows, {} );
  }
}

phScale.register( 'MoveKeyboardHelpContent', MoveKeyboardHelpContent );