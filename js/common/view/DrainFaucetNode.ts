// Copyright 2013-2025, University of Colorado Boulder

/**
 * Faucet that drains solution from the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import phScale from '../../phScale.js';
import Faucet from '../model/Faucet.js';
import PHScaleConstants from '../PHScaleConstants.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

// constants
const SCALE = 0.6;

type SelfOptions = EmptySelfOptions;

type DrainFaucetNodeOptions = SelfOptions & PickRequired<FaucetNodeOptions, 'tandem'>;

export default class DrainFaucetNode extends FaucetNode {

  public constructor( faucet: Faucet, modelViewTransform: ModelViewTransform2, providedOptions: DrainFaucetNodeOptions ) {

    const horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) ) / SCALE;

    const options = optionize4<DrainFaucetNodeOptions, SelfOptions, FaucetNodeOptions>()( {},
      PHScaleConstants.FAUCET_OPTIONS, {

        // FaucetNodeOptions
        horizontalPipeLength: horizontalPipeLength,
        verticalPipeLength: 5,
        reverseAlternativeInput: true,
        visiblePropertyOptions: {
          phetioFeatured: true
        },
        accessibleName: PhScaleStrings.a11y.beakerControls.drainFaucet.accessibleNameStringProperty,
        accessibleHelpText: PhScaleStrings.a11y.beakerControls.drainFaucet.accessibleHelpTextStringProperty,
        pdomCreateAriaValueText: flowRate => {
          return StringUtils.fillIn( PhScaleStrings.a11y.beakerControls.faucetCommon.accessibleObjectResponseStringProperty, {

            // We need to invert the value since the faucet is `reverseAlternativeInput = true`.
            value: toFixed( faucet.flowRateProperty.rangeProperty.value.max - flowRate, 3 )
          } );
        },

        // Dynamic dependencies used in pdomCreateAriaValueText.
        descriptionDependencies: [
          PhScaleStrings.a11y.beakerControls.faucetCommon.accessibleObjectResponseStringProperty
        ]
      }, providedOptions );

    super( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty, options );

    this.translation = modelViewTransform.modelToViewPosition( faucet.position );
    this.setScaleMagnitude( -SCALE, SCALE ); // reflect horizontally
  }
}

phScale.register( 'DrainFaucetNode', DrainFaucetNode );