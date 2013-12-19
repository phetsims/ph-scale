// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BasicsPHMeterNode = require( 'PH_SCALE/basics/view/BasicsPHMeterNode' );
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NeutralIndicator = require( 'PH_SCALE/basics/view/NeutralIndicator' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  /**
   * @param {BasicsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BasicsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // Parent for all nodes added to this screen
    var rootNode = new Node();
    thisView.addChild( rootNode );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, mvt );
    var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, mvt );

    // neutral indicator that appears in the bottom of the beaker
    var neutralIndicator = new NeutralIndicator( model.solution );

    // dropper
    var dropperScale = 0.85;
    var dropperNode = new DropperNode( model.dropper, mvt );
    dropperNode.setScaleMagnitude( dropperScale );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, dropperScale * dropperNode.getTipWidth(), mvt );

    // faucets
    var waterFaucetNode = new WaterFaucetNode( model.water, model.waterFaucet, mvt );
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, mvt );
    var WATER_FLUID_HEIGHT = model.beaker.location.y - model.waterFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var waterFluidNode = new FaucetFluidNode( model.waterFaucet, model.solution.water, WATER_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // pH meter
    var pHMeterNode = new BasicsPHMeterNode(  model.pHMeter, model.solution, model.water, model.dropper,
          solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, mvt );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
    } );

    // Rendering order
    rootNode.addChild( waterFluidNode );
    rootNode.addChild( waterFaucetNode );
    rootNode.addChild( drainFluidNode );
    rootNode.addChild( drainFaucetNode );
    rootNode.addChild( dropperFluidNode );
    rootNode.addChild( dropperNode );
    rootNode.addChild( solutionNode );
    rootNode.addChild( beakerNode );
    rootNode.addChild( neutralIndicator );
    rootNode.addChild( volumeIndicatorNode );
    rootNode.addChild( soluteComboBox );
    rootNode.addChild( resetAllButton );
    rootNode.addChild( pHMeterNode ); // next to last so that probe doesn't get lost behind anything
    rootNode.addChild( soluteListParent ); // last, so that combo box list is on top

    // Layout of nodes that don't have a location specified in the model
    soluteComboBox.left = mvt.modelToViewX( model.beaker.left ) - 20; // anchor on left so it grows to the right during i18n
    soluteComboBox.top = this.layoutBounds.top + 15;
    neutralIndicator.centerX = beakerNode.centerX;
    neutralIndicator.bottom = beakerNode.bottom - 30;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, BasicsView, { layoutBounds: PHScaleConstants.LAYOUT_BOUNDS } );
} );
