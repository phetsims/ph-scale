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
  var Property = require( 'AXON/Property' );
  var Water = require( 'PH_SCALE/common/model/Water' );

  // strings
  var drainCleanerString = require( 'string!PH_SCALE/choice.drainCleaner' );
  var handSoapString = require( 'string!PH_SCALE/choice.handSoap' );
  var bloodString = require( 'string!PH_SCALE/choice.blood' );
  var spitString = require( 'string!PH_SCALE/choice.spit' );
  var milkString = require( 'string!PH_SCALE/choice.milk' );
  var chickenSoupString = require( 'string!PH_SCALE/choice.chickenSoup' );
  var coffeeString = require( 'string!PH_SCALE/choice.coffee' );
  var beerString = require( 'string!PH_SCALE/choice.beer' );
  var sodaString = require( 'string!PH_SCALE/choice.soda' );
  var vomitString = require( 'string!PH_SCALE/choice.vomit' );
  var batteryAcidString = require( 'string!PH_SCALE/choice.batteryAcid' );
  var customString = require( 'string!PH_SCALE/choice.custom' );

  /**
   * @param {String} name
   * @param {Number} pH
   * @param {Color} color color of the solute when it's in stock solution
   * @param {Color} dilutedColor color of the solute when it's barely present in solution
   * @constructor
   */
  function Solute( name, pH, color, dilutedColor ) {
    this.name = name;
    this.pHProperty = new Property( pH );
    this.color = color;
    this.dilutedColor = dilutedColor;
  }

  Solute.DRAIN_CLEANER = new Solute( drainCleanerString, 13, new Color( 255, 255, 0 ), Water.color );
  Solute.HAND_SOAP = new Solute( handSoapString, 10, new Color( 204, 0, 204 ), Water.color );
  Solute.BLOOD = new Solute( bloodString, 7.4, new Color( 185, 12, 0 ), Water.color );
  Solute.SPIT = new Solute( spitString, 7.4, new Color( 202, 240, 239 ), Water.color );
  Solute.MILK = new Solute( milkString, 6.5, new Color( 250, 250, 250 ), Water.color );
  Solute.CHICKEN_SOUP = new Solute( chickenSoupString, 5.8, new Color( 255, 240, 104 ), Water.color );
  Solute.COFFEE = new Solute( coffeeString, 5.0, new Color( 164, 99, 7 ), Water.color );
  Solute.BEER = new Solute( beerString, 4.5, new Color( 255, 200, 0 ), Water.color );
  Solute.SODA = new Solute( sodaString, 2.5, new Color( 204, 255, 102 ), Water.color );
  Solute.VOMIT = new Solute( vomitString, 2, new Color( 255, 171, 120 ), Water.color );
  Solute.BATTERY_ACID = new Solute( batteryAcidString, 1, new Color( 255, 255, 0 ), Water.color );
  Solute.CUSTOM = new Solute( customString, 7, new Color( 251, 236, 150 ), Water.color );

  return Solute;
} );
