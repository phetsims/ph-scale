// Copyright 2022, University of Colorado Boulder

/**
 * MacroKeyboardHelpContent is the keyboard-help content for the 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, Text } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';

export default class MacroKeyboardHelpContent extends Node {
  public constructor() {
    super( {
      children: [ new Text( 'Under Construction' ) ]
    } );
  }
}

phScale.register( 'MacroKeyboardHelpContent', MacroKeyboardHelpContent );