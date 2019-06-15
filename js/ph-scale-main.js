// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var MacroScreen = require( 'PH_SCALE/macro/MacroScreen' );
  var MicroScreen = require( 'PH_SCALE/micro/MicroScreen' );
  var MySolutionScreen = require( 'PH_SCALE/mysolution/MySolutionScreen' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var phScaleTitleString = require( 'string!PH_SCALE/ph-scale.title' );

  var simOptions = {
    credits: PHScaleConstants.CREDITS
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