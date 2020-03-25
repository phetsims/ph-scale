// Copyright 2020, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between Concentration and Quantity units for the graphs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import ABSwitch from '../../../../../sun/js/ABSwitch.js';
import phScaleStrings from '../../../ph-scale-strings.js';
import phScale from '../../../phScale.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphUnits from './GraphUnits.js';

const concentrationString = phScaleStrings.concentration;
const quantityString = phScaleStrings.quantity;
const unitsMolesPerLiterString = phScaleStrings.units.molesPerLiter;
const unitsMolesString = phScaleStrings.units.moles;

class GraphUnitsSwitch extends ABSwitch {

  /**
   * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
   * @param {Object} [options]
   */
  constructor( graphUnitsProperty, options ) {

    options = merge( {
      toggleSwitchOptions: { size: new Dimension2( 50, 25 ) },
      centerOnButton: true,

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
      maxWidth: 90,
      tandem: options.tandem.createTandem( 'quantityLabel' )
    } );

    super( graphUnitsProperty, GraphUnits.MOLES_PER_LITER, concentrationLabel, GraphUnits.MOLES, quantityLabel, options );
  }
}

phScale.register( 'GraphUnitsSwitch', GraphUnitsSwitch );
export default GraphUnitsSwitch;