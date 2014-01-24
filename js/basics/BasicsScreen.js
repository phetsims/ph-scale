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
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenTitle = require( 'string!PH_SCALE/basics' );

  function BasicsScreen() {
    Screen.call( this,
      screenTitle,
      new Rectangle( 0, 0, 548, 373, { fill: 'green', stroke: 'black' } ), //TODO placeholder
      function() { return new BasicsModel(); },
      function( model ) { return new BasicsView( model, ModelViewTransform2.createIdentity() ); },
      { backgroundColor: PHScaleColors.SCREEN_BACKGROUND }
    );
  }

  return inherit( Screen, BasicsScreen );
} );