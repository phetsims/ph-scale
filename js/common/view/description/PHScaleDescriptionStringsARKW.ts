// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { FlowRateDescriptor } from '../FlowDescriber.js';
import { PHValueDescriptor, SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

// Maps the SoluteDescriptor to a string that describes the name of the solution.
const soluteMap: Record<SoluteDescriptor, string> = {
  batteryAcid: 'حامض البطارية',
  blood: 'دم',
  chickenSoup: 'حساء دجاج',
  coffee: 'قهوة',
  drainCleaner: 'منظف مصرف',
  handSoap: 'صابون يدوي',
  milk: 'حليب',
  orangeJuice: 'عصير برتقال',
  sodaPop: 'مشروب غازي',
  spit: 'بصق',
  vomit: 'قيء',
  water: 'ماء'
};

// Maps the WaterVolumeDescriptor to a string that describes the volume of water added to the solution.
const addedWaterVolumeMap: Record<WaterVolumeDescriptor, string> = {
  no: 'لا',
  aTinyBitOf: 'قليل جدًا من',
  aLittle: 'قليل من',
  some: 'بعض',
  equalAmountsOf: 'كميات متساوية من',
  aFairAmountOf: 'كمية مناسبة من',
  lotsOf: 'الكثير من',
  mostly: 'أغلبها'
};

// Maps the TotalVolumeDescriptor to a string that describes the total volume of the solution.
const totalVolumeMap: Record<TotalVolumeDescriptor, string> = {
  empty: 'فارغ',
  nearlyEmpty: 'قريب من الفارغ',
  underHalfFull: 'أقل من النصف ممتلئ',
  halfFull: 'نصف ممتلئ',
  overHalfFull: 'أكثر من النصف ممتلئ',
  nearlyFull: 'قريب من الممتلئ',
  full: 'ممتلئ'
};

// Maps SoluteColorDescriptor to a string that describes the color of the solution.
const soluteColorMap: Record<SoluteColorDescriptor, string> = {
  brightYellow: 'أصفر لامع',
  red: 'أحمر',
  darkYellow: 'أصفر داكن',
  brown: 'بني',
  lavender: 'لافندر',
  white: 'أبيض',
  orange: 'برتقالي',
  limeGreen: 'أخضر ليموني',
  colorless: 'شفاف',
  salmon: 'سلمون'
};

// Solutions/Solutes
const phValueMap = {
  none: 'المسبار ليس في الدورق',
  extremelyAcidic: 'حمضي للغاية',
  highlyAcidic: 'حمضي بشدة',
  moderatelyAcidic: 'حمضي بشكل معتدل',
  slightlyAcidic: 'حمضي قليلًا',
  neutral: 'محايد',
  slightlyBasic: 'قاعدي قليلًا',
  moderatelyBasic: 'قاعدي بشكل معتدل',
  highlyBasic: 'قاعدي بشدة',
  extremelyBasic: 'قاعدي للغاية'
};

const flowRateMap = {
  closed: 'مغلق',
  openATinyBit: 'مفتوح قليلا',
  openALittle: 'مفتوح قليلاً',
  somewhatOpen: 'مفتوح نسبيا',
  halfwayOpen: 'مفتوح لنصفه',
  openALot: 'مفتوح كثيرا',
  fullyOpen: 'مفتوح بالكامل'
};

const PHScaleDescriptionStringsARWK = {

  //***********************************************************************************
  // Screen Summary State Descriptions
  //***********************************************************************************
  screenSummaryOverview(): string { return 'تحتوي منطقة اللعب على دورق قابل للتصريف، قطارة محلول، صنبور ماء، ومسبار pH متحرك. يجلس صنبور المياه وقطارة المحلول فوق الدورق. تقوم القطارة بتوزيع مجموعة من السوائل اليومية واحدة تلو الأخرى.'; },
  screenSummaryControlArea(): string { return 'تحتوي منطقة التحكم على زر لإعادة ضبط المحاكاة.'; },
  screenSummaryInteractionHint(): string { return 'أضف محلولًا إلى الدورق والعب.'; },

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
      return `حاليًا، الدورق ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
    }
    else if ( soluteDescriptor === 'water' ) {
      // There is only water in the beaker.
      if ( meterPH === null ) {
        // The meter is not measuring any value.
        return `حاليًا، الدورق يحتوي على ${solutionTotalVolume} لتر من ${soluteMap[ soluteDescriptor ]} وهو ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
      }
      else {
        // The meter is measuring a value.
        return `حاليًا، الدورق يحتوي على ${solutionTotalVolume} لتر من ${soluteMap[ soluteDescriptor ]} وهو ${totalVolumeMap[ totalVolumeDescriptor ]}. ${soluteMap[ soluteDescriptor ]} لديه pH قدره ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}.`;
      }
    }
    else if ( addedWaterVolumeDescriptor === 'equalAmountsOf' ) {
      // There are equal amounts of water and solute in the beaker.
      if ( meterPH === null ) {
        // The meter is not measuring any value.
        return `حاليًا، محلول ${soluteMap[ soluteDescriptor ]} ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} والماء المضاف. الدورق ${totalVolumeMap[ totalVolumeDescriptor ]} عند ${solutionTotalVolume} لتر.`;
      }
      else {
        // The meter is measuring a value.
        return `حاليًا، محلول ${soluteMap[ soluteDescriptor ]} لديه pH قدره ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}. المحلول ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} والماء المضاف. الدورق ${totalVolumeMap[ totalVolumeDescriptor ]} عند ${solutionTotalVolume} لتر.`;
      }
    }
    else if ( meterPH === null ) {
      // There is a solute in the beaker and it is not an equal amount of water.
      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {
        // There is no water or the solute has no color, describe the color of the solution
        return `حاليًا، المحلول ${soluteMap[ soluteDescriptor ]} ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف. الدورق ${totalVolumeMap[ totalVolumeDescriptor ]} عند ${solutionTotalVolume} لتر.`;
      }
      else {
        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `حاليًا، المحلول ${soluteMap[ soluteDescriptor ]} هو أفتح من ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف. الدورق ${totalVolumeMap[ totalVolumeDescriptor ]} عند ${solutionTotalVolume} لتر.`;
      }
    }
    else {
      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {
        // There is no water or the solute has no color, describe the color of the solution
        return `حاليًا، المحلول ${soluteMap[ soluteDescriptor ]} لديه pH قدره ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}. المحلول ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف. الدورق ${totalVolumeMap[ totalVolumeDescriptor ]} عند ${solutionTotalVolume} لتر.`;
      }
      else {
        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `حاليًا، المحلول ${soluteMap[ soluteDescriptor ]} لديه pH قدره ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}. المحلول هو أفتح من ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف. الدورق ${totalVolumeMap[ totalVolumeDescriptor ]} عند ${solutionTotalVolume} لتر.`;
      }
    }
  },

  //***********************************************************************************
  // Beaker Information
  //***********************************************************************************
  beakerHeading(): string { return 'المحلول في الدورق'; },

  //***********************************************************************************
  // Solution Information
  //***********************************************************************************
  // The selected solution.
  solutionParagraph( solute: SoluteDescriptor ): string { return `${soluteMap[ solute ]}`; },

  // Described when the solution is neutral.
  solutionIsNeutral(): string { return 'محايد'; },

  // Described when the solution has solute with no added water, or the solute is colorless.
  solutionAddedVolumeDescription( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `هو ${soluteColorMap[ colorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف`;
  },

  // Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `هو أفتح من ${soluteColorMap[ colorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف`;
  },

  // Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeDescriptor: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} لتر، ${totalVolumeMap[ totalVolumeDescriptor ]}`;
  },

  //***********************************************************************************
  // pH Meter Information
  //***********************************************************************************
  phMeterHeading(): string {
    return 'عداد pH والقراءة';
  },
  measuredPHDescription( meterPH: number ): string {
    return `pH قدره ${meterPH}`;
  },
  qualitativePHDescription( phDescriptor: PHValueDescriptor ): string {
    return `هو ${phValueMap[ phDescriptor ]}`;
  },
  phMeterProbeAccessibleName(): string { return 'مسبار pH'; },
  phMeterProbeGrabAccessibleName(): string { return 'إمساك مسبار pH'; },
  phMeterProbeHelpText(): string { return 'ابحث عن مسبار pH للعب. بمجرد الإمساك، استخدم اختصارات لوحة المفاتيح لتحريك المسبار. اضغط على الفراغ للإفراج.'; },

  //***********************************************************************************
  // Solution and pH Meter Information
  //***********************************************************************************
  controlsHeading(): string {
    return 'التحكم في المحلول وعداد pH';
  },
  soluteComboBoxAccessibleName(): string {
    return 'المحلول';
  },
  soluteName( solute: SoluteDescriptor ): string {
    return soluteMap[ solute ];
  },
  soluteComboBoxHelpText(): string { return 'اختر سائلًا يوميًا للقطارة.'; },
  dropperAccessibleName(): string { return 'قطارة'; },
  waterFaucetAccessibleName(): string { return 'صنبور الماء'; },
  waterFaucetHelpText(): string { return 'أضف ماء إلى المحلول في الدورق.'; },
  drainFaucetAccessibleName(): string { return 'مصرف'; },
  drainFaucetHelpText(): string { return 'افتح لتصريف المحلول من الدورق.'; },
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
    return 'يتدفق الماء.';
  },
  faucetOffContextResponse() {
    return 'الماء مطفأ.';
  },

  liquidChangingAlert(
    goingUp: boolean, // Is the water level going up? True or false.
    totalVolumeValue: string // The total volume of the solution.
  ) {
    return `المستوى يتحرك ${goingUp ? 'للأعلى' : 'للأسفل'}، الآن عند ${totalVolumeValue} لتر.`;
  },
  liquidChangingDoneAlert(
    totalVolumeEnum: TotalVolumeDescriptor
  ) {
    return `المستوى مستقر، الآن عند ${totalVolumeMap[ totalVolumeEnum ]}.`;
  }
};

export default PHScaleDescriptionStringsARWK;