// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MySolutionScreen = require( 'PH_SCALE/mysolution/MySolutionScreen' );
  var MacroScreen = require( 'PH_SCALE/macro/MacroScreen' );
  var MicroScreen = require( 'PH_SCALE/micro/MicroScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var phScaleTitleString = require( 'string!PH_SCALE/ph-scale.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Yuen-ying Carpenter',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Julia Chamberlain, Trish Loeblein, Emily B. Moore, Ariel Paul, Katherine Perkins',
      graphicArts: 'Sharon Siman-Tov',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Elise Morgan, Oliver Orejola, Benjamin Roberts, Bryan Yoelin',
      thanks: 'Conversion of this simulation to HTML5 was funded in part by the Royal Society of Chemistry.'
    }
  };

  SimLauncher.launch( function() {
    var screens = [
      new MacroScreen(),
      new MicroScreen(),
      new MySolutionScreen()
    ];
    var sim = new Sim( phScaleTitleString, screens, simOptions );
    sim.start();
  } );
} );