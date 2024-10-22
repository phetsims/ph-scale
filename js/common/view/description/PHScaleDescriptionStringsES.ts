// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { FlowRateDescriptor } from '../FlowDescriber.js';
import { PHValueDescriptor, SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

// Maps the SoluteDescriptor to a string that describes the name of the solution.
const soluteMap: Record<SoluteDescriptor, string> = {
  batteryAcid: 'Ácido de Batería',
  blood: 'Sangre',
  chickenSoup: 'Sopa de Pollo',
  coffee: 'Café',
  drainCleaner: 'Limpiador de Drenaje',
  handSoap: 'Jabón de Manos',
  milk: 'Leche',
  orangeJuice: 'Jugo de Naranja',
  sodaPop: 'Gaseosa',
  spit: 'Saliva',
  vomit: 'Vómito',
  water: 'Agua'
};

// Maps the WaterVolumeDescriptor to a string that describes the volume of water added to the solution.
const addedWaterVolumeMap: Record<WaterVolumeDescriptor, string> = {
  no: 'sin',
  aTinyBitOf: 'un poquito de',
  aLittle: 'un poco de',
  some: 'algo de',
  equalAmountsOf: 'cantidades iguales de',
  aFairAmountOf: 'una cantidad considerable de',
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

// Solutions/Solutes
const phValueMap = {
  none: 'no en el vaso',
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
  somewhatOpen: 'algo abierto',
  halfwayOpen: 'medio abierto',
  openALot: 'muy abierto',
  fullyOpen: 'totalmente abierto'
};

const PHScaleDescriptionStringsES = {

//***********************************************************************************
// Screen Summary State Descriptions
//***********************************************************************************
  screenSummaryOverview(): string { return 'El Área de Juego contiene un vaso que se puede drenar, un gotero de solución, un grifo de agua y una sonda de pH móvil. El gotero y el grifo de agua están sobre el vaso. El gotero dispensa una serie de líquidos cotidianos uno a la vez.'; },
  screenSummaryControlArea(): string { return 'El Área de Control tiene un botón para reiniciar la simulación.'; },
  screenSummaryInteractionHint(): string { return 'Agregue solución al vaso y juegue.'; },

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
        return `Actualmente, el vaso contiene ${solutionTotalVolume} litros de ${soluteMap[ soluteDescriptor ]} y está ${totalVolumeMap[ totalVolumeDescriptor ]}. ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}.`;
      }
    }
    else if ( addedWaterVolumeDescriptor === 'equalAmountsOf' ) {

      // There are equal amounts of water and solute in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} y agua añadida. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
      else {

        // The meter is measuring a value.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}. La solución es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} y agua añadida. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
    }
    else if ( meterPH === null ) {

      // There is a solute in the beaker and it is not an equal amount of water.
      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        // In this case, there is some amount of water and solute (other than equal)
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua añadida. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} es ${soluteColorMap[ soluteColorDescriptor ]} más clara con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua añadida. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
    }
    else {

      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}. La solución es ${soluteColorMap[ soluteColorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua añadida. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `Actualmente, la solución de ${soluteMap[ soluteDescriptor ]} tiene un pH de ${solutionPH} y es ${phValueMap[ solutionPHDescriptor ]}. La solución es ${soluteColorMap[ soluteColorDescriptor ]} más clara con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua añadida. El vaso está ${totalVolumeMap[ totalVolumeDescriptor ]} con ${solutionTotalVolume} litros.`;
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
    return `es ${soluteColorMap[ colorDescriptor ]} con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua añadida`;
  },

// Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `es ${soluteColorMap[ colorDescriptor ]} más clara con ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} agua añadida`;
  },

// Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeDescriptor: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} litros, ${totalVolumeMap[ totalVolumeDescriptor ]}`;
  },

//***********************************************************************************
// pH Meter Information
//***********************************************************************************
  phMeterHeading(): string {
    return 'Medidor de pH y Lectura';
  },
  measuredPHDescription( meterPH: number | null ): string {
    return `tiene un pH de ${meterPH}`;
  },
  qualitativePHDescription( phDescriptor: PHValueDescriptor ): string {
    return `es ${phValueMap[ phDescriptor ]}`;
  },
  meterDescription(): string {
    return '(marcador para la descripción del medidor)';
  },
  probeLocation(): string {
    return '(marcador para la ubicación de la sonda)';
  },
  phMeterProbeAccessibleName(): string { return 'Sonda de pH'; },
  phMeterProbeGrabAccessibleName(): string { return 'Agarrar Sonda de pH'; },
  phMeterProbeHelpText(): string { return 'Busque la sonda de pH para jugar. Una vez agarrada, use atajos de teclado para mover la sonda. Espacio para soltar.'; },

//***********************************************************************************
// Solution and pH Meter Information
//***********************************************************************************
  solutionControls(): string {
    return 'Controles de Solución y Medidor de pH';
  },
  soluteComboBoxAccessibleName(): string {
    return 'Solución';
  },
  soluteName( solute: SoluteDescriptor ): string {
    return soluteMap[ solute ];
  },
  soluteComboBoxHelpText(): string { return 'Elija un líquido cotidiano para el gotero.'; },
  dropperAccessibleName(): string { return 'Gotero'; },
  dropperDispensingAlert( isDispensing: boolean ): string {
    return isDispensing ? 'Dispensando.' : 'No dispensando.';
  },
  waterFaucetAccessibleName(): string { return 'Grifo de Agua'; },
  waterFaucetHelpText(): string { return 'Agregue agua a la solución en el vaso.'; },
  drainFaucetAccessibleName(): string { return 'Desagüe'; },
  drainFaucetHelpText(): string { return 'Abra para drenar la solución del vaso.'; },
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
    return 'El agua está fluyendo.';
  },
  faucetOffContextResponse(): string {
    return 'El agua está cerrada.';
  },

  liquidChangingAlert(
    goingUp: boolean, // Is the water level going up? True or false.
    totalVolumeValue: string // The total volume of the solution.
  ): string {
    return `El nivel subiendo ${goingUp ? 'subiendo' : 'bajando'}, ahora en ${totalVolumeValue} litros.`;
  },
  liquidChangingDoneAlert(
    totalVolumeEnum: TotalVolumeDescriptor
  ): string {
    return `El nivel estable, ahora en ${totalVolumeMap[ totalVolumeEnum ]}.`;
  }
};

export default PHScaleDescriptionStringsES;