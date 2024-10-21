// Copyright 2024, University of Colorado Boulder

/**
 * This file manages logic for generating strings describing the solution.
 *
 * It maps values from the model to enumerated types that are used to generate description strings.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import phScale from '../../phScale.js';
import Solute from '../model/Solute.js';
import Solution from '../model/Solution.js';

export type SoluteDescriptor = 'batteryAcid' | 'blood' | 'chickenSoup' | 'coffee' | 'drainCleaner' | 'handSoap' | 'milk' | 'orangeJuice' | 'sodaPop' | 'spit' | 'vomit' | 'water';
export type TotalVolumeDescriptor = 'empty' | 'nearlyEmpty' | 'underHalfFull' | 'halfFull' | 'overHalfFull' | 'nearlyFull' | 'full';
export type WaterVolumeDescriptor = 'no' | 'aTinyBitOf' | 'aLittle' | 'some' | 'equalAmountsOf' | 'aFairAmountOf' | 'lotsOf' | 'mostly';
export type SoluteColorDescriptor = 'brightYellow' | 'red' | 'darkYellow' | 'brown' | 'lavender' | 'white' | 'orange' | 'limeGreen' | 'salmon' | 'colorless';
export type PHValueDescriptor = 'none' | 'extremelyAcidic' | 'highlyAcidic' | 'moderatelyAcidic' | 'slightlyAcidic' | 'neutral' | 'slightlyBasic' | 'moderatelyBasic' | 'highlyBasic' | 'extremelyBasic';

export default class SolutionDescriber {

  // An enumeration value used to describe the solute of the solution.
  public readonly soluteDescriptorProperty: TReadOnlyProperty<SoluteDescriptor>;

  // An enumeration value used to describe the added water volume of the solution.
  public readonly addedWaterVolumeDescriptorProperty: TReadOnlyProperty<WaterVolumeDescriptor>;

  // An enumeration value used to describe the total volume of the solution.
  public readonly totalVolumeDescriptorProperty: TReadOnlyProperty<TotalVolumeDescriptor>;

  // An enumeration value used to describe the color of the solution.
  public readonly soluteColorDescriptorProperty: TReadOnlyProperty<SoluteColorDescriptor>;

  // Formatted volume string, as it should appear when displayed to the user.
  public readonly formattedVolumeStringProperty: TReadOnlyProperty<string>;

  // An enumeration value used to describe the pH value of the solution.
  public readonly phValueDescriptorProperty: TReadOnlyProperty<PHValueDescriptor>;

  public constructor( solution: Solution ) {
    this.formattedVolumeStringProperty = new DerivedProperty( [ solution.totalVolumeProperty ], totalVolume => Utils.toFixed( totalVolume, 2 ) );

    this.soluteDescriptorProperty = new DerivedProperty( [ solution.soluteProperty ], solute => {
      return SolutionDescriber.soluteToSoluteDescriptor( solute );
    } );

    this.totalVolumeDescriptorProperty = new DerivedProperty( [ solution.totalVolumeProperty ], totalVolume => {
      return SolutionDescriber.totalVolumeToEnum( totalVolume );
    } );

    this.soluteColorDescriptorProperty = new DerivedProperty( [ solution.soluteProperty ], solute => {
      return SolutionDescriber.soluteToColorEnum( solute );
    } );

    this.addedWaterVolumeDescriptorProperty = new DerivedProperty( [ solution.waterVolumeProperty, solution.totalVolumeProperty ], ( waterVolume, totalVolume ) => {
      return SolutionDescriber.addedWaterVolumeToEnum( waterVolume, totalVolume );
    } );

    this.phValueDescriptorProperty = new DerivedProperty( [ solution.pHProperty ], phValue => {
      return SolutionDescriber.phValueToEnum( phValue );
    } );
  }

  /**
   * Maps the total value to one of the enumeration values used to describe the total volume of the solution.
   */
  private static totalVolumeToEnum( totalVolume: number ): TotalVolumeDescriptor {
    if ( totalVolume === 0 ) {
      return 'empty';
    }
    else if ( totalVolume < 0.3 ) {
      return 'nearlyEmpty';
    }
    else if ( totalVolume < 0.595 ) {
      return 'underHalfFull';
    }
    else if ( totalVolume < 0.605 ) {
      return 'halfFull';
    }
    else if ( totalVolume < 0.9 ) {
      return 'overHalfFull';
    }
    else if ( totalVolume < 1.195 ) {
      return 'nearlyFull';
    }
    else {
      return 'full';
    }
  }

  /**
   * Maps the solute to one of the enumeration values used to describe the solute of the solution.
   */
  private static soluteToSoluteDescriptor( solute: Solute ): SoluteDescriptor {
    if ( solute === Solute.BATTERY_ACID ) {
      return 'batteryAcid';
    }
    else if ( solute === Solute.BLOOD ) {
      return 'blood';
    }
    else if ( solute === Solute.CHICKEN_SOUP ) {
      return 'chickenSoup';
    }
    else if ( solute === Solute.COFFEE ) {
      return 'coffee';
    }
    else if ( solute === Solute.DRAIN_CLEANER ) {
      return 'drainCleaner';
    }
    else if ( solute === Solute.HAND_SOAP ) {
      return 'handSoap';
    }
    else if ( solute === Solute.MILK ) {
      return 'milk';
    }
    else if ( solute === Solute.ORANGE_JUICE ) {
      return 'orangeJuice';
    }
    else if ( solute === Solute.SODA ) {
      return 'sodaPop';
    }
    else if ( solute === Solute.SPIT ) {
      return 'spit';
    }
    else if ( solute === Solute.VOMIT ) {
      return 'vomit';
    }
    else {
      return 'water';
    }
  }

  /**
   * Maps the added water volume to one of the enumeration values used to describe the added water volume of the solution.
   */
  private static addedWaterVolumeToEnum( addedWaterVolume: number, solutionTotalVolume: number ): WaterVolumeDescriptor {

    // Round values so that the description for 'equal' aligns with the displayed values in the sim
    const roundedWaterVolume = phet.dot.Utils.toFixedNumber( addedWaterVolume, 3 );
    const roundedTotalVolume = phet.dot.Utils.toFixedNumber( solutionTotalVolume, 3 );

    let percentAddedWater = 0;
    if ( roundedTotalVolume > 0 ) {
      percentAddedWater = roundedWaterVolume / roundedTotalVolume;
    }

    const amountsEqual = phet.dot.Utils.equalsEpsilon( roundedWaterVolume, roundedTotalVolume - roundedWaterVolume, 0.02 );

    if ( percentAddedWater === 0 ) {
      return 'no';
    }
    else if ( amountsEqual ) {

      // Amounts of added water are equal.
      return 'equalAmountsOf';
    }
    else if ( percentAddedWater <= 0.1 ) {
      return 'aTinyBitOf';
    }
    else if ( percentAddedWater <= 0.25 ) {
      return 'aLittle';
    }
    else if ( percentAddedWater < 0.49 ) {
      return 'some';
    }
    else if ( percentAddedWater < 0.75 ) {
      return 'aFairAmountOf';
    }
    else if ( percentAddedWater < 0.90 ) {
      return 'lotsOf';
    }
    else {
      return 'mostly';
    }
  }

  /**
   * Maps the solute to one of the enumeration values used to describe the color of the solution.
   */
  private static soluteToColorEnum( solute: Solute ): SoluteColorDescriptor {
    if ( solute === Solute.BATTERY_ACID || solute === Solute.DRAIN_CLEANER ) {
      return 'brightYellow';
    }
    else if ( solute === Solute.BLOOD ) {
      return 'red';
    }
    else if ( solute === Solute.CHICKEN_SOUP ) {
      return 'darkYellow';
    }
    else if ( solute === Solute.COFFEE ) {
      return 'brown';
    }
    else if ( solute === Solute.HAND_SOAP ) {
      return 'lavender';
    }
    else if ( solute === Solute.MILK ) {
      return 'white';
    }
    else if ( solute === Solute.ORANGE_JUICE ) {
      return 'orange';
    }
    else if ( solute === Solute.SODA ) {
      return 'limeGreen';
    }
    else if ( solute === Solute.VOMIT ) {
      return 'salmon';
    }
    else {
      return 'colorless';
    }
  }

  private static phValueToEnum( phValue: number | null ): PHValueDescriptor {
    if ( phValue === null ) {
      return 'none';
    }
    else if ( phValue <= 1 ) {
      return 'extremelyAcidic';
    }
    else if ( phValue <= 3 ) {
      return 'highlyAcidic';
    }
    else if ( phValue <= 5 ) {
      return 'moderatelyAcidic';
    }
    else if ( phValue < 7 ) {
      return 'slightlyAcidic';
    }
    else if ( phValue === 7 ) {
      return 'neutral';
    }
    else if ( phValue < 9 ) {
      return 'slightlyBasic';
    }
    else if ( phValue < 11 ) {
      return 'moderatelyBasic';
    }
    else if ( phValue < 13 ) {
      return 'highlyBasic';
    }
    else {
      return 'extremelyBasic';
    }
  }
}

phScale.register( 'SolutionDescriber', SolutionDescriber );