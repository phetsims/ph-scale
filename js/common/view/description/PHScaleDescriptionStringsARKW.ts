// Copyright 2024, University of Colorado Boulder

/* eslint-disable phet/author-annotation */

import { FlowRateDescriptor } from '../FlowDescriber.js';
import { PHValueDescriptor, SoluteColorDescriptor, SoluteDescriptor, TotalVolumeDescriptor, WaterVolumeDescriptor } from '../SolutionDescriber.js';

// Maps the SoluteDescriptor to a string that describes the name of the solution.
const soluteMap: Record<SoluteDescriptor, string> = {
  batteryAcid: 'حمض البطارية',
  blood: 'الدم',
  chickenSoup: 'شوربة الدجاج',
  coffee: 'القهوة',
  drainCleaner: 'منظف البالوعة',
  handSoap: 'صابون اليد',
  milk: 'الحليب',
  orangeJuice: 'عصير البرتقال',
  sodaPop: 'المشروب الغازي',
  spit: 'اللعاب',
  vomit: 'القيء',
  water: 'الماء'
};

// Maps the WaterVolumeDescriptor to a string that describes the volume of water added to the solution.
const addedWaterVolumeMap: Record<WaterVolumeDescriptor, string> = {
  no: 'بدون',
  aTinyBitOf: 'قليل جداً من',
  aLittle: 'قليل من',
  some: 'بعض من',
  equalAmountsOf: 'كميات متساوية من',
  aFairAmountOf: 'كمية معقولة من',
  lotsOf: 'كثير من',
  mostly: 'الغالب'
};

// Maps the TotalVolumeDescriptor to a string that describes the total volume of the solution.
const totalVolumeMap: Record<TotalVolumeDescriptor, string> = {
  empty: 'فارغ',
  nearlyEmpty: 'قريب من الفارغ',
  underHalfFull: 'أقل من نصف ممتلئ',
  halfFull: 'نصف ممتلئ',
  overHalfFull: 'أكثر من نصف ممتلئ',
  nearlyFull: 'قريب من ممتلئ',
  full: 'ممتلئ'
};

// Maps SoluteColorDescriptor to a string that describes the color of the solution.
const soluteColorMap: Record<SoluteColorDescriptor, string> = {
  brightYellow: 'أصفر ساطع',
  red: 'أحمر',
  darkYellow: 'أصفر غامق',
  brown: 'بني',
  lavender: 'بنفسجي',
  white: 'أبيض',
  orange: 'برتقالي',
  limeGreen: 'أخضر ليموني',
  colorless: 'عديم اللون',
  salmon: 'سلموني'
};

// Solutions/Solutes
const phValueMap = {
  none: 'غير موجود في الكأس',
  extremelyAcidic: 'حمضي للغاية',
  highlyAcidic: 'حمضي جدًا',
  moderatelyAcidic: 'حمضي معتدل',
  slightlyAcidic: 'حمضي قليلاً',
  neutral: 'متعادل',
  slightlyBasic: 'قلوي قليلاً',
  moderatelyBasic: 'قلوي معتدل',
  highlyBasic: 'قلوي جدًا',
  extremelyBasic: 'قلوي للغاية'
};

const flowRateMap = {
  closed: 'مغلق',
  openATinyBit: 'مفتوح قليلاً جداً',
  openALittle: 'مفتوح قليلاً',
  somewhatOpen: 'مفتوح جزئياً',
  halfwayOpen: 'نصف مفتوح',
  openALot: 'مفتوح كثيراً',
  fullyOpen: 'مفتوح بالكامل'
};

// const probeLocationMap = {
//   homePosition: 'outside beaker, near pH meter',
//   atBottom: 'at bottom of beaker',
//   underDropper: 'just under dropper',
//   underWaterFaucet: 'under water faucet',
//   underDrain: 'under drain',
//   otherLocationNotInSolution: 'not in solution'
// };

