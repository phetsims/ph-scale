// Copyright 2013-2025, University of Colorado Boulder

/**
 * The 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import Image from '../../../scenery/js/nodes/Image.js';
import macroHomeScreenIcon_png from '../../images/macroHomeScreenIcon_png.js';
import macroNavbarIcon_png from '../../images/macroNavbarIcon_png.js';
import PHScaleColors from '../common/PHScaleColors.js';
import phScale from '../phScale.js';
import PhScaleStrings from '../PhScaleStrings.js';
import MacroModel from './model/MacroModel.js';
import MacroKeyboardHelpContent from './view/MacroKeyboardHelpContent.js';
import MacroScreenView, { MacroScreenViewOptions } from './view/MacroScreenView.js';
import WithRequired from '../../../phet-core/js/types/WithRequired.js';
import optionize from '../../../phet-core/js/optionize.js';
import NestedStrictOmit from '../../../phet-core/js/types/NestedStrictOmit.js';

type SelfOptions = {
  macroScreenViewOptions?: Partial<MacroScreenViewOptions>;
};

type MacroScreenOptions = SelfOptions & WithRequired<ScreenOptions, 'tandem'>;
export default class MacroScreen extends Screen<MacroModel, MacroScreenView> {

  public constructor( providedOptions: NestedStrictOmit<MacroScreenOptions, 'macroScreenViewOptions', 'tandem'> ) {

    const options = optionize<MacroScreenOptions, SelfOptions, ScreenOptions>()( {
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
      macroScreenViewOptions: {
        tandem: providedOptions.tandem.createTandem( 'view' )
      }
    }, providedOptions );

    super(
      () => new MacroModel( options.tandem.createTandem( 'model' ) ),
      model => new MacroScreenView( model, ModelViewTransform2.createIdentity(), options.macroScreenViewOptions as MacroScreenViewOptions ),
      options
    );
  }
}

phScale.register( 'MacroScreen', MacroScreen );