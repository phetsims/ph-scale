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
  const PropertyIO = require( 'AXON/PropertyIO' );
  const SoluteIO = require( 'PH_SCALE/common/model/SoluteIO' );
  const Tandem = require( 'TANDEM/Tandem' );

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
        visible: true,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( position, dragBounds, options );

      // @public
      this.soluteProperty = new Property( solute, {
        tandem: options.tandem.createTandem( 'soluteProperty' ),
        phetioType: PropertyIO( SoluteIO )
      } );

      // @public
      this.visibleProperty = new BooleanProperty( options.visible, {
        tandem: options.tandem.createTandem( 'visibleProperty' )
      } );

      // @public
      this.dispensingProperty = new BooleanProperty( options.dispensing, {
        tandem: options.tandem.createTandem( 'dispensingProperty' ),
        phetioReadOnly: true
      } );

      // @public
      this.enabledProperty = new BooleanProperty( options.enabled, {
        tandem: options.tandem.createTandem( 'enabledProperty' ),
        phetioReadOnly: true
      } );

      // @public
      this.emptyProperty = new BooleanProperty( options.empty, {
        tandem: options.tandem.createTandem( 'emptyProperty' ),
        phetioReadOnly: true
      } );

      // @public
      this.flowRateProperty = new NumberProperty( options.flowRate, {
        //TODO #93 this is exceeded by MacroModel.startAutoFill range: new Range( 0, options.maxFlowRate ),
        units: 'L/s',
        tandem: options.tandem.createTandem( 'flowRateProperty' ),
        phetioReadOnly: true
      } ); // L/sec

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