const PHScaleDescriptionStringsARKW = {

//***********************************************************************************
// Screen Summary State Descriptions
//***********************************************************************************
  screenSummaryOverview(): string { return 'تحتوي منطقة اللعب على كأس يمكن تصريفه، قطارة محلول، صنبور مياه، ومجس درجة الحموضة يمكن تحريكه. الصنبور وقطارة المحلول فوق الكأس. القطارة تصرف مجموعة من السوائل اليومية واحدة تلو الأخرى.'; },
  screenSummaryControlArea(): string { return 'تحتوي منطقة التحكم على زر لإعادة ضبط المحاكاة.'; },
  screenSummaryInteractionHint(): string { return 'أضف محلولًا إلى الكأس والعب.'; },

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
      return `حاليًا، الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
    }
    else if ( soluteDescriptor === 'water' ) {

      // There is only water in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `حاليًا، الكأس يحتوي على ${solutionTotalVolume} لتر من ${soluteMap[ soluteDescriptor ]} وهو ${totalVolumeMap[ totalVolumeDescriptor ]}.`;
      }
      else {

        // The meter is measuring a value.
        return `حاليًا، الكأس يحتوي على ${solutionTotalVolume} لتر من ${soluteMap[ soluteDescriptor ]} وهو ${totalVolumeMap[ totalVolumeDescriptor ]}. ${soluteMap[ soluteDescriptor ]} لديه درجة حموضة تساوي ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}.`;
      }
    }
    else if ( addedWaterVolumeDescriptor === 'equalAmountsOf' ) {

      // There are equal amounts of water and solute in the beaker.
      if ( meterPH === null ) {

        // The meter is not measuring any value.
        return `حاليًا، لون محلول ${soluteMap[ soluteDescriptor ]} هو ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} والماء المضاف. الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]} مع ${solutionTotalVolume} لتر.`;
      }
      else {

        // The meter is measuring a value.
        return `حاليًا، محلول ${soluteMap[ soluteDescriptor ]} لديه درجة حموضة تساوي ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}. لون المحلول هو ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ${soluteMap[ soluteDescriptor ]} والماء المضاف. الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]} مع ${solutionTotalVolume} لتر.`;
      }
    }
    else if ( meterPH === null ) {

      // There is a solute in the beaker and it is not an equal amount of water.
      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        // In this case, there is some amount of water and solute (other than equal)
        return `حاليًا، لون محلول ${soluteMap[ soluteDescriptor ]} هو ${soluteColorMap[ soluteColorDescriptor ]} ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} ماء مضاف. الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]} مع ${solutionTotalVolume} لتر.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `حاليًا، لون محلول ${soluteMap[ soluteDescriptor ]} هو ${soluteColorMap[ soluteColorDescriptor ]} أفتح مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} الماء المضاف. الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]} مع ${solutionTotalVolume} لتر.`;
      }
    }
    else {

      if ( addedWaterVolumeDescriptor === 'no' || soluteColorDescriptor === 'colorless' ) {

        // There is no water or the solute has no color, describe the color of the solution
        return `حاليًا، محلول ${soluteMap[ soluteDescriptor ]} لديه درجة حموضة تساوي ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}. لون المحلول هو ${soluteColorMap[ soluteColorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} الماء المضاف. الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]} مع ${solutionTotalVolume} لتر.`;
      }
      else {

        // There is water and solute, and the solute has a color - describe that it is of a lighter color.
        return `حاليًا، محلول ${soluteMap[ soluteDescriptor ]} لديه درجة حموضة تساوي ${solutionPH} وهو ${phValueMap[ solutionPHDescriptor ]}. لون المحلول هو ${soluteColorMap[ soluteColorDescriptor ]} أفتح مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} الماء المضاف. الكأس هو ${totalVolumeMap[ totalVolumeDescriptor ]} مع ${solutionTotalVolume} لتر.`;
      }
    }
  },

//***********************************************************************************
// Beaker Information
//***********************************************************************************
  beakerHeading(): string { return 'المحلول في الكأس'; },

//***********************************************************************************
// Solution Information
//***********************************************************************************
// The selected solution.
  solutionParagraph( solute: SoluteDescriptor ): string { return `${soluteMap[ solute ]}`; },

