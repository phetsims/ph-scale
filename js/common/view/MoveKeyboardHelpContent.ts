// Copyright 2022-2025, University of Colorado Boulder

/**
 * MoveKeyboardHelpContent is the keyboard-help section that describes how to move things that are draggable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetStrings from '../../../../scenery-phet/js/SceneryPhetStrings.js';
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

    // Create the icons that will be used in the section rows.
    const arrowOrWasdKeysIcon = options.dragDirection === 'both' ? KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon() :
                                KeyboardHelpIconFactory.upDownOrWSKeysRowIcon();
    const arrowKeysIcon = options.dragDirection === 'both' ? KeyboardHelpIconFactory.arrowKeysRowIcon() :
                          KeyboardHelpIconFactory.upDownArrowKeysRowIcon();
    const wasdKeysIcon = options.dragDirection === 'both' ? KeyboardHelpIconFactory.wasdRowIcon() :
                         KeyboardHelpIconFactory.wSKeysRowIcon();
    const shiftPlusArrowKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcon );
    const shiftPlusWASDKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdKeysIcon );

    // Create the inner content strings for the section rows.
    const moveLabelInnerContentStringProperty = options.dragDirection === 'both' ? PhScaleStrings.a11y.keyboardHelpDialog.movePHProbe.moveStringProperty :
                                                PhScaleStrings.a11y.keyboardHelpDialog.moveGraphIndicators.moveStringProperty;
    const moveSlowerLabelInnerContentStringProperty = options.dragDirection === 'both' ? PhScaleStrings.a11y.keyboardHelpDialog.movePHProbe.moveSlowerStringProperty :
                                                      PhScaleStrings.a11y.keyboardHelpDialog.moveGraphIndicators.moveSlowerStringProperty;

    const rows = [

      // arrows or WASD, for normal speed
      KeyboardHelpSectionRow.labelWithIcon( PhScaleStrings.keyboardHelpDialog.moveStringProperty,
        arrowOrWasdKeysIcon, {
          labelInnerContent: moveLabelInnerContentStringProperty
        } ),

      // Shift+arrows or Shift+WASD, for slower speed
      KeyboardHelpSectionRow.labelWithIconList( PhScaleStrings.keyboardHelpDialog.moveSlowerStringProperty,
        [ shiftPlusArrowKeysIcon, shiftPlusWASDKeysIcon ], {
          labelInnerContent: moveSlowerLabelInnerContentStringProperty
        } ),
      ...( options.includeHomeAndEnd ? [
        KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.jumpToMinimumStringProperty,
          KeyboardHelpIconFactory.fromHotkeyData( AccessibleValueHandlerHotkeyDataCollection.HOME_HOTKEY_DATA ), {
            labelInnerContent: new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMinimumDescriptionPatternStringProperty, {
              minimum: SceneryPhetStrings.keyboardHelpDialog.minimumStringProperty
            } )
          } ),
        KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.jumpToMaximumStringProperty,
          KeyboardHelpIconFactory.fromHotkeyData( AccessibleValueHandlerHotkeyDataCollection.END_HOTKEY_DATA ), {
            labelInnerContent: new PatternStringProperty( SceneryPhetStrings.a11y.keyboardHelpDialog.slider.jumpToMaximumDescriptionPatternStringProperty, {
              maximum: SceneryPhetStrings.keyboardHelpDialog.maximumStringProperty
            } )
          } ) ] : [] ),

      // Hotkey to jump the pH Probe to specific positions
      ...( options.includeJumpToPosition ? [ KeyboardHelpSectionRow.labelWithIcon( PhScaleStrings.keyboardHelpDialog.jumpPHProbeStringProperty,
        KeyboardHelpIconFactory.fromHotkeyData( MacroPHProbeNode.JUMP_TO_POSITION_HOTKEY_DATA ), {
          labelInnerContent: PhScaleStrings.a11y.keyboardHelpDialog.movePHProbe.jumpStringProperty
        } ) ] : [] )
    ];

    super( titleProperty, rows, {
      isDisposable: false // See https://github.com/phetsims/ph-scale/issues/285
    } );
  }
}

phScale.register( 'MoveKeyboardHelpContent', MoveKeyboardHelpContent );