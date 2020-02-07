// Copyright 2020, University of Colorado Boulder

/**
 * IO type for Solute
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const phScale = require( 'PH_SCALE/phScale' );
  const ReferenceIO = require( 'TANDEM/types/ReferenceIO' );
  const validate = require( 'AXON/validate' );

  // Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
  class SoluteIO extends ReferenceIO {

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
     * @param {*} o
     * @returns {PhetioObject}
     * @public
     */
    static fromStateObject( o ) {
      return ReferenceIO.fromStateObject( o.phetioID);
    }
  }

  SoluteIO.documentation = 'the selected solute';
  SoluteIO.typeName = 'SoluteIO';

  //TODO #92 should be instanceof Solute, but require(Solute) is cyclic, and phet.phScale.Solute doesn't exist yet
  SoluteIO.validator = { isValidValue: value => value instanceof Object };
  ObjectIO.validateSubtype( SoluteIO );

  return phScale.register( 'SoluteIO', SoluteIO );
} );