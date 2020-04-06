// Copyright 2013-2020, University of Colorado Boulder

/**
 * The 'My Solution' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import homeIcon from '../../images/MySolution-home-icon_png.js';
import navbarIcon from '../../images/MySolution-navbar-icon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import phScaleStrings from '../phScaleStrings.js';
import MySolutionModel from './model/MySolutionModel.js';
import MySolutionScreenView from './view/MySolutionScreenView.js';

class MySolutionScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const options = {
      name: phScaleStrings.screen.mySolution,
      backgroundColorProperty: new Property( PHScaleColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new Image( homeIcon ),
      navigationBarIcon: new Image( navbarIcon ),
      tandem: tandem
    };

    super(
      () => new MySolutionModel( tandem.createTandem( 'model' ) ),
      model => new MySolutionScreenView( model, ModelViewTransform2.createIdentity(), tandem.createTandem( 'view' ) ),
      options
    );
  }
}

phScale.register( 'MySolutionScreen', MySolutionScreen );
export default MySolutionScreen;