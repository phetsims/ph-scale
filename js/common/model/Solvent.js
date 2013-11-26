// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solvent model, with instances used by this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  // strings
  var waterString = require( 'string!PH_SCALE/choice.water' );

  function Solvent( name, pH, color ) {
    assert && assert( PHScaleConstants.PH_RANGE.contains( pH ) ); // pH is in range
    this.name = name;
    this.pH = pH;
    this.color = color;
  }

  Solvent.WATER = new Solvent( waterString, 7, PHScaleColors.WATER );

  return Solvent;
} );
