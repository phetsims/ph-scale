// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solute model, with instances used by this sim.
 * Solutes are immutable, so all fields should be considered immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  // strings
  const choiceBatteryAcidString = require( 'string!PH_SCALE/choice.batteryAcid' );
  const choiceBloodString = require( 'string!PH_SCALE/choice.blood' );
  const choiceChickenSoupString = require( 'string!PH_SCALE/choice.chickenSoup' );
  const choiceCoffeeString = require( 'string!PH_SCALE/choice.coffee' );
  const choiceCustomString = require( 'string!PH_SCALE/choice.custom' );
  const choiceDrainCleanerString = require( 'string!PH_SCALE/choice.drainCleaner' );
  const choiceHandSoapString = require( 'string!PH_SCALE/choice.handSoap' );
  const choiceMilkString = require( 'string!PH_SCALE/choice.milk' );
  const choiceOrangeJuiceString = require( 'string!PH_SCALE/choice.orangeJuice' );
  const choiceSodaString = require( 'string!PH_SCALE/choice.soda' );
  const choiceSpitString = require( 'string!PH_SCALE/choice.spit' );
  const choiceVomitString = require( 'string!PH_SCALE/choice.vomit' );

  class Solute extends PhetioObject {

    /**
     * @param {string} name
     * @param {number} pH
     * @param {stockColor:Color, [dilutedColor]:Color, colorStop:{color:{Color}, [ratio]:Number} } colorScheme
     * @param {Object} [options]
     *
     * colorScheme is an object literal with these properties:
     * stockColor: color of the solute in stock solution (no dilution)
     * dilutedColor: color when the solute is barely present in solution (fully diluted), optional, defaults to Water.color
     * colorStop: color when soluteVolume/totalVolume === ratio, used to smooth out some color transitions if provided, optional
     * ratio: ratio for the color-stop, (0,1) exclusive, optional, defaults to 0.25
     */
    constructor( name, pH, colorScheme, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      if ( !PHScaleConstants.PH_RANGE.contains( pH ) ) {
        throw new Error( 'Solute constructor, pH value is out of range: ' + pH );
      }

      this.name = name; // @public
      this.pH = pH; // @public

      // unpack the colors to make accessing them more convenient in client code
      this.stockColor = colorScheme.stockColor; // @public
      this.dilutedColor = colorScheme.dilutedColor || Water.color; // @private
      this.colorStop = colorScheme.colorStop; // @private, optional, color computation will ignore it if undefined
      if ( this.colorStop ) {
        this.colorStop.ratio = this.colorStop.ratio || 0.25;
      }
    }

    /**
     * String representation of this Solute. For debugging only, do not depend on the format!
     * @returns {string}
     * @public
     */
    toString() {
      return 'Solution[name:' + this.name + ' pH:' + this.pH + ']';
    }

    /**
     * Computes the color for a dilution of this solute.
     * @param {number} ratio describes the dilution, range is [0,1] inclusive, 0 is no solute, 1 is all solute
     * @returns {Color}
     * @public
     */
    computeColor( ratio ) {
      assert && assert( ratio >= 0 && ratio <= 1 );
      let color;
      if ( this.colorStop ) {
        // solute has an optional color-stop
        if ( ratio > this.colorStop.ratio ) {
          color = Color.interpolateRGBA( this.colorStop.color, this.stockColor, ( ratio - this.colorStop.ratio ) / ( 1 - this.colorStop.ratio) );
        }
        else {
          color = Color.interpolateRGBA( this.dilutedColor, this.colorStop.color, ratio / this.colorStop.ratio );
        }
      }
      else {
        color = Color.interpolateRGBA( this.dilutedColor, this.stockColor, ratio );
      }
      return color;
    }

    /**
     * Creates a custom solute.
     * @param {number} pH
     * @returns {Solute}
     * @public
     */
    static createCustom( pH ) {
      return new Solute( choiceCustomString, pH, { stockColor: PHScaleColors.WATER } );
    }
  }

  // 'real world' immutable solutions

  // tandem for all static instances of Solute, which are used across all screens
  //TODO #92 what should this be? why is there no global.solutes in the Studio tree?
  const SOLUTES_TANDEM = Tandem.GLOBAL.createTandem( 'solutes' );

  Solute.DRAIN_CLEANER = new Solute( choiceDrainCleanerString, 13, {
    stockColor: new Color( 255, 255, 0 ),
    colorStop: { color: new Color( 255, 255, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'drainCleaner' )
  } );

  Solute.HAND_SOAP = new Solute( choiceHandSoapString, 10, {
    stockColor: new Color( 224, 141, 242 ),
    colorStop: { color: new Color( 232, 204, 255 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'handSoap' )
  } );

  Solute.BLOOD = new Solute( choiceBloodString, 7.4, {
    stockColor: new Color( 211, 79, 68 ),
    colorStop: { color: new Color( 255, 207, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'blood' )
  } );

  Solute.SPIT = new Solute( choiceSpitString, 7.4, {
    stockColor: new Color( 202, 240, 239 ),
    tandem: SOLUTES_TANDEM.createTandem( 'SPIT' )
  } );

  Solute.WATER = new Solute( Water.name, Water.pH, {
    stockColor: Water.color,
    tandem: SOLUTES_TANDEM.createTandem( 'water' )
  } );

  Solute.MILK = new Solute( choiceMilkString, 6.5, {
    stockColor: new Color( 250, 250, 250 ),
    tandem: SOLUTES_TANDEM.createTandem( 'milk' )
  } );

  Solute.CHICKEN_SOUP = new Solute( choiceChickenSoupString, 5.8, {
    stockColor: new Color( 255, 240, 104 ),
    colorStop: { color: new Color( 255, 250, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'chickenSoup' )
  } );

  Solute.COFFEE = new Solute( choiceCoffeeString, 5, {
    stockColor: new Color( 164, 99, 7 ),
    colorStop: { color: new Color( 255, 240, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'coffee' )
  } );

  Solute.ORANGE_JUICE = new Solute( choiceOrangeJuiceString, 3.5, {
    stockColor: new Color( 255, 180, 0 ),
    colorStop: { color: new Color( 255, 242, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'orangeJuice' )
  } );

  Solute.SODA = new Solute( choiceSodaString, 2.5, {
    stockColor: new Color( 204, 255, 102 ),
    colorStop: { color: new Color( 238, 255, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'soda' )
  } );

  Solute.VOMIT = new Solute( choiceVomitString, 2, {
    stockColor: new Color( 255, 171, 120 ),
    colorStop: { color: new Color( 255, 224, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'vomit' )
  } );

  Solute.BATTERY_ACID = new Solute( choiceBatteryAcidString, 1, {
    stockColor: new Color( 255, 255, 0 ),
    colorStop: { color: new Color( 255, 224, 204 ) },
    tandem: SOLUTES_TANDEM.createTandem( 'batteryAcid' )
  } );

  return phScale.register( 'Solute', Solute );
} );
