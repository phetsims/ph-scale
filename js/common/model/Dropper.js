// Copyright 2013-2017, University of Colorado Boulder

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
  var phScale = require( 'PH_SCALE/phScale' );
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

    var self = this;
    Movable.call( this, location, dragBounds );

    // @public
    this.soluteProperty = new Property( solute );
    this.visibleProperty = new Property( options.visible );
    this.dispensingProperty = new Property( options.dispensing );
    this.enabledProperty = new Property( options.enabled );
    this.emptyProperty = new Property( options.empty );
    this.flowRateProperty = new Property( options.flowRate ); // L/sec

    // Turn off the dropper when it's disabled.
    this.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        self.dispensingProperty.set( false );
      }
    } );

    // Toggle the flow rate when the dropper is turned on/off.
    this.dispensingProperty.link( function( dispensing ) {
      self.flowRateProperty.set( dispensing ? options.maxFlowRate : 0 );
    } );

    // When the dropper becomes empty, disable it.
    this.emptyProperty.link( function( empty ) {
      if ( empty ) {
        self.enabledProperty.set( false );
      }
    } );
  }

  phScale.register( 'Dropper', Dropper );

  return inherit( Movable, Dropper, {

    // @public
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