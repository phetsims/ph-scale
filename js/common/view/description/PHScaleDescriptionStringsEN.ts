// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { FlowRateDescriptor } from '../FlowDescriber.js';
import { PHValueDescriptor, SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

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

// Solutions/Solutes
const phValueMap = {
  none: 'not in beaker',
  extremelyAcidic: 'extremely acidic',
  highlyAcidic: 'highly acidic',
  moderatelyAcidic: 'moderately acidic',
  slightlyAcidic: 'slightly acidic',
  neutral: 'neutral',
  slightlyBasic: 'slightly basic',
  moderatelyBasic: 'moderately basic',
  highlyBasic: 'highly basic',
  extremelyBasic: 'extremely basic'
};

const flowRateMap = {
  closed: 'closed',
  openATinyBit: 'open a tiny bit',
  openALittle: 'open a little',
  somewhatOpen: 'somewhat open',
  halfwayOpen: 'halfway open',
  openALot: 'open a lot',
  fullyOpen: 'fully open'
};

const PHScaleDescriptionStringsEN = {

  //***********************************************************************************
  // Screen Summary State Descriptions
  //***********************************************************************************
  screenSummaryOverview(): string { return 'The Play Area contains a drainable beaker, a solution dropper, water faucet, and a movable pH probe. Water faucet and solution dropper sit above the beaker. The dropper dispenses a number of everyday liquids one at a time.'; },
  screenSummaryControlArea(): string { return 'The Control Area has a button to reset the sim.'; },
  screenSummaryInteractionHint(): string { return 'Add solution to beaker and play.'; },

  //***********************************************************************************
  // Alternative form of screen summary, with complicated sentence. Cases are broken
  // up with logic.
  //***********************************************************************************
  screenSummaryDynamic(
    soluteDescriptor: SoluteDescriptor,
    totalVolumeDescriptor: TotalVolumeDescriptor,
    solutionPH: number | null,
    meterPH: number | null,
    solutionPHDescriptor: PHValueDescriptor,
    solutionTotalVolume: string,
    soluteColorDescriptor: SoluteColorDescriptor,
    addedWaterVolumeDescriptor: WaterVolumeDescriptor
  ): string {
    if ( totalVolumeDescriptor === 'empty' ) {

      // There is no water or solute in the beaker.
      return `Currently, beaker is ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
    }
    else if ( soluteDescriptor === 'water' ) {

      // There is only water in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `Currently, beaker contains ${solutionTotalVolume} liters of ${soluteMap[ soluteDescriptor ]} and is ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
      }
      else {

        // The meater is measuring a value.
        return `Currently, beaker contains ${solutionTotalVolume} liters of ${soluteMap[ soluteDescriptor ]} and is ${totalVolumeMap[ totalVolumeDescriptor ]}. ${soluteMap[ soluteDescriptor ]} has a pH of ${solutionPH} and is ${phValueMap[ solutionPHDescriptor ]}.`;
      }
    }
    else if ( addedWaterVolumeDescriptor === 'equalAmountsOf' ) {

      // There are equal amounts of water and solute in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `Currently, ${soluteMap[ soluteDescriptor ]} solution is ${soluteColorMap[ soluteColorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} and added water. Beaker is ${totalVolumeMap[ totalVolumeDescriptor ]} at ${solutionTotalVolume} liters.`;
      }
      else {

        // The meter is measuring a value.
        return `Currently, ${soluteMap[ soluteDescriptor ]} solution has a pH of ${solutionPH} and is ${phValueMap[ solutionPHDescriptor ]}. Solution is ${soluteColorMap[ soluteColorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} and added water. Beaker is ${totalVolumeMap[ totalVolumeDescriptor ]} at ${solutionTotalVolume} liters.`;
      }
    }
    else if ( meterPH === null ) {

      // There is a solute in the beaker and it is not an equal amount of water.
      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        // In this case, there is some amount of water and solute (other than equal)
        return `Currently, ${soluteMap[ soluteDescriptor ]} solution is ${soluteColorMap[ soluteColorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} added water. Beaker is ${totalVolumeMap[ totalVolumeDescriptor ]} at ${solutionTotalVolume} liters.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `Currently, ${soluteMap[ soluteDescriptor ]} solution is lighter ${soluteColorMap[ soluteColorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} added water. Beaker is ${totalVolumeMap[ totalVolumeDescriptor ]} at ${solutionTotalVolume} liters.`;
      }
    }
    else {

      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        return `Currently, ${soluteMap[ soluteDescriptor ]} solution has a pH of ${solutionPH} and is ${phValueMap[ solutionPHDescriptor ]}. Solution is ${soluteColorMap[ soluteColorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} added water. Beaker is ${totalVolumeMap[ totalVolumeDescriptor ]} at ${solutionTotalVolume} liters.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `Currently, ${soluteMap[ soluteDescriptor ]} solution has a pH of ${solutionPH} and is ${phValueMap[ solutionPHDescriptor ]}. Solution is lighter ${soluteColorMap[ soluteColorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} added water. Beaker is ${totalVolumeMap[ totalVolumeDescriptor ]} at ${solutionTotalVolume} liters.`;
      }
    }
  },

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
  solutionAddedVolumeDescription( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `is ${soluteColorMap[ colorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} added water`;
  },

  // Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `is lighter ${soluteColorMap[ colorDescriptor ]} with ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} added water`;
  },

  // Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeDescriptor: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} liters, ${totalVolumeMap[ totalVolumeDescriptor ]}`;
  },

  //***********************************************************************************
  // pH Meter Information
  //***********************************************************************************
  phMeterHeading(): string {
    return 'pH Meter and Read Out';
  },
  measuredPHDescription( meterPH: number | null ): string {
    return `has a pH of ${meterPH}`;
  },
  qualitativePHDescription( phDescriptor: PHValueDescriptor ): string {
    return `is ${phValueMap[ phDescriptor ]}`;
  },
  meterDescription(): string {
    return '(placeholder for meter description)';
  },
  probeLocation(): string {
    return '(placeholder for probe location)';
  },
  phMeterProbeAccessibleName(): string { return 'pH Probe'; },
  phMeterProbeGrabAccessibleName(): string { return 'Grab pH Probe'; },
  phMeterProbeHelpText(): string { return 'Look for pH probe to play. Once grabbed, use keyboard shortcuts to move probe. Space to release.'; },

  //***********************************************************************************
  // Solution and pH Meter Information
  //***********************************************************************************
  solutionControls(): string {
    return 'Solution and pH Meter Controls';
  },
  soluteComboBoxAccessibleName(): string {
    return 'Solution';
  },
  soluteName( solute: SoluteDescriptor ): string {
    return soluteMap[ solute ];
  },
  soluteComboBoxHelpText(): string { return 'Choose an everyday liquid for the dropper.'; },
  dropperAccessibleName(): string { return 'Dropper'; },
  dropperDispensingAlert( isDispensing: boolean ): string {
    return isDispensing ? 'Dispensing.' : 'Not dispensing.';
  },
  waterFaucetAccessibleName(): string { return 'Water Faucet'; },
  waterFaucetHelpText(): string { return 'Add water to solution in beaker.'; },
  drainFaucetAccessibleName(): string { return 'Drain'; },
  drainFaucetHelpText(): string { return 'Open to drain solution from beaker.'; },
  faucetAriaValueText(
    flowRateDescriptor: FlowRateDescriptor
  ): string {
    // E.g. on focus: Water Faucet, closed
    return `${flowRateMap[ flowRateDescriptor ]}`;
  },

  //***********************************************************************************
  // Context responses about water flow.
  //***********************************************************************************
  faucetOnContextResponse(): string {
    return 'Water is flowing.';
  },
  faucetOffContextResponse(): string {
    return 'Water is off.';
  },

  liquidChangingAlert(
    goingUp: boolean, // Is the water level going up? True or false.
    totalVolumeValue: string // The total volume of the solution.
  ): string {
    return `Level going ${goingUp ? 'up' : 'down'}, now at ${totalVolumeValue} liters.`;
  },
  liquidChangingDoneAlert(
    totalVolumeEnum: TotalVolumeDescriptor
  ): string {
    return `Level stable, now at ${totalVolumeMap[ totalVolumeEnum ]}.`;
  }
};

export default PHScaleDescriptionStringsEN;