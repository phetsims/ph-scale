// Copyright 2013-2021, University of Colorado Boulder

/**
 * View for the 'Micro' screen.
 *
 * NOTE:
 * This view currently consists of a superset of the nodes in the 'My Solution' screen.
 * But some of the common nodes are configured differently, and the screen has different layering and layout requirements.
 * So I choose to duplicate some code rather than attempt a refactor that would result in an implementation that
 * was more difficult to understand and maintain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Water from '../../common/model/Water.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import BeakerControlPanel from '../../common/view/BeakerControlPanel.js';
import BeakerNode from '../../common/view/BeakerNode.js';
import DrainFaucetNode from '../../common/view/DrainFaucetNode.js';
import DropperFluidNode from '../../common/view/DropperFluidNode.js';
import FaucetFluidNode from '../../common/view/FaucetFluidNode.js';
import GraphNode from '../../common/view/graph/GraphNode.js';
import MoleculeCountNode from '../../common/view/MoleculeCountNode.js';
import PHDropperNode from '../../common/view/PHDropperNode.js';
import PHMeterNode from '../../common/view/PHMeterNode.js';
import PHScaleViewProperties from '../../common/view/PHScaleViewProperties.js';
import RatioNode from '../../common/view/RatioNode.js';
import SoluteComboBox from '../../common/view/SoluteComboBox.js';
import SolutionNode from '../../common/view/SolutionNode.js';
import VolumeIndicatorNode from '../../common/view/VolumeIndicatorNode.js';
import WaterFaucetNode from '../../common/view/WaterFaucetNode.js';
import phScale from '../../phScale.js';

class MicroScreenView extends ScreenView {

  /**
   * @param {MicroModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( model, modelViewTransform, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, 'invalid modelViewTransform' );

    super( merge( {}, PHScaleConstants.SCREEN_VIEW_OPTIONS, {
      tandem: tandem
    } ) );

    // view-specific properties
    const viewProperties = new PHScaleViewProperties( tandem.createTandem( 'viewProperties' ) );

    // beaker
    const beakerNode = new BeakerNode( model.beaker, modelViewTransform, {
      tandem: tandem.createTandem( 'beakerNode' )
    } );

    // solution
    const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );

    // volume indicator on right side of beaker
    const volumeIndicatorNode = new VolumeIndicatorNode( model.solution.totalVolumeProperty, model.beaker, modelViewTransform, {
      tandem: tandem.createTandem( 'volumeIndicatorNode' )
    } );

    // dropper
    const DROPPER_SCALE = 0.85;
    const dropperNode = new PHDropperNode( model.dropper, modelViewTransform, {
      visibleProperty: model.dropper.visibleProperty,
      tandem: tandem.createTandem( 'dropperNode' )
    } );
    dropperNode.setScaleMagnitude( DROPPER_SCALE );
    const dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * EyeDropperNode.TIP_WIDTH,
      modelViewTransform, {
        visibleProperty: model.dropper.visibleProperty
      } );

    // faucets
    const waterFaucetNode = new WaterFaucetNode( model.waterFaucet, modelViewTransform, {
      tandem: tandem.createTandem( 'waterFaucetNode' )
    } );
    const drainFaucetNode = new DrainFaucetNode( model.drainFaucet, modelViewTransform, {
      tandem: tandem.createTandem( 'drainFaucetNode' )
    } );
    const SOLVENT_FLUID_HEIGHT = model.beaker.position.y - model.waterFaucet.position.y;
    const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    const waterFluidNode = new FaucetFluidNode( model.waterFaucet, new Property( Water.color ), SOLVENT_FLUID_HEIGHT, modelViewTransform );
    const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution.colorProperty, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // 'H3O+/OH- ratio' representation
    const ratioNode = new RatioNode( model.beaker, model.solution, modelViewTransform, {
      visibleProperty: viewProperties.ratioVisibleProperty,
      tandem: tandem.createTandem( 'ratioNode' )
    } );

    // 'molecule count' representation
    const moleculeCountNode = new MoleculeCountNode( model.solution.derivedProperties, {
      visibleProperty: viewProperties.moleculeCountVisibleProperty,
      tandem: tandem.createTandem( 'moleculeCountNode' )
    } );

    // beaker control panel
    const beakerControlPanel = new BeakerControlPanel(
      viewProperties.ratioVisibleProperty,
      viewProperties.moleculeCountVisibleProperty, {
        maxWidth: 0.85 * beakerNode.width,
        tandem: tandem.createTandem( 'beakerControlPanel' )
      } );

    // graph
    const graphNode = new GraphNode( model.solution.pHProperty, model.solution.totalVolumeProperty,
      model.solution.derivedProperties, {
        hasLinearFeature: true,
        logScaleHeight: 485,
        linearScaleHeight: 440,
        tandem: tandem.createTandem( 'graphNode' )
      } );

    // pH meter
    const pHMeterTop = 15;
    const pHMeterNode = new PHMeterNode( model.solution.pHProperty,
      modelViewTransform.modelToViewY( model.beaker.position.y ) - pHMeterTop, {
        tandem: tandem.createTandem( 'pHMeterNode' )
      } );

    // solutes combo box
    const soluteListParent = new Node();
    const soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent, {
      maxWidth: 400,
      tandem: tandem.createTandem( 'soluteComboBox' )
    } );

    const resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        viewProperties.reset();
        graphNode.reset();
        pHMeterNode.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Parent for all nodes added to this screen
    const rootNode = new Node( {
      children: [
        // nodes are rendered in this order
        waterFluidNode,
        waterFaucetNode,
        drainFluidNode,
        drainFaucetNode,
        dropperFluidNode,
        dropperNode,
        solutionNode,
        pHMeterNode,
        ratioNode,
        beakerNode,
        moleculeCountNode,
        volumeIndicatorNode,
        beakerControlPanel,
        graphNode,
        resetAllButton,
        soluteComboBox,
        soluteListParent // last, so that combo box list is on top
      ]
    } );
    this.addChild( rootNode );

    // Layout of nodes that don't have a position specified in the model
    moleculeCountNode.centerX = beakerNode.centerX;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControlPanel.centerX = beakerNode.centerX;
    beakerControlPanel.top = beakerNode.bottom + 10;
    pHMeterNode.left = modelViewTransform.modelToViewX( model.beaker.left ) - ( 0.4 * pHMeterNode.width );
    pHMeterNode.top = pHMeterTop;
    graphNode.right = drainFaucetNode.left - 40;
    graphNode.top = pHMeterNode.top;
    soluteComboBox.left = pHMeterNode.right + 35;
    soluteComboBox.top = this.layoutBounds.top + pHMeterTop;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }
}

phScale.register( 'MicroScreenView', MicroScreenView );
export default MicroScreenView;