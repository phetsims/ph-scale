// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { FlowRateDescriptor } from '../FlowDescriber.js';
import { PHValueDescriptor, SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

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
  no: 'sin',
  aTinyBitOf: 'un poquito de',
  aLittle: 'un poco',
  some: 'algo de',
  equalAmountsOf: 'cantidades iguales de',
  aFairAmountOf: 'una cantidad razonable de',
  lotsOf: 'mucho',
  mostly: 'principalmente'
};

// Maps the TotalVolumeDescriptor to a string that describes the total volume of the solution.
const totalVolumeMap: Record<TotalVolumeDescriptor, string> = {
  empty: 'vacío',
  nearlyEmpty: 'casi vacío',
  underHalfFull: 'menos de la mitad lleno',
  halfFull: 'mitad lleno',
  overHalfFull: 'más de la mitad lleno',
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

// Solutions/Solutes
const phValueMap = {
  none: 'la sonda no está en el vaso',
  extremelyAcidic: 'extremadamente ácido',
  highlyAcidic: 'muy ácido',
  moderatelyAcidic: 'moderadamente ácido',
  slightlyAcidic: 'ligeramente ácido',
  neutral: 'neutral',
  slightlyBasic: 'ligeramente básico',
  moderatelyBasic: 'moderadamente básico',
  highlyBasic: 'muy básico',
  extremelyBasic: 'extremadamente básico'
};

const flowRateMap = {
  closed: 'cerrado',
  openATinyBit: 'abierto un poquito',
  openALittle: 'abierto un poco',
  somewhatOpen: 'parcialmente abierto',
  halfwayOpen: 'medio abierto',
  openALot: 'abierto bastante',
  fullyOpen: 'completamente abierto'
};

const PHScaleDescriptionStringsES = {

  //***********************************************************************************
  // Screen Summary State Descriptions
  //***********************************************************************************
  screenSummaryOverview(): string { return 'El área de juego contiene un vaso drenable, un gotero de solución, un grifo de agua y una sonda de pH móvil. El grifo de agua y el gotero están sobre el vaso. El gotero dispensa una serie de líquidos cotidianos uno a la vez.'; },
  screenSummaryControlArea(): string { return 'El área de control tiene un botón para reiniciar la simulación.'; },
  screenSummaryInteractionHint(): string { return 'Agrega solución al vaso y juega.'; },

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
      return `Actualmente, el vaso está ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
    }
    else if ( soluteDescriptor === 'water' ) {

      // There is only water in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `Actualmente, el vaso contiene ${solutionTotalVolume} litros de ${soluteMap[ soluteDescriptor ]} y está ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
      }
      else {

        // The meter is measuring a value.
        return `Actualmente, el vaso contiene ${solutionTotalVolume} litros de ${soluteMap[ soluteDescriptor ]} y está ${totalVolumeMap[ totalVolumeDescriptor ]}. El ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}.`;
      }
    }
    else if ( addedWaterVolumeDescriptor === 'equalAmountsOf' ) {

      // There are equal amounts of water and solute in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} y agua agregada. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
      else {

        // The meter is measuring a value.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}. La solución es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} y agua agregada. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
    }
    else if ( meterPH === null ) {

      // There is a solute in the beaker and it is not an equal amount of water.
      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua agregada. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} es ${soluteColorMap[ soluteColorDescriptor ]} más clara con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua agregada. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
    }
    else {

      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}. La solución es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua agregada. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}. La solución es ${soluteColorMap[ soluteColorDescriptor ]} más clara con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua agregada. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
    }
  },

  //***********************************************************************************
  // Beaker Information
  //***********************************************************************************
  beakerHeading(): string { return 'Solución en el Vaso'; },

  //***********************************************************************************
  // Solution Information
  //***********************************************************************************
  // The selected solution.
  solutionParagraph( solute: SoluteDescriptor ): string { return `${soluteMap[ solute ]}`; },

  // Described when the solution is neutral.
  solutionIsNeutral(): string { return 'es neutral'; },

  // Described when the solution has solute with no added water, or the solute is colorless.
  solutionAddedVolumeDescription( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `es ${soluteColorMap[ colorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua agregada`;
  },

  // Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `es ${soluteColorMap[ colorDescriptor ]} más clara con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua agregada`;
  },

  // Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeDescriptor: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} litros, ${totalVolumeMap[ totalVolumeDescriptor ]}`;
  },

  //***********************************************************************************
  // pH Meter Information
  //***********************************************************************************
  phMeterHeading(): string {
    return 'Medidor de pH y Visualización';
  },
  measuredPHDescription( meterPH: number ): string {
    return `tiene un pH de ${meterPH}`;
  },
  qualitativePHDescription( phDescriptor: PHValueDescriptor ): string {
    return `es ${phValueMap[ phDescriptor ]}`;
  },
  phMeterProbeAccessibleName(): string { return 'Sonda de pH'; },
  phMeterProbeGrabAccessibleName(): string { return 'Agarrar Sonda de pH'; },
  phMeterProbeHelpText(): string { return 'Busca la sonda de pH para jugar. Una vez agarrada, utiliza atajos de teclado para mover la sonda. Presiona espacio para soltar.'; },

  //***********************************************************************************
  // Solution and pH Meter Information
  //***********************************************************************************
  controlsHeading(): string {
    return 'Controles de Solución y Medidor de pH';
  },
  soluteComboBoxAccessibleName(): string {
    return 'Solución';
  },
  soluteName( solute: SoluteDescriptor ): string {
    return soluteMap[ solute ];
  },
  soluteComboBoxHelpText(): string { return 'Elige un líquido cotidiano para el gotero.'; },
  dropperAccessibleName(): string { return 'Gotero'; },
  waterFaucetAccessibleName(): string { return 'Grifo de Agua'; },
  waterFaucetHelpText(): string { return 'Agrega agua a la solución en el vaso.'; },
  drainFaucetAccessibleName(): string { return 'Drenar'; },
  drainFaucetHelpText(): string { return 'Abre para drenar la solución del vaso.'; },
  faucetAriaValueText(
    flowRateDescriptor: FlowRateDescriptor
  ): string {
    // E.g. on focus: Water Faucet, closed
    return `${flowRateMap[ flowRateDescriptor ]}`;
  },

  //***********************************************************************************
  // Context responses about water flow.
  //***********************************************************************************
  faucetOnContextResponse() {
    return 'El agua está fluyendo.';
  },
  faucetOffContextResponse() {
    return 'El agua está cerrada.';
  },

  liquidChangingAlert(
    goingUp: boolean, // Is the water level going up? True or false.
    totalVolumeValue: string // The total volume of the solution.
  ) {
    return `Nivel subiendo ${goingUp ? 'arriba' : 'abajo'}, ahora en ${totalVolumeValue} litros.`;
  },
  liquidChangingDoneAlert(
    totalVolumeEnum: TotalVolumeDescriptor
  ) {
    return `Nivel estable, ahora en ${totalVolumeMap[ totalVolumeEnum ]}.`;
  }
};

export default PHScaleDescriptionStringsES;