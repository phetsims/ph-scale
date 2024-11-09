// Copyright 2013-2024, University of Colorado Boulder

/**
 * The 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import microHomeScreenIcon_png from '../../images/microHomeScreenIcon_png.js';
import microNavbarIcon_png from '../../images/microNavbarIcon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import PhScaleStrings from '../PhScaleStrings.js';
import MicroModel from './model/MicroModel.js';
import MicroKeyboardHelpContent from './view/MicroKeyboardHelpContent.js';
import MicroScreenView from './view/MicroScreenView.js';

export default class MicroScreen extends Screen<MicroModel, MicroScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {

      // ScreenOptions
      name: PhScaleStrings.screen.microStringProperty,
      backgroundColorProperty: PHScaleColors.screenBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( microHomeScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( microNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new MicroKeyboardHelpContent(),
      isDisposable: false,
      tandem: tandem
    };

    super(
      () => new MicroModel( options.tandem.createTandem( 'model' ) ),
      model => new MicroScreenView( model, ModelViewTransform2.createIdentity(), options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

phScale.register( 'MicroScreen', MicroScreen );