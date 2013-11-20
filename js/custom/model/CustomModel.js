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
  var PHMeter = require( 'PH_SCALE/common/model/PHMeter' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Solution = require( 'PH_SCALE/common/model/Solution' );
  var Solvent = require( 'PH_SCALE/common/model/Solvent' );
  var Vector2 = require( 'DOT/Vector2' );

  function CustomModel() {

    var thisModel = this;

    thisModel.solvent = Solvent.WATER;
    thisModel.beaker = new Beaker( new Vector2( 330, 550 ), new Dimension2( 400, 325 ) );
    thisModel.dropper = new Dropper( Solute.CUSTOM, new Vector2( thisModel.beaker.location.x + 40, 210 ), new Bounds2( 250, 210, 510, 210 ) );
    thisModel.solution = new Solution( thisModel.dropper.soluteProperty, 0, thisModel.solvent, 0, thisModel.beaker.volume );
    thisModel.drainFaucet = new Faucet( new Vector2( thisModel.beaker.right + 100, 602 ), thisModel.beaker.right,
      { enabled: thisModel.solution.volumeProperty.get() > 0 } );
    thisModel.pHMeter = new PHMeter( new Vector2( 85, 60 ), new Bounds2( 10, 150, 835, 680 ), new Vector2( 605, 405 ), new Bounds2( 30, 150, 966, 680 ) );

    // Enable faucets and dropper based on amount of solution in the beaker.
    thisModel.solution.volumeProperty.link( function( volume ) {
      thisModel.drainFaucet.enabledProperty.set( volume > 0 );
      thisModel.dropper.enabledProperty.set( !thisModel.dropper.emptyProperty.get() && ( volume < thisModel.beaker.volume ) );
    } );

    thisModel.solution.pHProperty.link( function( pH ) {
      thisModel.pHMeter.valueProperty.set( pH );
    } );
  }

  CustomModel.prototype = {

    reset: function() {
      this.beaker.reset();
      this.dropper.reset();
      this.solution.reset();
      this.drainFaucet.reset();
      this.pHMeter.reset();
    },

    /*
     * Moves time forward by the specified amount.
     * @param deltaSeconds clock time change, in seconds.
     */
    step: function( deltaSeconds ) {
      this.addSolute( deltaSeconds );
      this.drainSolution( deltaSeconds );
    },

    // private: Add solute from the dropper
    addSolute: function( deltaSeconds ) {
      var deltaVolume = Math.min( this.dropper.flowRateProperty.get() * deltaSeconds, this.solution.getFreeVolume() );
      if ( deltaVolume > 0 ) {
        this.solution.soluteVolumeProperty.set( this.solution.soluteVolumeProperty.get() + deltaVolume );
      }
    },

    // private: Drain solution from the output faucet.
    drainSolution: function( deltaSeconds ) {
      if ( this.solution.volumeProperty.get() > 0 ) {
        assert && assert( this.solution.solventVolumeProperty.get() === 0 ); // custom solution is 100% solute
        var deltaVolume = this.drainFaucet.flowRateProperty.get() * deltaSeconds;
        this.solution.soluteVolumeProperty.set( Math.max( 0, this.solution.soluteVolumeProperty.get() - deltaVolume ) );
      }
    }
  };

  return CustomModel;
} );
