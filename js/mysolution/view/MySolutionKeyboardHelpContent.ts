// Copyright 2022, University of Colorado Boulder

/**
 * MySolutionKeyboardHelpContent is the keyboard-help content for the 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, Text } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';

export default class MySolutionKeyboardHelpContent extends Node {
  public constructor() {
    super( {
      children: [ new Text( 'Under Construction' ) ]
    } );
  }
}

phScale.register( 'MySolutionKeyboardHelpContent', MySolutionKeyboardHelpContent );