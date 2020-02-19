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
  const SoluteIO = require( 'PH_SCALE/common/model/SoluteIO' );
  const StringProperty = require( 'AXON/StringProperty' );
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
     * @param {string} name - the name of the solute, displayed to the user
     * @param {number} pH - the pH of the solute
     * @param {Color} stockColor - color of the solute in stock solution (no dilution)
     * @param {Object} [options]
     * 
     */
    constructor( name, pH, stockColor, options ) {

      assert && assert( PHScaleConstants.PH_RANGE.contains( pH ), `invalid pH: ${pH}` );
      assert && assert( stockColor instanceof Color, 'invalid color' );

      options = merge( {

        // {Color} color when the solute is barely present in solution (fully diluted)
        dilutedColor: Water.color,

        // {Color|null} optional color use to smooth out some color transitions
        colorStopColor: null,
        
        // {number} ratio for the color-stop, (0,1) exclusive, ignored if colorStopColor is null
        colorStopRatio: 0.25,

        // phet-io
        tandem: Tandem.OPTIONAL, // this is optional because in MySolutions, a new Solute is created for each pH change
        phetioType: SoluteIO
      }, options );

      super( options );

      // @public (read-only)
      this.nameProperty = new StringProperty( name, {
        tandem: options.tandem.createTandem( 'nameProperty' ),
        phetioDocumentation: 'name of the solute, as displayed in the user interface'
      } );
      this.pH = pH;
      this.stockColor = stockColor;
      
      // @private
      this.dilutedColor = options.dilutedColor;
      this.colorStop = options.colorStop;
      this.colorStopRatio = options.colorStopRatio;
    }

    /**
     * String representation of this Solute. For debugging only, do not depend on the format!
     * @returns {string}
     * @public
     */
    toString() {
      return `Solution[name:${this.name}, pH:${this.pH}]`;
    }

    /**
     * Gets the solute's name.
     * @returns {string}
     */
    get name() {
      return this.nameProperty.value;
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
        if ( ratio > this.colorStopRatio ) {
          color = Color.interpolateRGBA( this.colorStopColor, this.stockColor,
            ( ratio - this.colorStopRatio ) / ( 1 - this.colorStopRatio) );
        }
        else {
          color = Color.interpolateRGBA( this.dilutedColor, this.colorStopColor,
            ratio / this.colorStopRatio );
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
      return new Solute( choiceCustomString, pH, PHScaleColors.WATER );
    }
  }

  // 'real world' immutable solutions -------------------------------------------------------

  // tandem for all static instances of Solute, which are used across all screens
  const SOLUTES_TANDEM = Tandem.GLOBAL.createTandem( 'model').createTandem( 'solutes' );

  Solute.DRAIN_CLEANER = new Solute( choiceDrainCleanerString, 13, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'drainCleaner' )
  } );

  Solute.HAND_SOAP = new Solute( choiceHandSoapString, 10, new Color( 224, 141, 242 ), {
    colorStopColor: new Color( 232, 204, 255 ),
    tandem: SOLUTES_TANDEM.createTandem( 'handSoap' )
  } );

  Solute.BLOOD = new Solute( choiceBloodString, 7.4, new Color( 211, 79, 68 ), {
    colorStopColor: new Color( 255, 207, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'blood' )
  } );

  Solute.SPIT = new Solute( choiceSpitString, 7.4, new Color( 202, 240, 239 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'spit' )
  } );

  Solute.WATER = new Solute( Water.name, Water.pH, Water.color, {
    tandem: SOLUTES_TANDEM.createTandem( 'water' )
  } );

  Solute.MILK = new Solute( choiceMilkString, 6.5, new Color( 250, 250, 250 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'milk' )
  } );

  Solute.CHICKEN_SOUP = new Solute( choiceChickenSoupString, 5.8, new Color( 255, 240, 104 ), {
    colorStopColor: new Color( 255, 250, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'chickenSoup' )
  } );

  Solute.COFFEE = new Solute( choiceCoffeeString, 5, new Color( 164, 99, 7 ), {
    colorStopColor: new Color( 255, 240, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'coffee' )
  } );

  Solute.ORANGE_JUICE = new Solute( choiceOrangeJuiceString, 3.5, new Color( 255, 180, 0 ), {
    colorStopColor: new Color( 255, 242, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'orangeJuice' )
  } );

  Solute.SODA = new Solute( choiceSodaString, 2.5, new Color( 204, 255, 102 ), {
    colorStopColor: new Color( 238, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'soda' )
  } );

  Solute.VOMIT = new Solute( choiceVomitString, 2, new Color( 255, 171, 120 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'vomit' )
  } );

  Solute.BATTERY_ACID = new Solute( choiceBatteryAcidString, 1, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'batteryAcid' )
  } );

  return phScale.register( 'Solute', Solute );
} );
