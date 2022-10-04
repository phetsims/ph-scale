// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/scenery-phet/issues/773 move to scenery-phet
/**
 * FaucetControlsKeyboardHelpContent is the keyboard-help section that describes how to interact with FaucetNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import phScale from '../../phScale.js';

//TODO https://github.com/phetsims/scenery-phet/issues/773 i18n, add to scenery-phet-strings_en.json
const faucetControlsStringProperty = new StringProperty( 'Faucet Controls' );
const openCloseStringProperty = new StringProperty( 'Open/close' );
const openCloseSlowerStringProperty = new StringProperty( 'Open/close slower' );
const dispenseASmallAmountStringProperty = new StringProperty( 'Dispense a small amount' );

type SelfOptions = PickOptional<FaucetNodeOptions, 'tapToDispenseEnabled'>;

export type FaucetControlsKeyboardHelpContentOptions = SelfOptions & KeyboardHelpSectionOptions;

export default class FaucetControlsKeyboardHelpContent extends KeyboardHelpSection {

  public constructor( providedOptions?: FaucetControlsKeyboardHelpContentOptions ) {

    const options = optionize<FaucetControlsKeyboardHelpContentOptions, SelfOptions, KeyboardHelpSectionOptions>()( {

      // SelfOptions
      tapToDispenseEnabled: true
    }, providedOptions );

    // arrows or WASD
    const normalRow = KeyboardHelpSectionRow.labelWithIcon( openCloseStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon() );

    // Shift+arrows or Shift+WASD
    const slowerRow = KeyboardHelpSectionRow.labelWithIconList( openCloseSlowerStringProperty, [
      KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
      KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
    ] );

    const rows = [ normalRow, slowerRow ];

    // Space or Enter
    if ( options.tapToDispenseEnabled ) {

      const dispenseRow = KeyboardHelpSectionRow.labelWithIcon(
        dispenseASmallAmountStringProperty,
        KeyboardHelpIconFactory.iconOrIcon( TextKeyNode.space(), TextKeyNode.enter() )
      );
      rows.push( dispenseRow );
    }

    super( faucetControlsStringProperty, rows );
  }
}

phScale.register( 'FaucetControlsKeyboardHelpContent', FaucetControlsKeyboardHelpContent );