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
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import Solute from './Solute.js';
import Water from './Water.js';

// tandem for all static instances of Solute, which are used across all screens
const SOLUTES_TANDEM = Tandem.GLOBAL.createTandem( 'model' ).createTandem( 'solutes' );

const SoluteInstances = {

  BATTERY_ACID: new Solute( phScaleStrings.choice.batteryAcid, 1, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'batteryAcid' )
  } ),

  BLOOD: new Solute( phScaleStrings.choice.blood, 7.4, new Color( 211, 79, 68 ), {
    colorStopColor: new Color( 255, 207, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'blood' )
  } ),

  CHICKEN_SOUP: new Solute( phScaleStrings.choice.chickenSoup, 5.8, new Color( 255, 240, 104 ), {
    colorStopColor: new Color( 255, 250, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'chickenSoup' )
  } ),

  COFFEE: new Solute( phScaleStrings.choice.coffee, 5, new Color( 164, 99, 7 ), {
    colorStopColor: new Color( 255, 240, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'coffee' )
  } ),

  DRAIN_CLEANER: new Solute( phScaleStrings.choice.drainCleaner, 13, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'drainCleaner' )
  } ),

  HAND_SOAP: new Solute( phScaleStrings.choice.handSoap, 10, new Color( 224, 141, 242 ), {
    colorStopColor: new Color( 232, 204, 255 ),
    tandem: SOLUTES_TANDEM.createTandem( 'handSoap' )
  } ),

  MILK: new Solute( phScaleStrings.choice.milk, 6.5, new Color( 250, 250, 250 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'milk' )
  } ),

  ORANGE_JUICE: new Solute( phScaleStrings.choice.orangeJuice, 3.5, new Color( 255, 180, 0 ), {
    colorStopColor: new Color( 255, 242, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'orangeJuice' )
  } ),

  SODA: new Solute( phScaleStrings.choice.soda, 2.5, new Color( 204, 255, 102 ), {
    colorStopColor: new Color( 238, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'soda' )
  } ),

  SPIT: new Solute( phScaleStrings.choice.spit, 7.4, new Color( 202, 240, 239 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'spit' )
  } ),

  VOMIT: new Solute( phScaleStrings.choice.vomit, 2, new Color( 255, 171, 120 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'vomit' )
  } ),

  WATER: new Solute( Water.name, Water.pH, Water.color, {
    tandem: SOLUTES_TANDEM.createTandem( 'water' )
  } )
};

phScale.register( 'SoluteInstances', SoluteInstances );
export default SoluteInstances;