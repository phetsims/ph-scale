// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'PH_SCALE/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Solute} default solute
   * @param {Vector2} location
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   * @constructor
   */
  function Dropper( solute, location, dragBounds, options ) {

    options = _.extend( {
      maxFlowRate: 0.05, // L/sec
      flowRate: 0, // L/sec
      dispensing: false, // is the dropper dispensing solute?
      enabled: true,
      empty: false,
      visible: true
    }, options );

    var thisDropper = this;
    Movable.call( thisDropper, location, dragBounds );

    thisDropper.soluteProperty = new Property( solute );
    thisDropper.visibleProperty = new Property( options.visible );
    thisDropper.dispensingProperty = new Property( options.dispensing );
    thisDropper.enabledProperty = new Property( options.enabled );
    thisDropper.emptyProperty = new Property( options.empty );
    thisDropper.flowRateProperty = new Property( options.flowRate ); // L/sec

    // Turn off the dropper when it's disabled.
    thisDropper.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        thisDropper.dispensingProperty.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    thisDropper.dispensingProperty.link( function( dispensing ) {
      thisDropper.flowRateProperty.set( dispensing ? options.maxFlowRate : 0 );
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
      this.dispensingProperty.reset();
      this.enabledProperty.reset();
      this.emptyProperty.reset();
      this.flowRateProperty.reset();
    }
  } );
} );