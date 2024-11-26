// Copyright 2013-2024, University of Colorado Boulder

/**
 * View for the 'Macro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import EyeDropperNode from '../../../../scenery-phet/js/EyeDropperNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import DescriptionRegistry from '../../../../tandem/js/DescriptionRegistry.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Water from '../../common/model/Water.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import BeakerNode from '../../common/view/BeakerNode.js';
import DrainFaucetNode from '../../common/view/DrainFaucetNode.js';
import DropperFluidNode from '../../common/view/DropperFluidNode.js';
import FaucetFluidNode from '../../common/view/FaucetFluidNode.js';
import PHDropperNode from '../../common/view/PHDropperNode.js';
import SoluteComboBox from '../../common/view/SoluteComboBox.js';
import SolutionNode from '../../common/view/SolutionNode.js';
import VolumeIndicatorNode from '../../common/view/VolumeIndicatorNode.js';
import WaterFaucetNode from '../../common/view/WaterFaucetNode.js';
import phScale from '../../phScale.js';
import MacroModel from '../model/MacroModel.js';
import MacroPHMeterNode from './MacroPHMeterNode.js';
import NeutralIndicatorNode from './NeutralIndicatorNode.js';

export default class MacroScreenView extends ScreenView {

  public constructor( model: MacroModel, modelViewTransform: ModelViewTransform2, tandem: Tandem ) {

    super( combineOptions<ScreenViewOptions>( {
      tandem: tandem
    }, PHScaleConstants.SCREEN_VIEW_OPTIONS ) );

    // beaker
    const beakerNode = new BeakerNode( model.beaker, modelViewTransform, {
      tandem: tandem.createTandem( 'beakerNode' )
    } );

    // solution in the beaker
    const solutionNode = new SolutionNode( model.solution.totalVolumeProperty, model.solution.colorProperty,
      model.beaker, modelViewTransform );

    // volume indicator on the right edge of beaker
    const volumeIndicatorNode = new VolumeIndicatorNode( model.solution.totalVolumeProperty, model.beaker, modelViewTransform, {
      tandem: tandem.createTandem( 'volumeIndicatorNode' )
    } );

    // Neutral indicator that appears in the bottom of the beaker.
    const neutralIndicatorNode = new NeutralIndicatorNode( model.solution.pHProperty, {
      tandem: tandem.createTandem( 'neutralIndicatorNode' )
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

    // fluids coming out of faucets
    const WATER_FLUID_HEIGHT = model.beaker.position.y - model.waterFaucet.position.y;
    const DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    const waterFluidNode = new FaucetFluidNode( model.waterFaucet, new Property( Water.color ), WATER_FLUID_HEIGHT, modelViewTransform );
    const drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution.colorProperty, DRAIN_FLUID_HEIGHT, modelViewTransform );

    // Hide fluids when their faucets are hidden. See https://github.com/phetsims/ph-scale/issues/107
    waterFaucetNode.visibleProperty.lazyLink( () => {
      waterFluidNode.visible = waterFaucetNode.visible;
    } );
    drainFaucetNode.visibleProperty.lazyLink( () => {
      drainFluidNode.visible = drainFaucetNode.visible;
    } );

    // pH meter
    const cueParentNode = new Node();
    const pHMeterNode = new MacroPHMeterNode( model.pHMeter, model.solution, model.dropper,
      solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, cueParentNode, modelViewTransform, {
        tandem: tandem.createTandem( 'pHMeterNode' )
      } );

    const soluteListParent = new Node();

    //TODO https://github.com/phetsims/ph-scale/issues/294
    // soluteListParent does not have a PhET-iO tandem, so manually register it for description plugin access.
    if ( phet.chipper.queryParameters.supportsDescriptionPlugin ) {
      DescriptionRegistry.add( tandem.createTandem( 'soluteListParent' ), soluteListParent );
    }

    const soluteComboBox = new SoluteComboBox( model.dropper.soluteProperty, soluteListParent, {
      maxWidth: 400,
      tandem: tandem.createTandem( 'soluteComboBox' )
    } );

    const resetAllButton = new ResetAllButton( {
      scale: 1.32,
      listener: () => {
        model.reset();
        pHMeterNode.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Parent for all nodes added to this screen
    const screenViewRootNode = new Node( {
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
        neutralIndicatorNode,
        volumeIndicatorNode,
        soluteComboBox,
        resetAllButton,
        pHMeterNode, // next to last so that probe doesn't get lost behind anything
        soluteListParent, // last, so that combo box list is on top
        cueParentNode // top layer for things like interaction cues
      ]
    } );
    this.addChild( screenViewRootNode );

    // Layout of nodes that don't have a position specified in the model
    soluteComboBox.left = modelViewTransform.modelToViewX( model.beaker.left ) - 20; // anchor on left, so it grows to the right during i18n
    soluteComboBox.top = this.layoutBounds.top + 15;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;

    // Keep the neutral indicator centered in the bottom of the beaker.
    neutralIndicatorNode.boundsProperty.link( bounds => {
      neutralIndicatorNode.centerX = beakerNode.centerX;
      neutralIndicatorNode.bottom = beakerNode.bottom - 30;
    } );

    model.isAutofillingProperty.link( () => dropperNode.interruptSubtreeInput() );

    //TODO https://github.com/phetsims/ph-scale/issues/294 Setting pdomOrder conflicts with description plugin.
    if ( !phet.chipper.queryParameters.supportsDescriptionPlugin ) {

      // Play Area focus order
      this.pdomPlayAreaNode.pdomOrder = [
        pHMeterNode,
        soluteComboBox,
        dropperNode,
        waterFaucetNode,
        drainFaucetNode,
        resetAllButton
      ];

      // Control Area focus order
      this.pdomControlAreaNode.pdomOrder = [
        //TODO https://github.com/phetsims/ph-scale/issues/291
      ];
    }
  }
}

phScale.register( 'MacroScreenView', MacroScreenView );