// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BasicsModel = require( 'PH_SCALE/basics/model/BasicsModel' );
  var BasicsView = require( 'PH_SCALE/basics/view/BasicsView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/basics' );

  // images
  var screenIcon = require( 'image!PH_SCALE/Basics-screen-icon.png' );

  function BasicsScreen( modelOptions ) {

    Screen.call( this,
      screenTitle,
      new Image( screenIcon ),
      function() { return new BasicsModel( modelOptions ); },
      function( model ) { return new BasicsView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: PHScaleColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, BasicsScreen );
} );