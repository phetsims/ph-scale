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

  // Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
  class SoluteIO extends ReferenceIO {}

  //TODO #92 does these need API for getting name, pH, etc?

  SoluteIO.documentation = 'the selected solute';
  SoluteIO.typeName = 'SoluteIO';

  //TODO #92 should be instanceof Solute, but require(Solute) is cyclic, and phet.phScale.Solute doesn't exist yet
  SoluteIO.validator = { isValidValue: value => value instanceof Object };

  //TODO #92 is this the same info as SoluteIO.validator?
  ObjectIO.validateSubtype( SoluteIO );

  return phScale.register( 'SoluteIO', SoluteIO );
} );