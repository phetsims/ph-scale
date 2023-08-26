// Copyright 2013-2023, University of Colorado Boulder

/**
 * MicroModel is the model for the 'Micro' screen.  It extends the PHModel, substituting a different solution
 * model, and omitting the pH meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PHModel from '../../common/model/PHModel.js';
import phScale from '../../phScale.js';
import MicroSolution from './MicroSolution.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MicroModel extends PHModel<MicroSolution> {

  public constructor( tandem: Tandem ) {

    super( {
      createSolution: ( solutionProperty, maxVolume, tandem ) => new MicroSolution( solutionProperty, {
        maxVolume: maxVolume,
        tandem: tandem
      } ),
      tandem: tandem
    } );
  }
}

phScale.register( 'MicroModel', MicroModel );