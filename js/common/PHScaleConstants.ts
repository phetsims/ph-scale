// Copyright 2013-2025, University of Colorado Boulder

/**
 * Constants used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import { toFixed } from '../../../dot/js/util/toFixed.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import phScale from '../phScale.js';
import PhScaleStrings from '../PhScaleStrings.js';

const PHScaleConstants = {

  // ScreenView
  SCREEN_VIEW_OPTIONS: {

    // While these layoutBounds differ from the default, PhET-iO customizations may rely on these bounds.
    // So do not change. See https://github.com/phetsims/ph-scale/issues/255
    layoutBounds: new Bounds2( 0, 0, 1100, 700 ),

    // Workaround for things shifting around while dragging
    // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/ph-scale/issues/226
    preventFit: true
  },

  // Credits, shared by ph-scale and ph-scale-basics
  CREDITS: {
    leadDesign:
      'Yuen-ying Carpenter, Archie Paulson',
    softwareDevelopment:
      'Chris Malley (PixelZoom, Inc.), Marla Schulz',
    team:
      'Wendy Adams, Jack Barbera, Julia Chamberlain, Laurie Langdon, Trish Loeblein, Diana Lopez, Emily B. Moore, ' +
      'Ariel Paul, Katherine Perkins, Amy Rouinfar, Nancy Salpepi, Taliesin Smith',
    graphicArts:
      'Sharon Siman-Tov',
    qualityAssurance:
      'Jaspe Arias, Logan Bray, Steele Dalton, Jaron Droder, Bryce Griebenow, Clifford Hardin, Brooklyn Lash, Emily Miller, ' +
      'Matthew Moore, Elise Morgan, Liam Mulhall, Oliver Orejola, Valentina Pérez, Devon Quispe, Benjamin Roberts, Jacob Romero, ' +
      'Ethan Ward, Kathryn Woessner, Bryan Yoelin',
    thanks:
      'Conversion of this simulation to HTML5 was funded in part by the Royal Society of Chemistry.'
  },

  // beaker
  BEAKER_VOLUME: 1.2, // L
  BEAKER_POSITION: new Vector2( 750, 580 ),
  BEAKER_SIZE: new Dimension2( 450, 300 ),
  CHECKBOX_WIDTH: 21,

  // pH
  PH_RANGE: new RangeWithValue( -1, 15, 7 ),
  PH_METER_DECIMAL_PLACES: 2,

  // Create a string property that formats pH values to a fixed number of decimal places or returns a string for null pH values.
  CREATE_PH_VALUE_FIXED_PROPERTY: ( pHProperty: TReadOnlyProperty<number | null> ): TReadOnlyProperty<number | string> =>
    new DerivedStringProperty( [ pHProperty, PhScaleStrings.a11y.unknownStringProperty ],
      ( pH, unknownString ) => ( pH === null ) ? unknownString : toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ) ),

  // volume
  VOLUME_DECIMAL_PLACES: 2,
  MIN_SOLUTION_VOLUME: 0.015,  // L, minimum non-zero volume for solution, so it's visible and measurable

  // logarithmic graph
  LOGARITHMIC_EXPONENT_RANGE: new Range( -16, 2 ),
  LOGARITHMIC_MANTISSA_DECIMAL_PLACES: 1,
  LINEAR_EXPONENT_RANGE: new Range( -14, 1 ),
  LINEAR_MANTISSA_RANGE: new Range( 0, 8 ),

  // expand/collapse buttons
  EXPAND_COLLAPSE_BUTTON_OPTIONS: {
    sideLength: 30,
    touchAreaXDilation: 10,
    touchAreaYDilation: 10
  },

  // faucets
  FAUCET_OPTIONS: {
    tapToDispenseAmount: 0.05, // L
    tapToDispenseInterval: 333, // ms
    shooterOptions: {
      touchAreaXDilation: 37,
      touchAreaYDilation: 60
    }
  },

  // formulas, no i18n required
  H3O_FORMULA: 'H<sub>3</sub>O<sup>+</sup>',
  OH_FORMULA: 'OH<sup>-</sup>',
  H2O_FORMULA: 'H<sub>2</sub>O',

  // fonts
  AB_SWITCH_FONT: new PhetFont( { size: 18, weight: 'bold' } )
};

phScale.register( 'PHScaleConstants', PHScaleConstants );
export default PHScaleConstants;