// Copyright 2013-2025, University of Colorado Boulder

/**
 * The 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import mySolutionHomeScreenIcon_png from '../../images/mySolutionHomeScreenIcon_png.js';
import mySolutionNavbarIcon_png from '../../images/mySolutionNavbarIcon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import PhScaleStrings from '../PhScaleStrings.js';
import MySolutionModel from './model/MySolutionModel.js';
import MySolutionKeyboardHelpContent from './view/MySolutionKeyboardHelpContent.js';
import MySolutionScreenView from './view/MySolutionScreenView.js';

export default class MySolutionScreen extends Screen<MySolutionModel, MySolutionScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {

      // ScreenOptions
      name: PhScaleStrings.screen.mySolutionStringProperty,
      backgroundColorProperty: PHScaleColors.screenBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( mySolutionHomeScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( mySolutionNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      createKeyboardHelpNode: () => new MySolutionKeyboardHelpContent(),
      isDisposable: false,
      tandem: tandem
    };

    super(
      () => new MySolutionModel( options.tandem.createTandem( 'model' ) ),
      model => new MySolutionScreenView( model, ModelViewTransform2.createIdentity(), options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

phScale.register( 'MySolutionScreen', MySolutionScreen );