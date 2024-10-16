// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

// Maps the SoluteDescriptor to a string that describes the name of the solution.
const soluteMap: Record<SoluteDescriptor, string> = {
  batteryAcid: 'Ácido de batería',
  blood: 'Sangre',
  chickenSoup: 'Sopa de pollo',
  coffee: 'Café',
  drainCleaner: 'Limpiador de desagües',
  handSoap: 'Jabón de manos',
  milk: 'Leche',
  orangeJuice: 'Jugo de naranja',
  sodaPop: 'Refresco',
  spit: 'Saliva',
  vomit: 'Vómito',
  water: 'Agua'
};

// Maps the WaterVolumeDescriptor to a string that describes the volume of water added to the solution.
const addedWaterVolumeMap: Record<WaterVolumeDescriptor, string> = {
  no: 'nada de',
  aTinyBitOf: 'un poquito de',
  aLittle: 'un poco de',
  some: 'algo de',
  equalAmountsOf: 'cantidades iguales de',
  aFairAmountOf: 'una buena cantidad de',
  lotsOf: 'mucho de',
  mostly: 'principalmente'
};

// Maps the TotalVolumeDescriptor to a string that describes the total volume of the solution.
const totalVolumeMap: Record<TotalVolumeDescriptor, string> = {
  empty: 'vacío',
  nearlyEmpty: 'casi vacío',
  underHalfFull: 'menos de medio lleno',
  halfFull: 'medio lleno',
  overHalfFull: 'más de medio lleno',
  nearlyFull: 'casi lleno',
  full: 'lleno'
};

// Maps SoluteColorDescriptor to a string that describes the color of the solution.
const soluteColorMap: Record<SoluteColorDescriptor, string> = {
  brightYellow: 'amarillo brillante',
  red: 'rojo',
  darkYellow: 'amarillo oscuro',
  brown: 'marrón',
  lavender: 'lavanda',
  white: 'blanco',
  orange: 'naranja',
  limeGreen: 'verde lima',
  colorless: 'incoloro',
  salmon: 'salmón'
};

const PHScaleDescriptionStringsES = {

  //***********************************************************************************
  // Screen Summary State Descriptions
  //***********************************************************************************
  screenSummaryOverview: (): string => 'El área de juego contiene un vaso drenante, un gotero de solución, un grifo y una sonda de pH móvil. El grifo de agua y el gotero de solución están encima del vaso. El gotero dispensa varios líquidos a la vez.',
  screenSummaryControlArea: (): string => 'El área de control tiene un botón para restablecer la simulación.',
  screenSummaryInteractionHint: (): string => 'Agrega solución al vaso y juega.',

  //***********************************************************************************
  // Beaker Information
  //***********************************************************************************
  beakerHeading: (): string => 'Solución en el vaso',

  //***********************************************************************************
  // Solution Information
  //***********************************************************************************
  // The selected solution.
  solutionParagraph: ( solute: SoluteDescriptor ): string => {
    return `${soluteMap[ solute ]}`;
  },

  // Described when the solution is neutral.
  solutionIsNeutral: (): string => 'es neutra',

  // Described when the solution has solute with no added water, or the solute is colorless.
  solutionAddedVolumeDescription: ( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeEnum: WaterVolumeDescriptor ): string => {
    return `es ${soluteColorMap[ colorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeEnum ]} agua añadida`;
  },

  // Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater: ( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeEnum: WaterVolumeDescriptor ): string => {
    return `es más claro ${soluteColorMap[ colorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeEnum ]} agua añadida`;

    // If it is a "small" or "big" thing, it might need to be "pequeño" or pequena" depending on gender of the item.

    // Instead of this string pattern, do we have a string for every single case?
    // Explosion of strings. Also won't work when we insert numbers into string patterns.
    //
    // Provide different "tiers" of translation support?
  },

  // Describes the total volume of the solution.
  solutionTotalVolumeDescription: ( totalVolumeEnum: TotalVolumeDescriptor, solutionTotalVolume: string ): string => {
    return `${solutionTotalVolume} litros, ${totalVolumeMap[ totalVolumeEnum ]}`;
  }
};

export default PHScaleDescriptionStringsES;