// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Custom' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var CustomModel = require( 'PH_SCALE/custom/model/CustomModel' );
  var CustomView = require( 'PH_SCALE/custom/view/CustomView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/custom' );

  // images
  var screenIcon = require( 'image!PH_SCALE/Custom-screen-icon.jpg' );

  function CustomScreen() {
    Screen.call( this,
      screenTitle,
      new Image( screenIcon ),
      function() { return new CustomModel(); },
      function( model ) { return new CustomView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: PHScaleColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, CustomScreen );
} );