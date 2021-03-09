// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model of the dropper, contains solute in solution form (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import PHMovable from './PHMovable.js';
import Solute from './Solute.js';

class Dropper extends PHMovable {

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
      tandem: Tandem.REQUIRED,
      positionPropertyOptions: {
        phetioHighFrequency: true
      }
    }, options );

    super( position, dragBounds, options );

    // @public
    this.soluteProperty = new Property( solute, {
      tandem: options.tandem.createTandem( 'soluteProperty' ),
      phetioType: Property.PropertyIO( Solute.SoluteIO ),
      phetioDocumentation: 'the solute dispensed by the dropper'
    } );

    // @public
    this.dispensingProperty = new BooleanProperty( options.dispensing, {
      tandem: options.tandem.createTandem( 'dispensingProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether solute is currently flowing out of the dropper'
    } );

    // @public
    this.enabledProperty = new BooleanProperty( options.enabled, {
      tandem: options.tandem.createTandem( 'enabledProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'whether the button on the dropper is enabled'
    } );

    // @public
    this.flowRateProperty = new NumberProperty( options.flowRate, {
      units: 'L/s',
      isValidValue: value => ( value >= 0 ),
      tandem: options.tandem.createTandem( 'flowRateProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'the flow rate of solute coming out of the dropper'
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
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.soluteProperty.reset();
    this.dispensingProperty.reset();
    this.enabledProperty.reset();
    this.flowRateProperty.reset();
  }
}

phScale.register( 'Dropper', Dropper );
export default Dropper;