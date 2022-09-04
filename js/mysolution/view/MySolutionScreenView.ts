// Copyright 2013-2022, University of Colorado Boulder

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

import { ScreenOptions } from '../../../../joist/js/Screen.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Node } from '../../../../scenery/js/imports.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import BeakerControlPanel from '../../common/view/BeakerControlPanel.js';
import BeakerNode from '../../common/view/BeakerNode.js';
import GraphNode from '../../common/view/graph/GraphNode.js';
import MoleculeCountNode from '../../common/view/MoleculeCountNode.js';
import PHMeterNodeAccordionBox from '../../common/view/PHMeterNodeAccordionBox.js';
import PHScaleViewProperties from '../../common/view/PHScaleViewProperties.js';
import RatioNode from '../../common/view/RatioNode.js';
import SolutionNode from '../../common/view/SolutionNode.js';
import VolumeIndicatorNode from '../../common/view/VolumeIndicatorNode.js';
import phScale from '../../phScale.js';
import MySolutionModel from '../model/MySolutionModel.js';

type SelfOptions = EmptySelfOptions;

type MySolutionScreenViewOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class MySolutionScreenView extends ScreenView {

  public constructor( model: MySolutionModel, modelViewTransform: ModelViewTransform2, provideOptions: MySolutionScreenViewOptions ) {

    const options = optionize3<MySolutionScreenViewOptions, SelfOptions, ScreenOptions>()( {},
      PHScaleConstants.SCREEN_VIEW_OPTIONS, provideOptions );

    super( options );

    // view-specific properties
    const viewProperties = new PHScaleViewProperties( options.tandem.createTandem( 'viewProperties' ) );

    // beaker
    const beakerNode = new BeakerNode( model.beaker, modelViewTransform, {
      tandem: options.tandem.createTandem( 'beakerNode' )
    } );

    // solution in the beaker
    const solutionNode = new SolutionNode( model.solution.totalVolumeProperty, model.solution.colorProperty,
      model.beaker, modelViewTransform );

    // volume indicator along the right edge of the beaker
    const volumeIndicatorNode = new VolumeIndicatorNode( model.solution.totalVolumeProperty, model.beaker, modelViewTransform, {
      tandem: options.tandem.createTandem( 'volumeIndicatorNode' )
    } );

    // 'H3O+/OH- ratio' representation
    const ratioNode = new RatioNode( model.beaker, model.solution, modelViewTransform, {
      visibleProperty: viewProperties.ratioVisibleProperty,
      tandem: options.tandem.createTandem( 'ratioNode' )
    } );

    // 'molecule count' representation
    const moleculeCountNode = new MoleculeCountNode( model.solution.derivedProperties, {
      visibleProperty: viewProperties.moleculeCountVisibleProperty,
      tandem: options.tandem.createTandem( 'moleculeCountNode' )
    } );

    // beaker controls
    const beakerControlPanel = new BeakerControlPanel(
      viewProperties.ratioVisibleProperty,
      viewProperties.moleculeCountVisibleProperty, {
        maxWidth: 0.85 * beakerNode.width,
        tandem: options.tandem.createTandem( 'beakerControlPanel' )
      } );

    // graph
    // @ts-ignore TODO https://github.com/phetsims/ph-scale/issues/242
    const graphNode = new GraphNode( model.solution.pHProperty, model.solution.totalVolumeProperty,
      model.solution.derivedProperties, {
        isInteractive: true, // add drag handlers for changing H3O+ and OH- on the Logarithmic graph
        logScaleHeight: 565,
        tandem: options.tandem.createTandem( 'graphNode' )
      } );

    // pH meter
    const pHMeterTop = 15;
    // @ts-ignore TODO https://github.com/phetsims/ph-scale/issues/242
    const pHMeterNode = new PHMeterNodeAccordionBox( model.solution.pHProperty,
      modelViewTransform.modelToViewY( model.beaker.position.y ) - pHMeterTop, {
        isInteractive: true, // add spinner to change pH
        tandem: options.tandem.createTandem( 'pHMeterNodeAccordionBox' )
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
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Parent for all nodes added to this screen
    const rootNode = new Node( {
      children: [
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