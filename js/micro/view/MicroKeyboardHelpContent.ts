// Copyright 2022, University of Colorado Boulder

/**
 * MicroKeyboardHelpContent is the keyboard-help content for the 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, Text } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';

export default class MicroKeyboardHelpContent extends Node {
  public constructor() {
    super( {
      children: [ new Text( 'Under Construction' ) ]
    } );
  }
}

phScale.register( 'MicroKeyboardHelpContent', MicroKeyboardHelpContent );