// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PHScaleConstants from './common/PHScaleConstants.js';
import MacroScreen from './macro/MacroScreen.js';
import MicroScreen from './micro/MicroScreen.js';
import MySolutionScreen from './mysolution/MySolutionScreen.js';
import phScaleStrings from './ph-scale-strings.js';

const phScaleTitleString = phScaleStrings[ 'ph-scale' ].title;

const simOptions = {
  credits: PHScaleConstants.CREDITS
};

SimLauncher.launch( () => {
  const screens = [
    new MacroScreen( Tandem.ROOT.createTandem( 'macroScreen' ) ),
    new MicroScreen( Tandem.ROOT.createTandem( 'microScreen' ) ),
    new MySolutionScreen( Tandem.ROOT.createTandem( 'mySolutionsScreen' ) )
  ];
  const sim = new Sim( phScaleTitleString, screens, simOptions );
  sim.start();
} );