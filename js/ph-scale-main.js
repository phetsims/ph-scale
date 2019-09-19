// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const MacroScreen = require( 'PH_SCALE/macro/MacroScreen' );
  const MicroScreen = require( 'PH_SCALE/micro/MicroScreen' );
  const MySolutionScreen = require( 'PH_SCALE/mysolution/MySolutionScreen' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const phScaleTitleString = require( 'string!PH_SCALE/ph-scale.title' );

  const simOptions = {
    credits: PHScaleConstants.CREDITS
  };

  SimLauncher.launch( function() {
    const screens = [
      new MacroScreen(),
      new MicroScreen(),
      new MySolutionScreen()
    ];
    const sim = new Sim( phScaleTitleString, screens, simOptions );
    sim.start();
  } );
} );