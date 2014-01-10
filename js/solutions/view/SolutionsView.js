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
  var Dimension2 = require( 'DOT/Dimension2' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var SolutionsGraphNode = require( 'PH_SCALE/solutions/view/SolutionsGraphNode' );
  var SolutionsPHMeterNode = require( 'PH_SCALE/solutions/view/SolutionsPHMeterNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );
  var WaterFaucetNode = require( 'PH_SCALE/common/view/WaterFaucetNode' );

  // strings
  var graphString = require( 'string!PH_SCALE/graph' );
  var pHString = require( 'string!PH_SCALE/pH' );

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
      moleculeCountVisible: false,
      graphVisible: true,
      graphUnits: GraphUnits.MOLES_PER_LITER
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node();
    thisView.addChild( rootNode );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, mvt );
    var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, mvt );

    // dropper
    var dropperScale = 0.85;
    var dropperNode = new DropperNode( model.dropper, mvt );
    dropperNode.setScaleMagnitude( dropperScale );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, dropperScale * dropperNode.getTipWidth(), mvt );

    // faucets
    var waterFaucetNode = new WaterFaucetNode( model.water, model.waterFaucet, mvt );
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.waterFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var waterFluidNode = new FaucetFluidNode( model.waterFaucet, model.solution.water, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // 'H3O+/OH- ratio' representation
    var ratioNode = new RatioNode( model.solution );
    viewProperties.ratioVisibleProperty.link( function( visible ) {
      ratioNode.visible = visible;
    } );

    // 'molecule count' representation
    var moleculeCountNode = new MoleculeCountNode( model.solution );
    viewProperties.moleculeCountVisibleProperty.link( function( visible ) {
      moleculeCountNode.visible = visible;
    } );

    // beaker controls
    var beakerControls = new BeakerControls( viewProperties.ratioVisibleProperty, viewProperties.moleculeCountVisibleProperty );

    // pH meter
    var pHMeterNode = new SolutionsPHMeterNode( model.solution.pHProperty, true );

    // graph
    var graphNode = new SolutionsGraphNode( model.solution, viewProperties.graphUnitsProperty );
    var graphExpandCollapseBar = new ExpandCollapseBar( graphString, viewProperties.graphVisibleProperty, {
      barWidth: graphNode.width,
      buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH
    } );
    viewProperties.graphVisibleProperty.link( function( visible ) {
      graphNode.visible = visible;
    } );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      viewProperties.reset();
    } );

    // Rendering order
    rootNode.addChild( waterFluidNode );
    rootNode.addChild( waterFaucetNode );
    rootNode.addChild( drainFluidNode );
    rootNode.addChild( drainFaucetNode );
    rootNode.addChild( dropperFluidNode );
    rootNode.addChild( dropperNode );
    rootNode.addChild( solutionNode );
    rootNode.addChild( ratioNode );
    rootNode.addChild( beakerNode );
    rootNode.addChild( moleculeCountNode );
    rootNode.addChild( volumeIndicatorNode );
    rootNode.addChild( beakerControls );
    rootNode.addChild( pHMeterNode );
    rootNode.addChild( graphNode );
    rootNode.addChild( graphExpandCollapseBar );
    rootNode.addChild( resetAllButton );
    rootNode.addChild( soluteComboBox );
    rootNode.addChild( soluteListParent ); // last, so that combo box list is on top

    // Layout
    ratioNode.centerX = beakerNode.centerX; //TODO delete
    ratioNode.centerY = beakerNode.top + ( 0.3 * beakerNode.height ); //TODO delete
    moleculeCountNode.centerX = mvt.modelToViewX( model.beaker.location.x );
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = mvt.modelToViewX( model.beaker.location.x );
    beakerControls.top = beakerNode.bottom + 15;
    soluteComboBox.left = mvt.modelToViewX( model.beaker.left ) - 50; // anchor on left so it grows to the right during i18n
    soluteComboBox.top = this.layoutBounds.top + 15;
    pHMeterNode.top = 20;
    pHMeterNode.right = drainFaucetNode.left - 40;
    graphExpandCollapseBar.right = pHMeterNode.left - 20;
    graphExpandCollapseBar.top = pHMeterNode.top;
    graphNode.centerX = graphExpandCollapseBar.centerX;
    graphNode.top = graphExpandCollapseBar.bottom + 10;
    resetAllButton.left = beakerControls.right + 30;
    resetAllButton.centerY = beakerControls.centerY;
  }

  return inherit( ScreenView, SolutionsView, { layoutBounds: PHScaleConstants.LAYOUT_BOUNDS } );
} );
