// Copyright 2013-2025, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import FaucetNode, { FaucetNodeOptions } from '../../../../scenery-phet/js/FaucetNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import phScale from '../../phScale.js';
import Faucet from '../model/Faucet.js';
import Water from '../model/Water.js';
import PHScaleConstants from '../PHScaleConstants.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

// constants
const SCALE = 0.6;

type SelfOptions = EmptySelfOptions;

type WaterFaucetNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class WaterFaucetNode extends Node {

  public constructor( faucet: Faucet, modelViewTransform: ModelViewTransform2, providedOptions: WaterFaucetNodeOptions ) {

    const options = optionize<WaterFaucetNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const horizontalPipeLength = Math.abs( modelViewTransform.modelToViewX( faucet.position.x - faucet.pipeMinX ) ) / SCALE;

    const faucetNode = new FaucetNode( faucet.maxFlowRate, faucet.flowRateProperty, faucet.enabledProperty,
      combineOptions<FaucetNodeOptions>( {}, PHScaleConstants.FAUCET_OPTIONS, {
        horizontalPipeLength: horizontalPipeLength,
        verticalPipeLength: 20,

        // The faucet node is flipped, therefore we need to reverse alternative input.
        reverseAlternativeInput: true,
        accessibleName: PhScaleStrings.a11y.beakerControls.waterFaucet.accessibleNameStringProperty,
        accessibleHelpText: PhScaleStrings.a11y.beakerControls.waterFaucet.accessibleHelpTextStringProperty,
        pdomCreateAriaValueText: flowRate => {
          return StringUtils.fillIn( PhScaleStrings.a11y.beakerControls.faucetCommon.accessibleObjectResponseStringProperty, {

            // Since our pdom value is inverted when `reverseAlternativeInput: true` we need to invert it again here to
            // display properly for screen readers.
            value: toFixed( faucet.flowRateProperty.rangeProperty.value.max - flowRate, 3 )
          } );
        },

        // Dynamic dependencies used in pdomCreateAriaValueText.
        descriptionDependencies: [
          PhScaleStrings.a11y.beakerControls.faucetCommon.accessibleObjectResponseStringProperty
        ],
        tandem: options.tandem.createTandem( 'faucetNode' )
      } ) );
    faucetNode.translation = modelViewTransform.modelToViewPosition( faucet.position );
    faucetNode.setScaleMagnitude( -SCALE, SCALE ); // reflect horizontally

    // decorate the faucet with 'Water' label
    const waterText = new Text( Water.nameProperty, {
      font: new PhetFont( 28 ),
      maxWidth: 85,
      left: faucetNode.left + 115,
      bottom: faucetNode.centerY - 40,

      // Instrumented so that clients can hide this label.
      tandem: options.tandem.createTandem( 'waterText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    options.children = [ faucetNode, waterText ];

    super( options );
  }
}

phScale.register( 'WaterFaucetNode', WaterFaucetNode );