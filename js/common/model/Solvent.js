// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solvent model, with instances used by this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Fluid = require( 'PH_SCALE/common/model/Fluid' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );

  // strings
  var waterString = require( 'string!PH_SCALE/choice.water' );

  function Solvent( name, pH, color ) {
    assert && assert( PHScaleConstants.PH_RANGE.contains( pH ) ); // pH is in range
    this.name = name;
    this.pH = pH;
    Fluid.call( this, color );
  }

  Solvent.WATER = new Solvent( waterString, 7, PHScaleColors.H2O.withAlpha( 127 / 255 ) );

  return inherit( Fluid, Solvent );
} );
