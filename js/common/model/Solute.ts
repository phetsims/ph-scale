// Copyright 2013-2021, University of Colorado Boulder

/**
 * Solute model, with instances used by this sim.
 * Solutes are immutable, so all fields should be considered immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import PHScaleConstants from '../PHScaleConstants.js';
import Water from './Water.js';

// parent tandem for static instances of Solute, which are used across all screens
const SOLUTES_TANDEM = Tandem.GLOBAL_MODEL.createTandem( 'solutes' );

type SelfOptions = {

  // color when the solute is barely present in solution (fully diluted)
  dilutedColor?: Color;

  // color used to smooth out some color transitions as the solute is diluted
  colorStopColor?: Color | null;

  // dilution ratio at which colorStopColor will be applied, ignored if colorStop is null
  // (0,1) exclusive, where 0 is no solute, 1 is all solute
  colorStopRatio?: number;
};

export type SoluteOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Solute extends PhetioObject {

  // Name is a Property solely for PhET-iO. A use-case is when the client wants to replace the solute name with
  // something like '?' as part of an exercise where the student needs to guess a solute's identity.  This Property
  // should definitely not be used to make a solute look like some other solute, but there's nothing to prevent that
  // abuse. See https://github.com/phetsims/ph-scale/issues/110
  public readonly nameProperty: Property<string>;

  // pH value of the solute
  public readonly pH: number;

  // Color of the stock (undiluted) color
  public readonly stockColor: Color;

  // used to other make tandems that pertain to this solute, e.g. combo box items
  public readonly tandemName: string;

  // See SoluteOptions
  private readonly dilutedColor: Color;
  private readonly colorStopColor: Color | null;
  private readonly colorStopRatio: number;

  /**
   * @param name - the name of the solute, displayed to the user
   * @param pH - the pH of the solute
   * @param stockColor - color of the solute in stock solution (no dilution)
   * @param [provideOptions]
   */
  public constructor( name: string, pH: number, stockColor: Color, provideOptions: SoluteOptions ) {

    assert && assert( PHScaleConstants.PH_RANGE.contains( pH ), `invalid pH: ${pH}` );

    const options = optionize<SoluteOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      dilutedColor: Water.color,
      colorStopColor: null,
      colorStopRatio: 0.25,

      // PhetioObjectOptions
      phetioType: Solute.SoluteIO,
      phetioState: false
    }, provideOptions );

    assert && assert( options.colorStopRatio > 0 && options.colorStopRatio < 1,
      `invalid colorStopRatio: ${options.colorStopRatio}` );

    super( options );

    this.nameProperty = new StringProperty( name, {
      tandem: options.tandem.createTandem( 'nameProperty' ),
      phetioDocumentation: 'name of the solute, as displayed in the user interface'
    } );

    this.pH = pH;
    this.stockColor = stockColor;
    this.tandemName = options.tandem.name;

    this.dilutedColor = options.dilutedColor;
    this.colorStopColor = options.colorStopColor;
    this.colorStopRatio = options.colorStopRatio;
  }

  /**
   * String representation of this Solute. For debugging only, do not depend on the format!
   */
  public override toString(): string {
    return `Solution[name:${this.name}, pH:${this.pH}]`;
  }

  /**
   * Gets the solute's name.
   */
  public get name(): string {
    return this.nameProperty.value;
  }

  /**
   * Computes the color for a dilution of this solute.
   * @param ratio describes the dilution, range is [0,1] inclusive, 0 is no solute, 1 is all solute
   */
  public computeColor( ratio: number ): Color {
    assert && assert( ratio >= 0 && ratio <= 1 );
    let color;
    if ( this.colorStopColor ) {
      if ( ratio > this.colorStopRatio ) {
        color = Color.interpolateRGBA( this.colorStopColor, this.stockColor,
          ( ratio - this.colorStopRatio ) / ( 1 - this.colorStopRatio ) );
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

  public static readonly BATTERY_ACID = new Solute( phScaleStrings.choice.batteryAcid, 1, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'batteryAcid' )
  } );

  public static readonly BLOOD = new Solute( phScaleStrings.choice.blood, 7.4, new Color( 211, 79, 68 ), {
    colorStopColor: new Color( 255, 207, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'blood' )
  } );

  public static readonly CHICKEN_SOUP = new Solute( phScaleStrings.choice.chickenSoup, 5.8, new Color( 255, 240, 104 ), {
    colorStopColor: new Color( 255, 250, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'chickenSoup' )
  } );

  public static readonly COFFEE = new Solute( phScaleStrings.choice.coffee, 5, new Color( 164, 99, 7 ), {
    colorStopColor: new Color( 255, 240, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'coffee' )
  } );

  public static readonly DRAIN_CLEANER = new Solute( phScaleStrings.choice.drainCleaner, 13, new Color( 255, 255, 0 ), {
    colorStopColor: new Color( 255, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'drainCleaner' )
  } );

  public static readonly HAND_SOAP = new Solute( phScaleStrings.choice.handSoap, 10, new Color( 224, 141, 242 ), {
    colorStopColor: new Color( 232, 204, 255 ),
    tandem: SOLUTES_TANDEM.createTandem( 'handSoap' )
  } );

  public static readonly MILK = new Solute( phScaleStrings.choice.milk, 6.5, new Color( 250, 250, 250 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'milk' )
  } );

  public static readonly ORANGE_JUICE = new Solute( phScaleStrings.choice.orangeJuice, 3.5, new Color( 255, 180, 0 ), {
    colorStopColor: new Color( 255, 242, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'orangeJuice' )
  } );

  public static readonly SODA = new Solute( phScaleStrings.choice.soda, 2.5, new Color( 204, 255, 102 ), {
    colorStopColor: new Color( 238, 255, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'soda' )
  } );

  public static readonly SPIT = new Solute( phScaleStrings.choice.spit, 7.4, new Color( 202, 240, 239 ), {
    tandem: SOLUTES_TANDEM.createTandem( 'spit' )
  } );

  public static readonly VOMIT = new Solute( phScaleStrings.choice.vomit, 2, new Color( 255, 171, 120 ), {
    colorStopColor: new Color( 255, 224, 204 ),
    tandem: SOLUTES_TANDEM.createTandem( 'vomit' )
  } );

  public static readonly WATER = new Solute( Water.name, Water.pH, Water.color, {
    tandem: SOLUTES_TANDEM.createTandem( 'water' )
  } );

  /**
   * SoluteIO handles PhET-iO serialization of Solute. Since all Solutes are static instances, it implements
   * 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   * But because we want 'name' and 'pH' fields to appear in Studio, we cannot subclass ReferenceIO and must provide
   * both toStateObject and fromStateObject. See https://github.com/phetsims/ph-scale/issues/205.
   */
  public static readonly SoluteIO = new IOType( 'SoluteIO', {
    valueType: Solute,
    supertype: ReferenceIO( IOType.ObjectIO ),
    stateSchema: {
      name: StringIO,
      pH: NumberIO
    },
    toStateObject: solute => {

      const soluteReference = ReferenceIO( IOType.ObjectIO ).toStateObject( solute );
      soluteReference.name = solute.name;
      soluteReference.pH = solute.pH;
      return soluteReference;
    }
  } );
}

phScale.register( 'Solute', Solute );