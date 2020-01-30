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
  const Solute = require( 'PH_SCALE/common/model/Solute' );

  // Objects are statically created, use reference equality to look up instances for toStateObject/fromStateObject
  class SoluteIO extends ReferenceIO {}

  SoluteIO.documentation = 'the selected solute';
  SoluteIO.typeName = 'SoluteIO';
  SoluteIO.validator = { isValidValue: v => v instanceof Solute };
  ObjectIO.validateSubtype( SoluteIO ); //TODO #92 is this the same info as SoluteIO.validator?

  //TODO #92 why does Studio show all values as "phScale.requiredTandem" ?

  return phScale.register( 'SoluteIO', SoluteIO );
} );

