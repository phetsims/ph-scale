// Copyright 2013-2023, University of Colorado Boulder

/**
 * Main entry point for the 'pH Scale' sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PHScaleConstants from './common/PHScaleConstants.js';
import MacroScreen from './macro/MacroScreen.js';
import MicroScreen from './micro/MicroScreen.js';
import MySolutionScreen from './mysolution/MySolutionScreen.js';
import PhScaleStrings from './PhScaleStrings.js';
import DescriptionContext from '../../joist/js/DescriptionContext.js';
import PHScaleDescriptionStrings_en from './description/ph-scale-description-strings_en.js'; // eslint-disable-line default-import-match-filename
import PHScaleDescriptionStrings_es from './description/ph-scale-description-strings_es.js'; // eslint-disable-line default-import-match-filename
import PHScaleDescriptionLogic from './description/ph-scale-description-logic.js'; // eslint-disable-line default-import-match-filename
import Alerter from '../../scenery-phet/js/accessibility/describers/Alerter.js';

simLauncher.launch( () => {

  if ( phet.chipper.queryParameters.supportsDescriptionPlugin ) {
    PHScaleDescriptionStrings_en();
    PHScaleDescriptionStrings_es();
    PHScaleDescriptionLogic();

    phet.log && phet.log( Alerter );

    phet.log && phet.log( PHScaleDescriptionStrings_en.toString() );
    phet.log && phet.log( PHScaleDescriptionLogic.toString() );
  }

  const screens = [
    new MacroScreen( Tandem.ROOT.createTandem( 'macroScreen' ) ),
    new MicroScreen( Tandem.ROOT.createTandem( 'microScreen' ) ),
    new MySolutionScreen( Tandem.ROOT.createTandem( 'mySolutionScreen' ) )
  ];

  const sim = new Sim( PhScaleStrings[ 'ph-scale' ].titleStringProperty, screens, {
    credits: PHScaleConstants.CREDITS,
    phetioDesigned: true
  } );

  phet.chipper.queryParameters.supportsDescriptionPlugin && sim.isConstructionCompleteProperty.lazyLink( isConstructionComplete => {
    DescriptionContext.startupComplete();
  } );

  sim.start();
} );