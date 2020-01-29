// Copyright 2013-2020, University of Colorado Boulder

/**
 * Constants used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Range = require( 'DOT/Range' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  const PHScaleConstants = {

    // ScreenView
    SCREEN_VIEW_OPTIONS: { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) },

    // Credits, shared by ph-scale and ph-scale-basics
    CREDITS: {
      leadDesign: 'Yuen-ying Carpenter',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Julia Chamberlain, Trish Loeblein, Emily B. Moore, Ariel Paul, Katherine Perkins, Amy Rouinfar',
      graphicArts: 'Sharon Siman-Tov',
      qualityAssurance: 'Jaspe Arias, Steele Dalton, Bryce Griebenow, Elise Morgan, Liam Mulhall, Oliver Orejola, ' +
                        'Benjamin Roberts, Ethan Ward, Kathryn Woessner, Bryan Yoelin',
      thanks: 'Conversion of this simulation to HTML5 was funded in part by the Royal Society of Chemistry.'
    },

    // pH
    PH_RANGE: new RangeWithValue( -1, 15, 7 ),
    PH_METER_DECIMAL_PLACES: 2,
    PH_COMBO_BOX_DECIMAL_PLACES: 1,

    // volume
    VOLUME_DECIMAL_PLACES: 2,
    MIN_SOLUTION_VOLUME: 0.015,  // L, minimum non-zero volume for solution, so it's visible and measurable

    // logarithmic graph
    LOGARITHMIC_EXPONENT_RANGE: new Range( -16, 2 ),
    LINEAR_EXPONENT_RANGE: new Range( -14, 1 ),
    LINEAR_MANTISSA_RANGE: new Range( 0, 8 ),

    // expand/collapse buttons
    EXPAND_COLLAPSE_BUTTON_LENGTH: 30,

    // tap-to-dispense feature for faucets
    TAP_TO_DISPENSE_AMOUNT: 0.05, // L
    TAP_TO_DISPENSE_INTERVAL: 333, // ms

    // formulas, no i18n required
    H3O_FORMULA: 'H<sub>3</sub>O<sup>+</sup>',
    OH_FORMULA: 'OH<sup>-</sup>',
    H2O_FORMULA: 'H<sub>2</sub>O'
  };

  return phScale.register( 'PHScaleConstants', PHScaleConstants );
} );
