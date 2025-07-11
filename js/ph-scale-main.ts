// Copyright 2013-2025, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PHScaleConstants from './common/PHScaleConstants.js';
import MacroScreen from './macro/MacroScreen.js';
import MicroScreen from './micro/MicroScreen.js';
import MySolutionScreen from './mysolution/MySolutionScreen.js';
import PhScaleStrings from './PhScaleStrings.js';
import PHScalePreferencesNode from './common/view/PHScalePreferencesNode.js';

simLauncher.launch( () => {

  const screens = [
    new MacroScreen( Tandem.ROOT.createTandem( 'macroScreen' ) ),
    new MicroScreen( Tandem.ROOT.createTandem( 'microScreen' ) ),
    new MySolutionScreen( Tandem.ROOT.createTandem( 'mySolutionScreen' ) )
  ];

  const preferencesModel = new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: ( tandem: Tandem ) => new PHScalePreferencesNode( tandem.createTandem( 'preferencesNode' ) )
      } ]
    }
  } );

  const sim = new Sim( PhScaleStrings[ 'ph-scale' ].titleStringProperty, screens, {
    credits: PHScaleConstants.CREDITS,
    phetioDesigned: true,
    preferencesModel: preferencesModel
  } );

  sim.start();
} );