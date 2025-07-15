// Copyright 2013-2025, University of Colorado Boulder

/**
 * Colors used throughout this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import phScale from '../phScale.js';

const PHScaleColors = {

  screenBackgroundColorProperty: new ProfileColorProperty( phScale, 'screenBackgroundColor', {
    default: 'white'
  } ),
  panelFillProperty: new ProfileColorProperty( phScale, 'panelFill', {
    default: 'rgb( 230, 230, 230 )'
  } ),

  // pH range
  acidicColorProperty: new ProfileColorProperty( phScale, 'acidicColor', {
    default: 'rgb( 238, 79, 73 )'
  } ),
  basicColorProperty: new ProfileColorProperty( phScale, 'basicColorProperty', {
    default: 'rgb( 70, 129, 206 )'
  } ),
  neutralColorProperty: new ProfileColorProperty( phScale, 'neutralColor', {
    default: 'rgb( 255, 255, 255 )'
  } ),

  // background on various features
  h2OBackgroundColorProperty: new ProfileColorProperty( phScale, 'h2OBackgroundColor', {
    default: 'rgb( 20, 184, 238 )'
  } ),

  pHProbeColorProperty: new ProfileColorProperty( phScale, 'pHProbeColor', {
    default: 'rgb( 64, 0, 111 )'
  } ),
  pHProbeWireColorProperty: new ProfileColorProperty( phScale, 'pHProbeWireColor', {
    default: 'rgb( 80, 80, 80 )'
  } ),
  pHMeterDisabledColorProperty: new ProfileColorProperty( phScale, 'pHMeterDisabledColor', {
    default: '#757575'
  } ),

  // water
  WATER: new Color( 224, 255, 255 ),

  // atom colors
  OXYGEN: PhetColorScheme.RED_COLORBLIND,
  HYDROGEN: new Color( 255, 255, 255 ),

  // base colors for particles in 'ratio' view, alpha added later
  H3O_PARTICLES: new Color( 204, 0, 0 ),
  OH_PARTICLES: new Color( 0, 0, 255 )
};

phScale.register( 'PHScaleColors', PHScaleColors );
export default PHScaleColors;