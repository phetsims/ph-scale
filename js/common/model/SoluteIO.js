// Copyright 2020, University of Colorado Boulder

/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import phScale from '../../phScale.js';
import Solute from './Solute.js';

// Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
class SoluteIO extends ReferenceIO( ObjectIO ) {

  /**
   * Serializes to a state object.
   * @param {PhetioObject} o
   * @returns {*}
   * @public
   * @override
   */
  static toStateObject( o ) {
    validate( o, this.validator );
    return {
      phetioID: o.tandem.phetioID,
      name: o.name,
      pH: o.pH
    };
  }

  /**
   * Deserializes from a state object.
   * @param {*} stateObject
   * @returns {PhetioObject}
   * @public
   */
  static fromStateObject( stateObject ) {
    const solute = ReferenceIO( ObjectIO ).fromStateObject( stateObject.phetioID );
    validate( solute, this.validator );
    return solute;
  }
}

SoluteIO.documentation = 'a solute';
SoluteIO.typeName = 'SoluteIO';
SoluteIO.validator = { isValidValue: value => value instanceof Solute };
ObjectIO.validateSubtype( SoluteIO );

phScale.register( 'SoluteIO', SoluteIO );
export default SoluteIO;