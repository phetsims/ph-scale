// Copyright 2013-2020, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const BeakerControls = require( 'PH_SCALE/common/view/BeakerControls' );
  const BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  const DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  const DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  const EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  const FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  const GraphNode = require( 'PH_SCALE/common/view/graph/GraphNode' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PHDropperNode = require( 'PH_SCALE/common/view/PHDropperNode' );
  const PHMeterNode = require( 'PH_SCALE/common/view/PHMeterNode' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const PHScaleViewProperties = require( 'PH_SCALE/common/view/PHScaleViewProperties' );
  const Property = require( 'AXON/Property' );
  const RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  const SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );
  const Water = require( 'PH_SCALE/common/model/Water' );
  const WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );

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
      const viewProperties = new PHScaleViewProperties();

      // beaker
      const beakerNode = new BeakerNode( model.beaker, modelViewTransform );
      const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );
      const volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, modelViewTransform );

      // dropper
      const DROPPER_SCALE = 0.85;
      const dropperNode = new PHDropperNode( model.dropper, modelViewTransform );
      dropperNode.setScaleMagnitude( DROPPER_SCALE );
      const dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * EyeDropperNode.TIP_WIDTH, modelViewTransform );

      // faucets
      const waterFaucetNode = new WaterFaucetNode( model.waterFaucet, modelViewTransform );
      const drainFaucetNode = new DrainFaucetNode( model.drainFaucet, modelViewTransform );
      const SOLVENT_FLUID_HEIGHT = model.beaker.position.y - model.waterFaucet.position.y;
      const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
      const waterFluidNode = new FaucetFluidNode( model.waterFaucet, new Property( Water.color ), SOLVENT_FLUID_HEIGHT, modelViewTransform );
      const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution.colorProperty, DRAIN_FLUID_HEIGHT, modelViewTransform );

      // 'H3O+/OH- ratio' representation
      const ratioNode = new RatioNode( model.beaker, model.solution, modelViewTransform, { visible: viewProperties.ratioVisibleProperty.get() } );
      viewProperties.ratioVisibleProperty.linkAttribute( ratioNode, 'visible' );

      // 'molecule count' representation
      const moleculeCountNode = new MoleculeCountNode( model.solution );
      viewProperties.moleculeCountVisibleProperty.linkAttribute( moleculeCountNode, 'visible' );

      // beaker controls
      const beakerControls = new BeakerControls( viewProperties.ratioVisibleProperty, viewProperties.moleculeCountVisibleProperty,
        { maxWidth: 0.85 * beakerNode.width } );

      // graph
      const graphNode = new GraphNode( model.solution, viewProperties.graphExpandedProperty, {
        hasLinearFeature: true,
        logScaleHeight: 485,
        linearScaleHeight: 440
      } );

      // pH meter
      const pHMeterTop = 15;
      const pHMeterNode = new PHMeterNode( model.solution,
        modelViewTransform.modelToViewY( model.beaker.position.y ) - pHMeterTop,
        viewProperties.pHMeterExpandedProperty,
        { attachProbe: 'right' }
      );

      // solutes combo box
      const soluteListParent = new Node();
      const soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent, { maxWidth: 400 } );

      const resetAllButton = new ResetAllButton( {
        scale: 1.32,
        listener: () => {
          model.reset();
          viewProperties.reset();
          graphNode.reset();
        }
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
          beakerControls,
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
      beakerControls.centerX = beakerNode.centerX;
      beakerControls.top = beakerNode.bottom + 10;
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

  return phScale.register( 'MicroScreenView', MicroScreenView );
} );
