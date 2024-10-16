// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

// Maps the SoluteDescriptor to a string that describes the name of the solution.
const soluteMap: Record<SoluteDescriptor, string> = {
  batteryAcid: 'Battery Acid',
  blood: 'Blood',
  chickenSoup: 'Chicken Soup',
  coffee: 'Coffee',
  drainCleaner: 'Drain Cleaner',
  handSoap: 'Hand Soap',
  milk: 'Milk',
  orangeJuice: 'Orange Juice',
  sodaPop: 'Soda Pop',
  spit: 'Spit',
  vomit: 'Vomit',
  water: 'Water'
};

// Maps the WaterVolumeDescriptor to a string that describes the volume of water added to the solution.
const addedWaterVolumeMap: Record<WaterVolumeDescriptor, string> = {
  no: 'no',
  aTinyBitOf: 'a tiny bit of',
  aLittle: 'a little',
  some: 'some',
  equalAmountsOf: 'equal amounts of',
  aFairAmountOf: 'a fair amount of',
  lotsOf: 'lots of',
  mostly: 'mostly'
};

// Maps the TotalVolumeDescriptor to a string that describes the total volume of the solution.
const totalVolumeMap: Record<TotalVolumeDescriptor, string> = {
  empty: 'empty',
  nearlyEmpty: 'nearly empty',
  underHalfFull: 'under half full',
  halfFull: 'half full',
  overHalfFull: 'over half full',
  nearlyFull: 'nearly full',
  full: 'full'
};

// Maps SoluteColorDescriptor to a string that describes the color of the solution.
const soluteColorMap: Record<SoluteColorDescriptor, string> = {
  brightYellow: 'bright yellow',
  red: 'red',
  darkYellow: 'dark yellow',
  brown: 'brown',
  lavender: 'lavender',
  white: 'white',
  orange: 'orange',
  limeGreen: 'lime green',
  colorless: 'colorless',
  salmon: 'salmon'
};

const PHScaleDescriptionStringsEN = {

  //***********************************************************************************
  // Screen Summary State Descriptions
  //***********************************************************************************
  screenSummaryOverview(): string { return 'The Play Area contains a drainable beaker, a solution dropper, water faucet, and a movable pH probe. Water faucet and solution dropper sit above the beaker. The dropper dispenses a number of everyday liquids one at a time.'; },
  screenSummaryControlArea(): string { return 'The Control Area has a button to reset the sim.'; },
  screenSummaryInteractionHint(): string { return 'Add solution to beaker and play.'; },

  //***********************************************************************************
  // Beaker Information
  //***********************************************************************************
  beakerHeading(): string { return 'Solution in Beaker'; },

  //***********************************************************************************
  // Solution Information
  //***********************************************************************************
  // The selected solution.
  solutionParagraph( solute: SoluteDescriptor ): string { return `${soluteMap[ solute ]}`; },

  // Described when the solution is neutral.
  solutionIsNeutral(): string { return 'is neutral'; },

  // Described when the solution has solute with no added water, or the solute is colorless.
  solutionAddedVolumeDescription( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeEnum: WaterVolumeDescriptor ): string {
    return `is ${soluteColorMap[ colorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeEnum ]} added water`;
  },

  // Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeEnum: WaterVolumeDescriptor ): string {
    return `is lighter ${soluteColorMap[ colorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeEnum ]} added water`;
  },

  // Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeEnum: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} liters, ${totalVolumeMap[ totalVolumeEnum ]}`;
  }
};

export default PHScaleDescriptionStringsEN;

// Notes:
// Will static strings go in the "usual" strings file? Maybe this is JUST for dynamic strings?
// Perhaps this is how we do translated "dynamic" strings?
// Bring this into our normal translation system? This level of customization might be useful for visual strings too.
// Strings don't need to be separated into "description strings" and "visual strings". It may be best for static
// strings to appear in rosetta while dynamic strings appear in these JS files.
// If we can get the strings in the normal system, we will get more translations.
  // Perhaps it is worth the combinatorial explosion of strings (for all cases) just to get the translations.