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
  var Bounds2 = require( 'DOT/Bounds2' );
  var CustomGraphNode = require( 'PH_SCALE/custom/view/CustomGraphNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var PHValueNode = require( 'PH_SCALE/common/view/PHValueNode' );
  var Property = require( 'AXON/Property' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

  /**
   * @param {BasicsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function BasicsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // view-specific properties
    var ratioVisibleProperty = new Property( false );
    var moleculeCountVisibleProperty = new Property( false );
    var graphVisibleProperty = new Property( true );

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
    var drainFaucetNode = new PHFaucetNode( model.drainFaucet, mvt );
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // 'H3O+/OH- ratio' representation
    var ratioNode = new RatioNode( model.solution );
    ratioVisibleProperty.link( function( visible ) {
      ratioNode.visible = visible;
    } );

    // 'molecule count' representation
    var moleculeCountNode = new MoleculeCountNode( model.solution );
    moleculeCountVisibleProperty.link( function( visible ) {
      moleculeCountNode.visible = visible;
    } );

    // beaker controls
    var beakerControls = new BeakerControls( ratioVisibleProperty, moleculeCountVisibleProperty );

    // pH meter
    var pHMeterNode = new PHValueNode( model.solution.pHProperty );

    // graph
    var graphNode = new CustomGraphNode(); //TODO args
    var graphExpandCollapseBar = new ExpandCollapseBar( concentrationString, graphVisibleProperty, {
      rightTitle: quantityString,
      size: new Dimension2( 1.1 * graphNode.width, 40 )
    } );
    graphVisibleProperty.link( function( visible ) {
      graphNode.visible = visible;
    } );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      moleculeCountVisibleProperty.reset();
      ratioVisibleProperty.reset();
      graphVisibleProperty.reset();
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
    pHMeterNode.centerX = beakerNode.left;
    pHMeterNode.bottom = beakerNode.top - 30;
    ratioNode.centerX = beakerNode.centerX; //TODO delete
    ratioNode.centerY = beakerNode.top + ( 0.3 * beakerNode.height ); //TODO delete
    moleculeCountNode.right = mvt.modelToViewX( model.beaker.right ) - 20;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 30;
    graphExpandCollapseBar.left = drainFaucetNode.right + 30;
    graphExpandCollapseBar.top = 20;
    graphNode.centerX = graphExpandCollapseBar.centerX;
    graphNode.top = graphExpandCollapseBar.bottom + 10;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, BasicsView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
