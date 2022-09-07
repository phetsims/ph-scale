// Copyright 2020-2022, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between Concentration and Quantity units for the graphs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { NodeTranslationOptions, RichText } from '../../../../../scenery/js/imports.js';
import ABSwitch, { ABSwitchOptions } from '../../../../../sun/js/ABSwitch.js';
import phScale from '../../../phScale.js';
import phScaleStrings from '../../../phScaleStrings.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphUnits from './GraphUnits.js';

type SelfOptions = EmptySelfOptions;

type GraphUnitsSwitchOptions = SelfOptions & NodeTranslationOptions & PickRequired<ABSwitchOptions, 'tandem'>;

export default class GraphUnitsSwitch extends ABSwitch<GraphUnits> {

  public constructor( graphUnitsProperty: EnumerationProperty<GraphUnits>, provideOptions: GraphUnitsSwitchOptions ) {

    const options = optionize<GraphUnitsSwitchOptions, SelfOptions, ABSwitchOptions>()( {

      // ABSwitchOptions
      toggleSwitchOptions: { size: new Dimension2( 50, 25 ) },
      centerOnSwitch: true,
      phetioDocumentation: 'A/B switch for switching units'
    }, provideOptions );

    // Concentration (mol/L)
    const concentrationStringProperty = new DerivedProperty(
      [ phScaleStrings.concentrationStringProperty, phScaleStrings.units.molesPerLiterStringProperty ],
      ( concentrationString, molesPerLiterString ) => `${concentrationString}<br>(${molesPerLiterString})` );
    const concentrationText = new RichText( concentrationStringProperty, {
      align: 'center',
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 125,
      tandem: options.tandem.createTandem( 'concentrationText' )
    } );

    // Quantity (mol)
    const quantityStringProperty = new DerivedProperty(
      [ phScaleStrings.quantityStringProperty, phScaleStrings.units.molesStringProperty ],
      ( quantityString, molesString ) => `${quantityString}<br>(${molesString})` );
    const quantityText = new RichText( quantityStringProperty, {
      align: 'center',
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 90,
      tandem: options.tandem.createTandem( 'quantityText' )
    } );

    super( graphUnitsProperty, GraphUnits.MOLES_PER_LITER, concentrationText, GraphUnits.MOLES, quantityText, options );
  }
}

phScale.register( 'GraphUnitsSwitch', GraphUnitsSwitch );