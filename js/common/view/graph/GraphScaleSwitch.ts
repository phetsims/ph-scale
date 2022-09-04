// Copyright 2020-2022, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between logarithmic and linear scales.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { Text } from '../../../../../scenery/js/imports.js';
import ABSwitch, { ABSwitchOptions } from '../../../../../sun/js/ABSwitch.js';
import phScale from '../../../phScale.js';
import phScaleStrings from '../../../phScaleStrings.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphScale from './GraphScale.js';

type SelfOptions = EmptySelfOptions;

export type GraphScaleSwitchOptions = SelfOptions & PickRequired<ABSwitchOptions, 'tandem'>;

export default class GraphScaleSwitch extends ABSwitch<GraphScale> {

  public constructor( graphScaleProperty: EnumerationProperty<GraphScale>, providedOptions: GraphScaleSwitchOptions ) {

    const options = optionize<GraphScaleSwitchOptions, SelfOptions, ABSwitchOptions>()( {

      // ABSwitchOptions
      toggleSwitchOptions: { size: new Dimension2( 50, 25 ) },
      centerOnSwitch: true,
      phetioDocumentation: 'A/B switch for switching between logarithmic and linear scales'
    }, providedOptions );

    const textOptions = {
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 125
    };

    // Logarithmic label
    const logarithmicText = new Text( phScaleStrings.logarithmicStringProperty, merge( {
      tandem: options.tandem.createTandem( 'logarithmicText' )
    }, textOptions ) );

    // Linear label
    const linearText = new Text( phScaleStrings.linearStringProperty, merge( {
      tandem: options.tandem.createTandem( 'linearText' )
    }, textOptions ) );

    super( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicText, GraphScale.LINEAR, linearText, options );
  }
}

phScale.register( 'GraphScaleSwitch', GraphScaleSwitch );