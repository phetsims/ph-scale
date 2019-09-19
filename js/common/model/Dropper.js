// Copyright 2013-2018, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Movable = require( 'PH_SCALE/common/model/Movable' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );

  /**
   * @param {Solute} solute
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

    const self = this;
    Movable.call( this, location, dragBounds );

    // @public
    this.soluteProperty = new Property( solute );
    this.visibleProperty = new BooleanProperty( options.visible );
    this.dispensingProperty = new BooleanProperty( options.dispensing );
    this.enabledProperty = new BooleanProperty( options.enabled );
    this.emptyProperty = new BooleanProperty( options.empty );
    this.flowRateProperty = new NumberProperty( options.flowRate ); // L/sec

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