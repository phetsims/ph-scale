// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const Movable = require( 'PH_SCALE/common/model/Movable' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Property = require( 'AXON/Property' );

  class Dropper extends Movable {

    /**
     * @param {Solute} solute
     * @param {Vector2} position
     * @param {Bounds2} dragBounds
     * @param {Object} [options]
     */
    constructor( solute, position, dragBounds, options ) {

      options = merge( {
        maxFlowRate: 0.05, // L/sec
        flowRate: 0, // L/sec
        dispensing: false, // is the dropper dispensing solute?
        enabled: true,
        empty: false,
        visible: true
      }, options );

      super( position, dragBounds );

      // @public
      this.soluteProperty = new Property( solute );
      this.visibleProperty = new BooleanProperty( options.visible );
      this.dispensingProperty = new BooleanProperty( options.dispensing );
      this.enabledProperty = new BooleanProperty( options.enabled );
      this.emptyProperty = new BooleanProperty( options.empty );
      this.flowRateProperty = new NumberProperty( options.flowRate ); // L/sec

      // Turn off the dropper when it's disabled.
      this.enabledProperty.link( enabled => {
        if ( !enabled ) {
          this.dispensingProperty.set( false );
        }
      } );

      // Toggle the flow rate when the dropper is turned on/off.
      this.dispensingProperty.link( dispensing => {
        this.flowRateProperty.set( dispensing ? options.maxFlowRate : 0 );
      } );

      // When the dropper becomes empty, disable it.
      this.emptyProperty.link( empty => {
        if ( empty ) {
          this.enabledProperty.set( false );
        }
      } );
    }

    /**
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.soluteProperty.reset();
      this.visibleProperty.reset();
      this.dispensingProperty.reset();
      this.enabledProperty.reset();
      this.emptyProperty.reset();
      this.flowRateProperty.reset();
    }
  }

  return phScale.register( 'Dropper', Dropper );
} );