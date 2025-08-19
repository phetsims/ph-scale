// Copyright 2013-2025, University of Colorado Boulder

/**
 * The 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../tandem/js/Tandem.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import PhScaleStrings from '../PhScaleStrings.js';
import MacroModel from './model/MacroModel.js';
import MacroKeyboardHelpContent from './view/MacroKeyboardHelpContent.js';
import MacroScreenView from './view/MacroScreenView.js';
import MacroScreenIcon from './view/MacroScreenIcon.js';

export default class MacroScreen extends Screen<MacroModel, MacroScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: PhScaleStrings.screen.macroStringProperty,
      backgroundColorProperty: PHScaleColors.screenBackgroundColorProperty,
      homeScreenIcon: new MacroScreenIcon(),
      navigationBarIcon: new MacroScreenIcon(),
      createKeyboardHelpNode: () => new MacroKeyboardHelpContent(),
      screenButtonsHelpText: PhScaleStrings.a11y.macroScreenButton.accessibleHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new MacroModel( options.tandem.createTandem( 'model' ) ),
      model => new MacroScreenView( model, ModelViewTransform2.createIdentity(), options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

phScale.register( 'MacroScreen', MacroScreen );