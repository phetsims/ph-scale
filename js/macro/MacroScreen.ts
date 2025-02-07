// Copyright 2013-2024, University of Colorado Boulder

/**
 * The 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import macroHomeScreenIcon_png from '../../images/macroHomeScreenIcon_png.js';
import macroNavbarIcon_png from '../../images/macroNavbarIcon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import PhScaleStrings from '../PhScaleStrings.js';
import MacroModel from './model/MacroModel.js';
import MacroKeyboardHelpContent from './view/MacroKeyboardHelpContent.js';
import MacroScreenView from './view/MacroScreenView.js';

export default class MacroScreen extends Screen<MacroModel, MacroScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: PhScaleStrings.screen.macroStringProperty,
      backgroundColorProperty: PHScaleColors.screenBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( macroHomeScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( macroNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new MacroKeyboardHelpContent(),
      isDisposable: false,
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