// Copyright 2020, University of Colorado Boulder

//TODO #92 ABSwitch has structural problems, see https://github.com/phetsims/sun/issues/559
/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  const merge = require( 'PHET_CORE/merge' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  // strings
  const Dimension2 = require( 'DOT/Dimension2' );
  const concentrationString = require( 'string!PH_SCALE/concentration' );
  const quantityString = require( 'string!PH_SCALE/quantity' );
  const unitsMolesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  const unitsMolesString = require( 'string!PH_SCALE/units.moles' );

  class GraphUnitsSwitch extends ABSwitch {

    /**
     * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
     * @param {Object} [options]
     */
    constructor( graphUnitsProperty, options ) {

      options = merge( {
        toggleSwitchOptions: { size: new Dimension2( 50, 25 ) },

        // phet-io
        tandem: options.tandem.createTandem( 'graphUnitsSwitch' ),
        phetioDocumentation: 'A/B switch for switching units'
      }, options );

      const concentrationLabel = new RichText( concentrationString + '<br>(' + unitsMolesPerLiterString + ')', {
        align: 'center',
        font: PHScaleConstants.AB_SWITCH_FONT,
        maxWidth: 125,
        tandem: options.tandem.createTandem( 'concentrationLabel' )
      } );

      const quantityLabel = new RichText( quantityString + '<br>(' + unitsMolesString + ')', {
        align: 'center',
        font: PHScaleConstants.AB_SWITCH_FONT,
        maxWidth: 85,
        tandem: options.tandem.createTandem( 'quantityLabel' )
      } );

      super( graphUnitsProperty, GraphUnits.MOLES_PER_LITER, concentrationLabel, GraphUnits.MOLES, quantityLabel, options );
    }
  }

  return phScale.register( 'GraphUnitsSwitch', GraphUnitsSwitch );
} );