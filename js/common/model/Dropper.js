// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PH_SCALE/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Solute} default solute
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Number} maxFlowRate
   * @param {Boolean} visible
   * @constructor
   */
  function Dropper( solute, location, dragBounds, maxFlowRate, visible ) {

    var thisDropper = this;
    Movable.call( thisDropper, location, dragBounds );

    thisDropper.soluteProperty = new Property( solute );
    thisDropper.visibleProperty = new Property( visible );
    thisDropper.onProperty = new Property( false ); // true if the dropper is dispensing solution
    thisDropper.enabledProperty = new Property( true );
    thisDropper.emptyProperty = new Property( false );
    thisDropper.flowRateProperty = new Property( 0 ); // L/sec

    // Turn off the dropper when it's disabled.
    thisDropper.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisDropper.onProperty.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    thisDropper.onProperty.link( function( on ) {
      thisDropper.flowRateProperty.set( on ? maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    thisDropper.emptyProperty.link( function( empty ) {
      if ( empty ) {
        thisDropper.enabledProperty.set( false );
      }
    } );
  }

  return inherit( Movable, Dropper, {
    reset: function() {
      Movable.prototype.reset.call( this );
      this.soluteProperty.reset();
      this.visibleProperty.reset();
      this.onProperty.reset();
      this.enabledProperty.reset();
      this.emptyProperty.reset();
      this.flowRateProperty.reset();
    }
  } );
} );