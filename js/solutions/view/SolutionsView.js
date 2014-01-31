// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerControls = require( 'PH_SCALE/common/view/BeakerControls' );
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var GraphNode = require( 'PH_SCALE/common/view/graph/GraphNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHMeterNode = require( 'PH_SCALE/common/view/PHMeterNode' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );
  var WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );

  /**
   * @param {SolutionsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SolutionsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // view-specific properties
    var viewProperties = new PropertySet( {
      ratioVisible: false,
      moleculeCountVisible: false
    } );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, mvt );
    var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, mvt );

    // dropper
    var DROPPER_SCALE = 0.85;
    var dropperNode = new DropperNode( model.dropper, mvt );
    dropperNode.setScaleMagnitude( DROPPER_SCALE );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * dropperNode.getTipWidth(), mvt );

    // faucets
    var waterFaucetNode = new WaterFaucetNode( model.water, model.waterFaucet, mvt );
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.waterFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var waterFluidNode = new FaucetFluidNode( model.waterFaucet, model.solution.water, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // 'H3O+/OH- ratio' representation
    var ratioNode = new RatioNode( model.beaker, model.solution, mvt, { visible: viewProperties.ratioVisibleProperty.get() } );
    viewProperties.ratioVisibleProperty.linkAttribute( ratioNode, 'visible' );

    // 'molecule count' representation
    var moleculeCountNode = new MoleculeCountNode( model.solution );
    viewProperties.moleculeCountVisibleProperty.linkAttribute( moleculeCountNode, 'visible' );

    // beaker controls
    var beakerControls = new BeakerControls( viewProperties.ratioVisibleProperty, viewProperties.moleculeCountVisibleProperty );

    // graph
    var graphNode = new GraphNode( model.solution, {
      hasLinearFeature: true,
      scaleHeight: 475
    } );

    // pH meter
    var pHMeterYOffset = 20;
    var pHMeterNode = new PHMeterNode( model.solution, mvt.modelToViewY( model.beaker.location.y ) - pHMeterYOffset,
    { attachProbe: 'right' } );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      viewProperties.reset();
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      // nodes are rendered in this order
      waterFluidNode,
      waterFaucetNode,
      drainFluidNode,
      drainFaucetNode,
      dropperFluidNode,
      dropperNode,
      solutionNode,
      ratioNode,
      beakerNode,
      moleculeCountNode,
      volumeIndicatorNode,
      beakerControls,
      pHMeterNode,
      graphNode,
      resetAllButton,
      soluteComboBox,
      soluteListParent // last, so that combo box list is on top
    ] } );
    thisView.addChild( rootNode );

    // Layout of nodes that don't have a location specified in the model
    moleculeCountNode.centerX = beakerNode.centerX;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 15;
    pHMeterNode.left = mvt.modelToViewX( model.beaker.left ) - ( 0.4 * pHMeterNode.width );
    pHMeterNode.top = 20;
    graphNode.right = drainFaucetNode.left - 40;
    graphNode.top = pHMeterNode.top;
    soluteComboBox.left = pHMeterNode.right + 35;
    soluteComboBox.top = this.layoutBounds.top + 15;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, SolutionsView, { layoutBounds: PHScaleConstants.LAYOUT_BOUNDS } );
} );
