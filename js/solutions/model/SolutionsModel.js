// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Solutions' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Solvent = require( 'PH_SCALE/common/model/Solvent' );

  function SolutionsModel() {

    // solute choices
    this.solutes = [
       Solute.DRAIN_CLEANER,
       Solute.HAND_SOAP,
       Solute.BLOOD,
       Solute.SPIT,
       Solute.MILK,
       Solute.COFFEE,
       Solute.BEER,
       Solute.LIME_SODA,
       Solute.VOMIT,
       Solute.BATTERY_ACID
    ];

    this.solution = new Solution( this.solutes[0], 0, Solvent.WATER, 0, PHScaleConstants.MAX_SOLUTION_VOLUME );
  }

  SolutionsModel.prototype = {

    step: function() {
      //TODO
    },

    reset: function() {
      this.solution.reset();
    }
  };

  return SolutionsModel;
} );
