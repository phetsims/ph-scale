// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var MacroModel = require( 'PH_SCALE/macro/model/MacroModel' );
  var MacroView = require( 'PH_SCALE/macro/view/MacroView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/macro' );

  // images
  var screenIcon = require( 'image!PH_SCALE/Macro-screen-icon.png' );

  function MacroScreen( modelOptions ) {
    Screen.call( this,
      screenTitle,
      new Image( screenIcon ),
      function() { return new MacroModel( modelOptions ); },
      function( model ) { return new MacroView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: PHScaleColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, MacroScreen );
} );