// Copyright 2013-2017, University of Colorado Boulder

/**
 * Faucet model, used for input and output faucets.
 * This model assumes that the pipe enters the faucet from the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var phScale = require( 'PH_SCALE/phScale' );

  /**
   * @param {Vector2} location center of output pipe
   * @param {number} pipeMinX x-coordinate of where the pipe starts
   * @param {Object} [options]
   * @constructor
   */
  function Faucet( location, pipeMinX, options ) {

    options = _.extend( {
      spoutWidth: 45, // pixels
      maxFlowRate: 0.25, // L/sec
      flowRate: 0,
      enabled: true
    }, options );

    // @public
    this.location = location;
    this.pipeMinX = pipeMinX;
    this.spoutWidth = options.spoutWidth;
    this.maxFlowRate = options.maxFlowRate;
    this.flowRateProperty = new NumberProperty( options.flowRate );
    this.enabledProperty = new BooleanProperty( options.enabled );

    // when disabled, turn off the faucet.
    var self = this;
    this.enabledProperty.link( function( enabled ) {
      if ( !enabled ) {
        self.flowRateProperty.set( 0 );
      }
    } );
  }

  phScale.register( 'Faucet', Faucet );

  return inherit( Object, Faucet, {

    // @public
    reset: function() {
      this.flowRateProperty.reset();
      this.enabledProperty.reset();
    }
  } );
} );

