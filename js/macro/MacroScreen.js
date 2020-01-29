// Copyright 2013-2020, University of Colorado Boulder

/**
 * The 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const MacroModel = require( 'PH_SCALE/macro/model/MacroModel' );
  const MacroScreenView = require( 'PH_SCALE/macro/view/MacroScreenView' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const screenMacroString = require( 'string!PH_SCALE/screen.macro' );

  // images
  const homeIcon = require( 'image!PH_SCALE/Macro-home-icon.png' );
  const navbarIcon = require( 'image!PH_SCALE/Macro-navbar-icon.png' );

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
        navigationBarIcon: new Image( navbarIcon )
      };

      super(
        () => new MacroModel( tandem.createTandem( 'model'), modelOptions ),
        model => new MacroScreenView( model, ModelViewTransform2.createIdentity(), tandem.createTandem( 'view') ),
        options
      );
    }
  }

  return phScale.register( 'MacroScreen', MacroScreen );
} );