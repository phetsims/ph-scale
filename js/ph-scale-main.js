// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BasicsScreen = require( 'PH_SCALE/basics/BasicsScreen' );
  var CustomScreen = require( 'PH_SCALE/custom/CustomScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SolutionsScreen = require( 'PH_SCALE/solutions/SolutionsScreen' );

  // strings
  var simTitle = require( 'string!PH_SCALE/ph-scale.name' );

  var simOptions = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter',
      softwareDevelopment: 'Chris Malley',
      designTeam: 'Emily B. Moore, Ariel Paul, Julia Chamberlain, Katherine Perkins, Trish Loeblein',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Conversion of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
      showHomeScreen: false,
      screenIndex: 2
    }, simOptions );
  }

  //TODO add BasicsScreen only when in 'dev' mode
  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new BasicsScreen(), new SolutionsScreen(), new CustomScreen() ], simOptions );
    sim.start();
  } );
} );