// Copyright 2020, University of Colorado Boulder

/**
 * SoluteInstances defines a set of Solute instances that are used throughout the sim.
 * These must be in their own .js file (versus in Solute.js) to avoid the cyclic dependency between
 * Solute and SoluteIO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScaleStrings from '../../ph-scale-strings.js';
import phScale from '../../phScale.js';
import Solute from './Solute.js';
import Water from './Water.js';

// strings
const choiceBatteryAcidString = phScaleStrings.choice.batteryAcid;
const choiceBloodString = phScaleStrings.choice.blood;
const choiceChickenSoupString = phScaleStrings.choice.chickenSoup;
const choiceCoffeeString = phScaleStrings.choice.coffee;
const choiceDrainCleanerString = phScaleStrings.choice.drainCleaner;
const choiceHandSoapString = phScaleStrings.choice.handSoap;
const choiceMilkString = phScaleStrings.choice.milk;
const choiceOrangeJuiceString = phScaleStrings.choice.orangeJuice;
const choiceSodaString = phScaleStrings.choice.soda;
const choiceSpitString = phScaleStrings.choice.spit;
const choiceVomitString = phScaleStrings.choice.vomit;

// tandem for all static instances of Solute, which are used across all screens
const SOLUTES_TANDEM = Tandem.GLOBAL.createTandem( 'model' ).createTandem( 'solutes' );

const SoluteInstances = {

  DRAIN_CLEANER: new Solute( choiceDrainCleanerString, 13, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'drainCleaner' )
  } ),

  HAND_SOAP: new Solute( choiceHandSoapString, 10, new Color( 224, 141, 242 ), {
    colorStopColor: new Color( 232, 204, 255 ),
    tandem: SOLUTES_TANDEM.createTandem( 'handSoap' )
  } ),

  BLOOD: new Solute( choiceBloodString, 7.4, new Color( 211, 79, 68 ), {
    colorStopColor: new Color( 255, 207, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'blood' )
  } ),

  SPIT: new Solute( choiceSpitString, 7.4, new Color( 202, 240, 239 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'spit' )
  } ),

  WATER: new Solute( Water.name, Water.pH, Water.color, {
    tandem: SOLUTES_TANDEM.createTandem( 'water' )
  } ),

  MILK: new Solute( choiceMilkString, 6.5, new Color( 250, 250, 250 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'milk' )
  } ),

  CHICKEN_SOUP: new Solute( choiceChickenSoupString, 5.8, new Color( 255, 240, 104 ), {
    colorStopColor: new Color( 255, 250, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'chickenSoup' )
  } ),

  COFFEE: new Solute( choiceCoffeeString, 5, new Color( 164, 99, 7 ), {
    colorStopColor: new Color( 255, 240, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'coffee' )
  } ),

  ORANGE_JUICE: new Solute( choiceOrangeJuiceString, 3.5, new Color( 255, 180, 0 ), {
    colorStopColor: new Color( 255, 242, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'orangeJuice' )
  } ),

  SODA: new Solute( choiceSodaString, 2.5, new Color( 204, 255, 102 ), {
    colorStopColor: new Color( 238, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'soda' )
  } ),

  VOMIT: new Solute( choiceVomitString, 2, new Color( 255, 171, 120 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'vomit' )
  } ),

  BATTERY_ACID: new Solute( choiceBatteryAcidString, 1, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'batteryAcid' )
  } )
};

phScale.register( 'SoluteInstances', SoluteInstances );
export default SoluteInstances;