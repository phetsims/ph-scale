// Copyright 2002-2013, University of Colorado Boulder

/**
 * The 'Solutions' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Screen = require( 'JOIST/Screen' );
  var SolutionsModel = require( 'PH_SCALE/solutions/model/SolutionsModel' );
  var SolutionsView = require( 'PH_SCALE/solutions/view/SolutionsView' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/solutions' );

  // images
  var screenIcon = require( 'image!PH_SCALE/Solutions-screen-icon.png' );

  function SolutionsScreen() {
    Screen.call( this,
      screenTitle,
      new Image( screenIcon ),
      function() { return new SolutionsModel(); },
      function( model ) { return new SolutionsView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: PHScaleColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, SolutionsScreen );
} );