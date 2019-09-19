// Copyright 2013-2017, University of Colorado Boulder

/**
 * The 'Micro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MicroModel = require( 'PH_SCALE/micro/model/MicroModel' );
  const MicroScreenView = require( 'PH_SCALE/micro/view/MicroScreenView' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenMicroString = require( 'string!PH_SCALE/screen.micro' );

  // images
  const homeIcon = require( 'image!PH_SCALE/Micro-home-icon.png' );
  const navbarIcon = require( 'image!PH_SCALE/Micro-navbar-icon.png' );

  /**
   * @constructor
   */
  function MicroScreen() {

    const options = {
      name: screenMicroString,
      backgroundColorProperty: new Property( PHScaleColors.SCREEN_BACKGROUND ),
      homeScreenIcon: new Image( homeIcon ),
      navigationBarIcon: new Image( navbarIcon )
    };

    Screen.call( this,
      function() { return new MicroModel(); },
      function( model ) { return new MicroScreenView( model, ModelViewTransform2.createIdentity() ); },
      options
    );
  }

  phScale.register( 'MicroScreen', MicroScreen );

  return inherit( Screen, MicroScreen );
} );