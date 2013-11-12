// Copyright 2002-2013, University of Colorado Boulder

/**
 * Solute model, with instances used by this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );

  // strings
  var drainCleanerString = require( 'string!PH_SCALE/choice.drainCleaner' );
  var handSoapString = require( 'string!PH_SCALE/choice.handSoap' );
  var bloodString = require( 'string!PH_SCALE/choice.blood' );
  var spitString = require( 'string!PH_SCALE/choice.spit' );
  var milkString = require( 'string!PH_SCALE/choice.milk' );
  var coffeeString = require( 'string!PH_SCALE/choice.coffee' );
  var beerString = require( 'string!PH_SCALE/choice.beer' );
  var sodaString = require( 'string!PH_SCALE/choice.soda' );
  var vomitString = require( 'string!PH_SCALE/choice.vomit' );
  var batteryAcidString = require( 'string!PH_SCALE/choice.batteryAcid' );
  var customString = require( 'string!PH_SCALE/choice.custom' );

  /**
   * @param {String} name
   * @param {Number} pH
   * @param {Color} color
   * @constructor
   */
  function Solute( name, pH, color ) {

    this.name = name;
    this.pHProperty = new Property( pH );
    this.color = color;

    this.pHProperty.link( function( pH ) {
      assert && assert( this.name === customString ); // pH property should be modified only for 'custom' solution!
      assert && assert( PHScaleConstants.PH_RANGE.contains( pH ) ); // pH is in range
    } );
  }

  Solute.DRAIN_CLEANER = new Solute( drainCleanerString, 13, new Color( 255, 255, 0, 150 / 255 ) );
  Solute.HAND_SOAP = new Solute( handSoapString, 10, new Color( 204, 0, 204, 90 / 255 ) );
  Solute.BLOOD = new Solute( bloodString, 7.4, new Color( 185, 12, 0, 150 / 255 ) );
  Solute.SPIT = new Solute( spitString, 7.4, new Color( 204, 204, 198, 73 / 255 ) );
  Solute.MILK = new Solute( milkString, 6.5, new Color( 255, 255, 255, 156 / 255 ) );
  Solute.COFFEE = new Solute( coffeeString, 5.0, new Color( 164, 99, 7, 127 / 255 ) );
  Solute.BEER = new Solute( beerString, 4.5, new Color( 255, 200, 0, 127 / 255 ) );
  Solute.LIME_SODA = new Solute( sodaString, 2.5, new Color( 204, 255, 102, 162 / 255 ) );
  Solute.VOMIT = new Solute( vomitString, 2, new Color( 255, 171, 120, 183 / 255 ) );
  Solute.BATTERY_ACID = new Solute( batteryAcidString, 1, new Color( 255, 255, 0, 127 / 255 ) );
  Solute.CUSTOM = new Solute( customString, 7, new Color( 255, 255, 156, 127 / 255 ) );

  return Solute;
} );
