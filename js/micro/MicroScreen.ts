// Copyright 2013-2025, University of Colorado Boulder

/**
 * The 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
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

    // TODO: Add documentation for activeProperty, why is it needed? (I remember we just worked on it, but I forgot and it would be good to document here). See https://github.com/phetsims/ph-scale/issues/323
    const activeProperty = new BooleanProperty( false );
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
      screenButtonsHelpText: PhScaleStrings.a11y.microScreenButton.accessibleHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new MicroModel( options.tandem.createTandem( 'model' ) ),
      model => new MicroScreenView( model, activeProperty, ModelViewTransform2.createIdentity(), options.tandem.createTandem( 'view' ) ),
      options
    );

    this.activeProperty.link( active => { activeProperty.value = active; } );
  }
}

phScale.register( 'MicroScreen', MicroScreen );