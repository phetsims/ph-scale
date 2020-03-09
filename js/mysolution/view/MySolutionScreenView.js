// Copyright 2013-2020, University of Colorado Boulder

/**
 * View for the 'My Solution' screen.
 *
 * NOTE:
 * This view currently consists of a subset of the nodes in the 'Micro' screen.
 * But some of the common nodes are configured differently, and the screen has different layering and layout requirements.
 * So I choose to duplicate some code rather than attempt a refactor that would result in an implementation that
 * was more difficult to understand and maintain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import BeakerControlPanel from '../../common/view/BeakerControlPanel.js';
import BeakerNode from '../../common/view/BeakerNode.js';
import GraphNode from '../../common/view/graph/GraphNode.js';
import MoleculeCountNode from '../../common/view/MoleculeCountNode.js';
import PHMeterNode from '../../common/view/PHMeterNode.js';
import PHScaleViewProperties from '../../common/view/PHScaleViewProperties.js';
import RatioNode from '../../common/view/RatioNode.js';
import SolutionNode from '../../common/view/SolutionNode.js';
import VolumeIndicatorNode from '../../common/view/VolumeIndicatorNode.js';
import phScale from '../../phScale.js';

class MySolutionScreenView extends ScreenView {

  /**
   * @param {MySolutionModel} model
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

    // solution in the beaker
    const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );

    // volume indicator along the right edge of the beaker
    const volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, modelViewTransform, {
      tandem: tandem.createTandem( 'volumeIndicatorNode' )
    } );

    // 'H3O+/OH- ratio' representation
    const ratioNode = new RatioNode( model.beaker, model.solution, modelViewTransform, viewProperties.ratioVisibleProperty, {
      visible: viewProperties.ratioVisibleProperty.get(),
      tandem: tandem.createTandem( 'ratioNode' )
    } );

    // 'molecule count' representation
    const moleculeCountNode = new MoleculeCountNode( model.solution, viewProperties.moleculeCountVisibleProperty, {
      tandem: tandem.createTandem( 'moleculeCountNode' )
    } );

    // beaker controls
    const beakerControlPanel = new BeakerControlPanel(
      viewProperties.ratioVisibleProperty,
      viewProperties.moleculeCountVisibleProperty, {
        maxWidth: 0.85 * beakerNode.width,
        tandem: tandem.createTandem( 'beakerControlPanel' )
      } );

    // graph
    const graphNode = new GraphNode( model.solution, {
      mutablePHProperty: model.mutableSolution.pHProperty,
      isInteractive: true,
      logScaleHeight: 565,
      tandem: tandem.createTandem( 'graphNode' )
    } );

    // pH meter
    const pHMeterTop = 15;
    const pHMeterNode = new PHMeterNode( model.mutableSolution.pHProperty,
      modelViewTransform.modelToViewY( model.beaker.position.y ) - pHMeterTop, {
        isInteractive: true, // add spinner to change pH
        tandem: tandem.createTandem( 'pHMeterNode' )
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
        solutionNode,
        pHMeterNode,
        ratioNode,
        beakerNode,
        moleculeCountNode,
        volumeIndicatorNode,
        beakerControlPanel,
        graphNode,
        resetAllButton
      ]
    } );
    this.addChild( rootNode );

    // Layout of nodes that don't have a position specified in the model
    pHMeterNode.left = beakerNode.left;
    pHMeterNode.top = pHMeterTop;
    moleculeCountNode.centerX = beakerNode.centerX;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControlPanel.centerX = beakerNode.centerX;
    beakerControlPanel.top = beakerNode.bottom + 10;
    graphNode.right = beakerNode.left - 70;
    graphNode.top = pHMeterNode.top;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }
}

phScale.register( 'MySolutionScreenView', MySolutionScreenView );
export default MySolutionScreenView;