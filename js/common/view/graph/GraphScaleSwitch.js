// Copyright 2020, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between logarithmic and linear scales.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const linearString = require( 'string!PH_SCALE/linear' );
  const logarithmicString = require( 'string!PH_SCALE/logarithmic' );

  class GraphScaleSwitch extends ABSwitch {

    /**
     * @param {EnumerationProperty.<GraphScale>} graphScaleProperty
     * @param {Object} [options]
     */
    constructor( graphScaleProperty, options ) {

      options = merge( {
        size: new Dimension2( 50, 25 ),
        centerOnButton: true,

        // phet-io
        tandem: Tandem.REQUIRED,
        phetioDocumentation: 'A/B switch for switching between logarithmic and linear scales'
      }, options );

      const textOptions = {
        font: PHScaleConstants.AB_SWITCH_FONT,
        maxWidth: 125
      };

      const logarithmicText = new Text( logarithmicString, textOptions );
      const linearText = new Text( linearString, textOptions );

      super( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicText, GraphScale.LINEAR, linearText, options );
    }
  }

  return phScale.register( 'GraphScaleSwitch', GraphScaleSwitch );
} );