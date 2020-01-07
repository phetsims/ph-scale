// Copyright 2013-2019, University of Colorado Boulder

/**
 * View for the 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  const DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  const DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  const EyeDropperNode = require( 'SCENERY_PHET/EyeDropperNode' );
  const FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MacroPHMeterNode = require( 'PH_SCALE/macro/view/MacroPHMeterNode' );
  const NeutralIndicator = require( 'PH_SCALE/macro/view/NeutralIndicator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PHDropperNode = require( 'PH_SCALE/common/view/PHDropperNode' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  const SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  const VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );
  const Water = require( 'PH_SCALE/common/model/Water' );
  const WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );

  /**
   * @param {MacroModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function MacroScreenView( model, modelViewTransform ) {

    ScreenView.call( this, PHScaleConstants.SCREEN_VIEW_OPTIONS );

    // beaker
    const beakerNode = new BeakerNode( model.beaker, modelViewTransform );
    const solutionNode = new SolutionNode( model.solution, model.beaker, modelViewTransform );
    const volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, modelViewTransform );

    // neutral indicator that appears in the bottom of the beaker
    const neutralIndicator = new NeutralIndicator( model.solution );

    // dropper
    const DROPPER_SCALE = 0.85;
    const dropperNode = new PHDropperNode( model.dropper, modelViewTransform );
    dropperNode.setScaleMagnitude( DROPPER_SCALE );
    const dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * EyeDropperNode.TIP_WIDTH, modelViewTransform );

    // faucets
    const waterFaucetNode = new WaterFaucetNode( model.waterFaucet, modelViewTransform );
    const drainFaucetNode = new DrainFaucetNode( model.drainFaucet, modelViewTransform );
    const WATER_FLUID_HEIGHT = model.beaker.position.y - model.waterFaucet.position.y;
    const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    const waterFluidNode = new FaucetFluidNode( model.waterFaucet, new Property( Water.color ), WATER_FLUID_HEIGHT, modelViewTransform );
    const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution.colorProperty, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // pH meter
    const pHMeterNode = new MacroPHMeterNode( model.pHMeter, model.solution, model.dropper,
      solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, modelViewTransform );

    // solutes combo box
    const soluteListParent = new Node();
    const soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent, { maxWidth: 400 } );

    const resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: function() {
        model.reset();
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
        beakerNode,
        neutralIndicator,
        volumeIndicatorNode,
        soluteComboBox,
        resetAllButton,
        pHMeterNode, // next to last so that probe doesn't get lost behind anything
        soluteListParent // last, so that combo box list is on top
      ]
    } );
    this.addChild( rootNode );

    // Layout of nodes that don't have a position specified in the model
    soluteComboBox.left = modelViewTransform.modelToViewX( model.beaker.left ) - 20; // anchor on left so it grows to the right during i18n
    soluteComboBox.top = this.layoutBounds.top + 15;
    neutralIndicator.centerX = beakerNode.centerX;
    neutralIndicator.bottom = beakerNode.bottom - 30;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;

    model.isAutoFillingProperty.link( isAutoFilling => {
      dropperNode.interruptSubtreeInput();
    } );
  }

  phScale.register( 'MacroScreenView', MacroScreenView );

  return inherit( ScreenView, MacroScreenView );
} );
