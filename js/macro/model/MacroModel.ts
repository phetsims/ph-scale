// Copyright 2013-2022, University of Colorado Boulder

/**
 * MacroModel is the model for the 'Micro' screen.  It extends the PHModel, substituting a different solution
 * model, and omitting the pH meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PHModel, { PHModelOptions } from '../../common/model/PHModel.js';
import phScale from '../../phScale.js';
import MacroSolution from './MacroSolution.js';

type SelfOptions = EmptySelfOptions;

export type MacroModel2Options = SelfOptions & PickRequired<PHModelOptions<MacroSolution>, 'tandem'>;

export default class MacroModel extends PHModel<MacroSolution> {

  public constructor( providedOptions: MacroModel2Options ) {

    const options = optionize<MacroModel2Options, SelfOptions, PHModelOptions<MacroSolution>>()( {

      // Creates the solution needed by the Macro screen
      createSolution: ( solutionProperty, maxVolume, tandem ) => new MacroSolution( solutionProperty, {
        maxVolume: maxVolume,
        tandem: tandem
      } )
    }, providedOptions );

    super( options );
  }
}

phScale.register( 'MacroModel', MacroModel );