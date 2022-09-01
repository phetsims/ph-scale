// Copyright 2013-2021, University of Colorado Boulder

/**
 * The 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import microHomeScreenIcon_png from '../../images/microHomeScreenIcon_png.js';
import microNavbarIcon_png from '../../images/microNavbarIcon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import phScaleStrings from '../phScaleStrings.js';
import MicroModel from './model/MicroModel.js';
import MicroScreenView from './view/MicroScreenView.js';

class MicroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const options = {
      name: phScaleStrings.screen.microStringProperty,
      backgroundColorProperty: new Property( PHScaleColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new ScreenIcon( new Image( microHomeScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( microNavbarIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new MicroModel( tandem.createTandem( 'model' ) ),
      model => new MicroScreenView( model, ModelViewTransform2.createIdentity(), tandem.createTandem( 'view' ) ),
      options
    );
  }
}

phScale.register( 'MicroScreen', MicroScreen );
export default MicroScreen;