// Described when the solution is neutral.
  solutionIsNeutral(): string { return 'محايد'; },

// Described when the solution has solute with no added water, or the solute is colorless.
  solutionAddedVolumeDescription( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `هو ${soluteColorMap[ colorDescriptor ]} مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} الماء المضاف`;
  },

// Described when the solute has color and some added water.
  solutionAddedVolumeDescriptionWithWater( colorDescriptor: SoluteColorDescriptor, addedWaterVolumeDescriptor: WaterVolumeDescriptor ): string {
    return `هو ${soluteColorMap[ colorDescriptor ]} أفتح مع ${addedWaterVolumeMap[ addedWaterVolumeDescriptor ]} الماء المضاف`;
  },

// Describes the total volume of the solution.
  solutionTotalVolumeDescription( totalVolumeDescriptor: TotalVolumeDescriptor, solutionTotalVolume: string ): string {
    return `${solutionTotalVolume} لتر, ${totalVolumeMap[ totalVolumeDescriptor ]}`;
  },

//***********************************************************************************
// pH Meter Information
//***********************************************************************************
  phMeterHeading(): string {
    return 'جهاز قياس درجة حموضة';
  },
  measuredPHDescription( meterPH: number | null ): string {
    return `لديه درجة حموضة تساوي ${meterPH}`;
  },
  qualitativePHDescription( phDescriptor: PHValueDescriptor ): string {
    return `هو ${phValueMap[ phDescriptor ]}`;
  },
  meterDescription(): string {
    return '(عنصر نائب لوصف الجهاز)';
  },
  probeLocation(): string {
    return '(عنصر نائب لموقع المجس)';
  },
  phMeterProbeAccessibleName(): string { return 'مجس pH'; },
  phMeterProbeHelpText(): string {
    return 'Move probe with Arrow keys or other keyboard shortcuts.';
  },
  // Move or jump probe with keyboard shortcuts.
  // Move probe with keyboard shortcuts.

  phMeterProbeGrabAccessibleName(): string { return 'أمسك مجس درجة الحموضة'; },
  phMeterProbeGrabDragHelpText(): string { return 'ابحث عن مجس درجة الحموضة للعب. بمجرد الإمساك به، استخدم اختصارات لوحة المفاتيح لتحريك المجس. اضغط المسافة للإفلات.'; },

//***********************************************************************************
// Solution and pH Meter Information
//***********************************************************************************
  solutionControls(): string {
    return 'ضوابط المحلول وجهاز قياس pH';
  },
  soluteComboBoxAccessibleName(): string {
    return 'محلول';
  },
  soluteName( solute: SoluteDescriptor ): string {
    return soluteMap[ solute ];
  },
  soluteComboBoxHelpText(): string { return 'اختر سائلًا يوميًا للقطارة.'; },
  dropperAccessibleName(): string { return 'قطارة'; },
  dropperDispensingAlert( isDispensing: boolean ): string {
    return isDispensing ? 'يتم التوزيع.' : 'لا يتم التوزيع.';
  },
  waterFaucetAccessibleName(): string { return 'صنبور ماء'; },
  waterFaucetHelpText(): string { return 'أضف الماء إلى المحلول في الكأس.'; },
  drainFaucetAccessibleName(): string { return 'مصفاة'; },
  drainFaucetHelpText(): string { return 'افتح لتصريف المحلول من الكأس.'; },
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
    return 'الماء يتدفق.';
  },
  faucetOffContextResponse(): string {
    return 'تم فصل الماء.';
  },

  liquidChangingAlert(
    goingUp: boolean, // Is the water level going up? True or false.
    totalVolumeValue: string // The total volume of the solution.
  ): string {
    return `المستوى ${goingUp ? 'يصعد' : 'ينخفض'}, الآن عند ${totalVolumeValue} لتر.`;
  },
  liquidChangingDoneAlert(
    totalVolumeEnum: TotalVolumeDescriptor
  ): string {
    return `المستوى مستقر، الآن عند ${totalVolumeMap[ totalVolumeEnum ]}.`;
  }
};

export default PHScaleDescriptionStringsARKW;