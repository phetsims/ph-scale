// Copyright 2013-2015, University of Colorado Boulder

/**
 * Colors used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const phScale = require( 'PH_SCALE/phScale' );

  const PHScaleColors = {

    SCREEN_BACKGROUND: 'white',
    PANEL_FILL: 'rgb(230,230,230)',

    // pH range
    ACIDIC: new Color( 249, 106, 102 ),
    BASIC: new Color( 106, 126, 195 ),
    NEUTRAL: new Color( 164, 58, 149 ),

    // atom colors
    OXYGEN: PhetColorScheme.RED_COLORBLIND,
    HYDROGEN: new Color( 255, 255, 255 ),

    // water
    WATER: new Color( 224, 255, 255 ),

    // background on various features
    H2O_BACKGROUND: new Color( 20, 184, 238 ),

    // base colors for molecules in 'ratio' view, alpha added later
    H3O_MOLECULES: new Color( 204, 0, 0 ),
    OH_MOLECULES: new Color( 0, 0, 255 )
  };

  phScale.register( 'PHScaleColors', PHScaleColors );

  return PHScaleColors;
} );
