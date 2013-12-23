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
  var Dimension2 = require( 'DOT/Dimension2' );
  var DrainFaucetNode = require( 'PH_SCALE/common/view/DrainFaucetNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var GraphScale = require( 'PH_SCALE/common/view/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var PHValueNode = require( 'PH_SCALE/common/view/PHValueNode' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

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
      moleculeCountVisible: false,
      pHMeterVisible: true,
      graphVisible: true,
      graphUnits: GraphUnits.MOLES_PER_LITER,
      graphScale: GraphScale.LOGARITHMIC
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
    var dropperNode = new DropperNode( model.dropper, mvt, { showPH: true } );
    dropperNode.setScaleMagnitude( dropperScale );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, dropperScale * dropperNode.getTipWidth(), mvt );

    // drain faucet
    var drainFaucetNode = new DrainFaucetNode( model.drainFaucet, mvt );
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
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
    var pHMeterNode = new PHValueNode( model.solution.pHProperty );

    // graph
    var graphNode = new CustomGraphNode( model.solution, viewProperties.graphUnitsProperty, viewProperties.graphScaleProperty );
    var graphExpandCollapseBar = new ExpandCollapseBar( concentrationString, viewProperties.graphVisibleProperty, {
      rightTitle: quantityString,
      size: new Dimension2( graphNode.width, 40 )
    } );
    viewProperties.graphVisibleProperty.link( function( visible ) {
      graphNode.visible = visible;
    } );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      viewProperties.reset();
    } );

    // Rendering order
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

    // Layout of nodes that don't have a location specified in the model
    pHMeterNode.left = beakerNode.right - 20;
    pHMeterNode.bottom = beakerNode.top - 30;
    ratioNode.centerX = beakerNode.centerX; //TODO delete
    ratioNode.centerY = beakerNode.top + ( 0.3 * beakerNode.height ); //TODO delete
    moleculeCountNode.centerX = mvt.modelToViewX( model.beaker.location.x );
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = mvt.modelToViewX( model.beaker.location.x );
    beakerControls.top = beakerNode.bottom + 15;
    graphExpandCollapseBar.right = drainFaucetNode.left - 50;
    graphExpandCollapseBar.top = 20;
    graphNode.centerX = graphExpandCollapseBar.centerX;
    graphNode.top = graphExpandCollapseBar.bottom + 20;
    resetAllButton.left = beakerControls.right + 30;
    resetAllButton.centerY = beakerControls.centerY;
  }

  return inherit( ScreenView, BasicsView, { layoutBounds: PHScaleConstants.LAYOUT_BOUNDS } );
} );
