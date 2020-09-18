// Copyright 2020, University of Colorado Boulder

/**
 * IO Type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import phScale from '../../phScale.js';
import Solute from './Solute.js';

// Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
const SoluteIO = new IOType( 'SoluteIO', {
  isValidValue: value => value instanceof Solute,
  supertype: ReferenceIO( IOType.ObjectIO ),
  toStateObject: solute => ( {
    phetioID: solute.tandem.phetioID,
    name: solute.name,
    pH: solute.pH
  } ),
  fromStateObject( stateObject ) {
    return ReferenceIO( IOType.ObjectIO ).fromStateObject( stateObject.phetioID );
  }
} );

phScale.register( 'SoluteIO', SoluteIO );
export default SoluteIO;