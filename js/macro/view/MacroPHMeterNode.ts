// Copyright 2013-2026, University of Colorado Boulder

/**
 * pH meter for the 'Macro' screen.
 *
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * - solution in the beaker
 * - output of the water faucet
 * - output of the drain faucet
 * - output of the dropper
 *
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Dropper from '../../common/model/Dropper.js';
import Solution from '../../common/model/Solution.js';
import Water from '../../common/model/Water.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import MacroPHMeter from '../model/MacroPHMeter.js';
import { MacroPHProbeNode } from './MacroPHProbeNode.js';
import { linear } from '../../../../dot/js/util/linear.js';
import JumpPosition from '../model/JumpPosition.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import Faucet from '../../common/model/Faucet.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ValueChangeUtterance from '../../../../utterance-queue/js/ValueChangeUtterance.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import PHIndicatorNode from './PHIndicatorNode.js';
import ScaleNode from './ScaleNode.js';
import WireNode from './WireNode.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
export const SCALE_SIZE = new Dimension2( 55, 450 );

type SelfOptions = EmptySelfOptions;

type MacroPHMeterNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class MacroPHMeterNode extends Node {

  private readonly probeNode: MacroPHProbeNode;

  public constructor( meter: MacroPHMeter,
                      solution: Solution,
                      dropper: Dropper,
                      waterFaucet: Faucet,
                      drainFaucet: Faucet,
                      solutionNode: Node,
                      dropperFluidNode: Node,
                      waterFluidNode: Node,
                      drainFluidNode: Node,
                      modelViewTransform: ModelViewTransform2,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number>,
                      providedOptions: MacroPHMeterNodeOptions ) {

    const options = providedOptions;

    super( options );

    // the vertical scale, positioned at the meter 'body' position
    const scaleNode = new ScaleNode( {
      size: SCALE_SIZE,
      accessibleParagraph: PhScaleStrings.a11y.pHMeter.descriptionStringProperty
    } );
    scaleNode.translation = modelViewTransform.modelToViewPosition( meter.bodyPosition );

    // indicator that slides vertically along scale
    const pHIndicatorNode = new PHIndicatorNode( meter.pHProperty, SCALE_SIZE.width, {
      tandem: options.tandem.createTandem( 'pHIndicatorNode' )
    } );
    pHIndicatorNode.left = scaleNode.x;

    // interactive probe
    const probeNode = new MacroPHProbeNode( meter.probe, modelViewTransform, solutionNode, dropperFluidNode,
      waterFluidNode, drainFluidNode, jumpPositions, jumpPositionIndexProperty, {
        tandem: options.tandem.createTandem( 'probeNode' )
      } );

    /**
     * Add accessible context responses for the probe as the pH value changes.
     *
     * When the probe is in the solution we only want to announce the pH value when the dropper or faucets
     * are not dispensing, and therefore pH value is not changing rapidly. For this scenario we use a Multilink.
     */
    const responseUtterance = new ValueChangeUtterance();
    Multilink.multilink( [ meter.pHProperty, dropper.isDispensingProperty, waterFaucet.flowRateProperty, drainFaucet.flowRateProperty ],
      ( pH, dropperIsDispensing, waterFaucetFlowRate, drainFaucetFlowRate ) => {
        if ( pH !== null ) {
          if ( probeNode.isInSolution() ) {
            if ( !dropperIsDispensing && waterFaucetFlowRate === 0 && drainFaucetFlowRate === 0 ) {
              responseUtterance.alert = StringUtils.fillIn( PhScaleStrings.a11y.pHValuePatternStringProperty, {
                pHValue: toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES )
              } );
              probeNode.addAccessibleContextResponse( responseUtterance );
            }
          }
        }
      } );

    // For all other scenarios not covered by the Multilink above, we only announce when the pH value changes, and we do
    // not care if the dropper or faucets are dispensing.
    meter.pHProperty.link( pH => {
      if ( pH !== null ) {
        if ( probeNode.isInWater() || probeNode.isInDropperSolution() || probeNode.isInDrainFluid() ) {
          responseUtterance.alert = StringUtils.fillIn( PhScaleStrings.a11y.pHValuePatternStringProperty, {
            pHValue: toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES )
          } );
        }
      }
      else {
        responseUtterance.alert = PhScaleStrings.a11y.pHValueUnknownStringProperty;
      }
      probeNode.addAccessibleContextResponse( responseUtterance );
    } );
    this.probeNode = probeNode;

    // wire that connects the probe to the meter
    const wireNode = new WireNode( meter.probe, scaleNode, probeNode );

    // rendering order
    this.children = [ wireNode, probeNode, scaleNode, pHIndicatorNode ];

    // vertical position of the indicator
    meter.pHProperty.link( pH => {
      pHIndicatorNode.centerY = scaleNode.y + linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, pH || 7 );
    } );

    const updateValue = () => {
      let pH;
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        pH = solution.pHProperty.value;
      }
      else if ( probeNode.isInWater() ) {
        pH = Water.pH;
      }
      else if ( probeNode.isInDropperSolution() ) {
        pH = dropper.soluteProperty.value.pH;
      }
      else {
        pH = null;
      }
      meter.pHProperty.value = pH;
    };
    Multilink.multilink( [
      meter.probe.positionProperty,
      solution.soluteProperty,
      solution.pHProperty,
      solutionNode.boundsProperty,
      dropperFluidNode.boundsProperty,
      waterFluidNode.boundsProperty,
      drainFluidNode.boundsProperty
    ], () => updateValue() );

    // Create a link to pHProperty, so it's easier to find in Studio.
    this.addLinkedElement( meter.pHProperty, {
      tandemName: 'pHProperty'
    } );

    this.pdomOrder = [
      scaleNode, pHIndicatorNode, probeNode
    ];
  }

  public reset(): void {
    this.probeNode.reset();
  }
}

phScale.register( 'MacroPHMeterNode', MacroPHMeterNode );