// Copyright 2013-2020, University of Colorado Boulder

/**
 * The 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import homeIcon from '../../images/Macro-home-icon_png.js';
import navbarIcon from '../../images/Macro-navbar-icon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScaleStrings from '../phScaleStrings.js';
import phScale from '../phScale.js';
import MacroModel from './model/MacroModel.js';
import MacroScreenView from './view/MacroScreenView.js';

const screenMacroString = phScaleStrings.screen.macro;


class MacroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @param {Object} [modelOptions]
   */
  constructor( tandem, modelOptions ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    const options = {
      name: screenMacroString,
      backgroundColorProperty: new Property( PHScaleColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new Image( homeIcon ),
      navigationBarIcon: new Image( navbarIcon ),
      tandem: tandem
    };

    super(
      () => new MacroModel( tandem.createTandem( 'model' ), modelOptions ),
      model => new MacroScreenView( model, ModelViewTransform2.createIdentity(), tandem.createTandem( 'view' ) ),
      options
    );
  }
}

phScale.register( 'MacroScreen', MacroScreen );
export default MacroScreen;