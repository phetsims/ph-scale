// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

// TEST DOCUMENT TRANSLATED USING A GPT

import { SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

// Maps the SoluteDescriptor to a string that describes the name of the solution.
const soluteMap: Record<SoluteDescriptor, string> = {
  batteryAcid: 'Acide de batterie',
  blood: 'Sang',
  chickenSoup: 'Soupe de poulet',
  coffee: 'Café',
  drainCleaner: 'Nettoyant pour canalisations',
  handSoap: 'Savon pour les mains',
  milk: 'Lait',
  orangeJuice: 'Jus d\'orange',
  sodaPop: 'Soda',
  spit: 'Salive',
  vomit: 'Vomi',
  water: 'Eau'
};

// Maps the WaterVolumeDescriptor to a string that describes the volume of water added to the solution.
const addedWaterVolumeMap: Record<WaterVolumeDescriptor, string> = {
  no: 'pas de',
  aTinyBitOf: 'un tout petit peu de',
  aLittle: 'un peu de',
  some: 'un peu de',
  equalAmountsOf: 'des quantités égales de',
  aFairAmountOf: 'une bonne quantité de',
  lotsOf: 'beaucoup de',
  mostly: 'principalement'
};

// Maps the TotalVolumeDescriptor to a string that describes the total volume of the solution.
const totalVolumeMap: Record<TotalVolumeDescriptor, string> = {
  empty: 'vide',
  nearlyEmpty: 'presque vide',
  underHalfFull: 'moins de la moitié plein',
  halfFull: 'à moitié plein',
  overHalfFull: 'plus de la moitié plein',
  nearlyFull: 'presque plein',
  full: 'plein'
};

// Maps SoluteColorDescriptor to a string that describes the color of the solution.
const soluteColorMap: Record<SoluteColorDescriptor, string> = {
  brightYellow: 'jaune vif',
  red: 'rouge',
  darkYellow: 'jaune foncé',
  brown: 'marron',
  lavender: 'lavande',
  white: 'blanc',
  orange: 'orange',
  limeGreen: 'vert citron',
  colorless: 'incolore',
  salmon: 'saumon'
};

const PHScaleDescriptionStringsFR = {

  //***********************************************************************************
  // Screen Summary State Descriptions
  //***********************************************************************************
  screenSummaryOverview(): string { return 'La zone de jeu contient un bécher vidangeable, un compte-gouttes à solution, un robinet d\'eau et une sonde de pH mobile. Le robinet d\'eau et le compte-gouttes se trouvent au-dessus du bécher. Le compte-gouttes distribue un certain nombre de liquides du quotidien, un à la fois.'; },
  screenSummaryControlArea(): string { return 'La zone de contrôle dispose d\'un bouton pour réinitialiser la simulation.'; },
  screenSummaryInteractionHint(): string { return 'Ajoutez de la solution dans le bécher et jouez.'; },

  //***********************************************************************************
  // Beaker Information
  //***********************************************************************************
  beakerHeading(): string { return 'Solution dans le bécher'; },

  //***********************************************************************************
  // Solution Information
  //***********************************************************************************
  // The selected solution.
  solutionParagraph( solute: SoluteDescriptor ): string { return `${soluteMap[ solute ]}`; },

  // Described when the solution is neutral.
  solutionIsNeutral(): string { return 'est neutre'; },

  // Described when the solution has solute with no added water, or the solute is colorless.
  solutionAddedVolumeDescription( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeEnum: WaterVolumeDescriptor ): string {
    return `est ${soluteColorMap[ colorDescriptor ]} avec ${addedWaterVolumeMap[ addedWaterVolumeEnum ]} eau ajoutée`;
  },

  // Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeEnum: WaterVolumeDescriptor ): string {
    return `est d\'une couleur ${soluteColorMap[ colorDescriptor ]} plus claire avec ${addedWaterVolumeMap[ addedWaterVolumeEnum ]} eau ajoutée`;
  },

  // Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeEnum: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} litres, ${totalVolumeMap[ totalVolumeEnum ]}`;
  }
};

export default PHScaleDescriptionStringsFR;
