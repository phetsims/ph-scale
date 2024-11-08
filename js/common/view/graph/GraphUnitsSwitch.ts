// Copyright 2020-2023, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between Concentration and Quantity units for the graphs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { NodeTranslationOptions, RichText } from '../../../../../scenery/js/imports.js';
import ABSwitch, { ABSwitchOptions } from '../../../../../sun/js/ABSwitch.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import PhScaleStrings from '../../../PhScaleStrings.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphUnits from './GraphUnits.js';

type SelfOptions = EmptySelfOptions;

type GraphUnitsSwitchOptions = SelfOptions & NodeTranslationOptions & PickRequired<ABSwitchOptions, 'tandem'>;

export default class GraphUnitsSwitch extends ABSwitch<GraphUnits> {

  public constructor( graphUnitsProperty: EnumerationProperty<GraphUnits>, provideOptions: GraphUnitsSwitchOptions ) {

    const options = optionize<GraphUnitsSwitchOptions, SelfOptions, ABSwitchOptions>()( {

      // ABSwitchOptions
      toggleSwitchOptions: {
        size: new Dimension2( 50, 25 ),
        tandem: Tandem.OPT_OUT // hiding or disabling just the toggle switch is not useful
      },
      centerOnSwitch: true,
      phetioDocumentation: 'A/B switch for switching units',
      visiblePropertyOptions: {
        phetioFeatured: false
      }
    }, provideOptions );

    // Concentration (mol/L)
    const concentrationStringProperty = new DerivedStringProperty(
      [ PhScaleStrings.concentrationStringProperty, PhScaleStrings.units.molesPerLiterStringProperty ],
      ( concentrationString, molesPerLiterString ) => `${concentrationString}<br>(${molesPerLiterString})`, {
        tandem: options.tandem.createTandem( 'concentrationStringProperty' )
      } );
    const concentrationText = new RichText( concentrationStringProperty, {
      align: 'center',
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 125
    } );

    // Quantity (mol)
    const quantityStringProperty = new DerivedStringProperty(
      [ PhScaleStrings.quantityStringProperty, PhScaleStrings.units.molesStringProperty ],
      ( quantityString, molesString ) => `${quantityString}<br>(${molesString})`, {
        tandem: options.tandem.createTandem( 'quantityStringProperty' )
      } );
    const quantityText = new RichText( quantityStringProperty, {
      align: 'center',
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 90
    } );

    super( graphUnitsProperty, GraphUnits.MOLES_PER_LITER, concentrationText, GraphUnits.MOLES, quantityText, options );
  }
}

phScale.register( 'GraphUnitsSwitch', GraphUnitsSwitch );