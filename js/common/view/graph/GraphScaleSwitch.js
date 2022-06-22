// Copyright 2020-2022, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between logarithmic and linear scales.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import { Text } from '../../../../../scenery/js/imports.js';
import ABSwitch from '../../../../../sun/js/ABSwitch.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import phScaleStrings from '../../../phScaleStrings.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphScale from './GraphScale.js';

class GraphScaleSwitch extends ABSwitch {

  /**
   * @param {EnumerationDeprecatedProperty.<GraphScale>} graphScaleProperty
   * @param {Object} [options]
   */
  constructor( graphScaleProperty, options ) {

    options = merge( {
      toggleSwitchOptions: { size: new Dimension2( 50, 25 ) },
      centerOnSwitch: true,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'A/B switch for switching between logarithmic and linear scales'
    }, options );

    const textOptions = {
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 125
    };

    // Logarithmic label
    const logarithmicText = new Text( phScaleStrings.logarithmic, merge( {
      tandem: options.tandem.createTandem( 'logarithmicText' )
    }, textOptions ) );

    // Linear label
    const linearText = new Text( phScaleStrings.linear, merge( {
      tandem: options.tandem.createTandem( 'linearText' )
    }, textOptions ) );

    super( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicText, GraphScale.LINEAR, linearText, options );
  }
}

phScale.register( 'GraphScaleSwitch', GraphScaleSwitch );
export default GraphScaleSwitch;