// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the 'Custom' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Beaker = require( 'PH_SCALE/common/model/Beaker' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Dropper = require( 'PH_SCALE/common/model/Dropper' );
  var Faucet = require( 'PH_SCALE/common/model/Faucet' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Vector2 = require( 'DOT/Vector2' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  function CustomModel() {

    var thisModel = this;

    thisModel.water = Water;

    // Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
    thisModel.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 400, 325 ) );

    // Dropper above the beaker
    var yDropper = 210;
    thisModel.dropper = new Dropper( Solute.CUSTOM,
      new Vector2( thisModel.beaker.location.x, yDropper ),
      new Bounds2( thisModel.beaker.left + 40, yDropper, thisModel.beaker.right - 40, yDropper ) );

    // Solution in the beaker
    thisModel.solution = new Solution( thisModel.dropper.soluteProperty, 0, thisModel.water, 0, thisModel.beaker.volume );

    // Drain faucet at the beaker's bottom-left.
    thisModel.drainFaucet = new Faucet( new Vector2( thisModel.beaker.left - 75, thisModel.beaker.location.y + 43 ), thisModel.beaker.left,
      { enabled: thisModel.solution.volumeProperty.get() > 0 } );

    // Enable faucets and dropper based on amount of solution in the beaker.
    thisModel.solution.volumeProperty.link( function( volume ) {
      thisModel.drainFaucet.enabledProperty.set( volume > 0 );
      thisModel.dropper.enabledProperty.set( !thisModel.dropper.emptyProperty.get() && ( volume < thisModel.beaker.volume ) );
    } );
  }

  CustomModel.prototype = {

    reset: function() {
      this.beaker.reset();
      this.dropper.reset();
      this.solution.reset();
      this.drainFaucet.reset();
    },

    /*
     * Moves time forward by the specified amount.
     * @param deltaSeconds clock time change, in seconds.
     */
    step: function( deltaSeconds ) {
      this.solution.addSolute( this.dropper.flowRateProperty.get() * deltaSeconds );
      this.solution.drain( this.drainFaucet.flowRateProperty.get() * deltaSeconds );
    }
  };

  return CustomModel;
} );
