// Copyright 2020-2025, University of Colorado Boulder

/**
 * GraphScaleSwitch is the control for switching between logarithmic and linear scales.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { NodeTranslationOptions } from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import ABSwitch, { ABSwitchOptions } from '../../../../../sun/js/ABSwitch.js';
import phScale from '../../../phScale.js';
import PhScaleStrings from '../../../PhScaleStrings.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphScale from './GraphScale.js';

type SelfOptions = EmptySelfOptions;

type GraphScaleSwitchOptions = SelfOptions & NodeTranslationOptions & PickRequired<ABSwitchOptions, 'tandem'>;

export default class GraphScaleSwitch extends ABSwitch<GraphScale> {

  public constructor( graphScaleProperty: EnumerationProperty<GraphScale>, providedOptions: GraphScaleSwitchOptions ) {

    const options = optionize<GraphScaleSwitchOptions, SelfOptions, ABSwitchOptions>()( {

      // ABSwitchOptions
      toggleSwitchOptions: {
        size: new Dimension2( 50, 25 )
      },
      centerOnSwitch: true,
      valueAAccessibleName: PhScaleStrings.logarithmicStringProperty,
      valueBAccessibleName: PhScaleStrings.linearStringProperty,
      accessibleHelpText: PhScaleStrings.a11y.graph.scaleSwitch.accessibleHelpTextStringProperty,
      phetioDocumentation: 'A/B switch for switching between logarithmic and linear scales'
    }, providedOptions );

    const textOptions = {
      font: PHScaleConstants.AB_SWITCH_FONT,
      maxWidth: 125,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    };

    // Logarithmic label
    const logarithmicText = new Text( PhScaleStrings.logarithmicStringProperty, textOptions );

    // Linear label
    const linearText = new Text( PhScaleStrings.linearStringProperty, textOptions );

    super( graphScaleProperty, GraphScale.LOGARITHMIC, logarithmicText, GraphScale.LINEAR, linearText, options );
  }
}

phScale.register( 'GraphScaleSwitch', GraphScaleSwitch );