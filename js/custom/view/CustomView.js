// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Custom' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerControls = require( 'PH_SCALE/common/view/BeakerControls' );
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var CustomGraphNode = require( 'PH_SCALE/custom/view/CustomGraphNode' );
  var CustomPHMeterNode = require( 'PH_SCALE/custom/view/CustomPHMeterNode' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  /**
   * @param {CustomModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BasicsView( model, mvt ) {

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
    var dropperNode = new DropperNode( model.dropper, mvt, { showPH: true } );
    dropperNode.setScaleMagnitude( DROPPER_SCALE );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, DROPPER_SCALE * dropperNode.getTipWidth(), mvt );

    // drain faucet
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, mvt );
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // 'H3O+/OH- ratio' representation
    var ratioNode = new RatioNode( model.beaker, model.solution, mvt );
    viewProperties.ratioVisibleProperty.linkAttribute( ratioNode, 'visible' );

    // 'molecule count' representation
    var moleculeCountNode = new MoleculeCountNode( model.solution );
    viewProperties.moleculeCountVisibleProperty.linkAttribute( moleculeCountNode, 'visible' );

    // beaker controls
    var beakerControls = new BeakerControls( viewProperties.ratioVisibleProperty, viewProperties.moleculeCountVisibleProperty );

    // pH meter
    var pHMeterNode = new CustomPHMeterNode( model.solution );

    // graph
    var graphNode = new CustomGraphNode( model.solution );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      viewProperties.reset();
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      // nodes are rendered in this order
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
      resetAllButton
    ] } );
    thisView.addChild( rootNode );

    // Layout of nodes that don't have a location specified in the model
    pHMeterNode.right = beakerNode.left + 20;
    pHMeterNode.top = 20;
    moleculeCountNode.centerX = mvt.modelToViewX( model.beaker.location.x );
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = mvt.modelToViewX( model.beaker.location.x );
    beakerControls.top = beakerNode.bottom + 15;
    graphNode.right = drainFaucetNode.left - 70;
    graphNode.top = 20;
    resetAllButton.left = beakerControls.right + 30;
    resetAllButton.centerY = beakerControls.centerY;
  }

  return inherit( ScreenView, BasicsView, { layoutBounds: PHScaleConstants.LAYOUT_BOUNDS } );
} );
