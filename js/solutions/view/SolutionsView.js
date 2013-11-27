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
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var ExpandCollapseBar = require( 'PH_SCALE/common/view/ExpandCollapseBar' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var Property = require( 'AXON/Property' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var SolutionsGraphNode = require( 'PH_SCALE/solutions/view/SolutionsGraphNode' );
  var SolutionsPHMeterNode = require( 'PH_SCALE/solutions/view/SolutionsPHMeterNode' );
  var SolventFaucetNode = require( 'PH_SCALE/common/view/SolventFaucetNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var pHString = require( 'string!PH_SCALE/pH' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

  /**
   * @param {BasicsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SolutionsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // view-specific properties
    var ratioVisibleProperty = new Property( false );
    var moleculeCountVisibleProperty = new Property( false );
    var pHMeterVisibleProperty = new Property( true );
    var graphVisibleProperty = new Property( true );

    // Parent for all nodes added to this screen
    var rootNode = new Node();
    thisView.addChild( rootNode );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, mvt );
    var solutionNode = new SolutionNode( model.solvent, model.solution, model.beaker, mvt );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, mvt );

    // dropper
    var dropperScale = 0.85;
    var dropperNode = new DropperNode( model.dropper, mvt );
    dropperNode.setScaleMagnitude( dropperScale );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, dropperScale * dropperNode.getTipWidth(), mvt );

    // faucets
    var solventFaucetNode = new SolventFaucetNode( model.solvent, model.solventFaucet, mvt );
    var drainFaucetNode = new PHFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
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
    var pHMeterNode = new SolutionsPHMeterNode( model.solution.pHProperty );
    var pHMeterExpandCollapseBar = new ExpandCollapseBar( pHString, pHMeterVisibleProperty, {
      size: new Dimension2( 1.1 * pHMeterNode.width, 40 )
    } );
    pHMeterVisibleProperty.link( function( visible ) {
      pHMeterNode.visible = visible;
    } );

    // graph
    var graphNode = new SolutionsGraphNode(); //TODO args
    var graphExpandCollapseBar = new ExpandCollapseBar( concentrationString, graphVisibleProperty, {
      rightTitle: quantityString,
      size: new Dimension2( 1.1 * graphNode.width, 40 )
    } );
    graphVisibleProperty.link( function( visible ) {
      graphNode.visible = visible;
    } );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      pHMeterVisibleProperty.reset();
      graphVisibleProperty.reset();
    } );

    // Rendering order
    rootNode.addChild( solventFluidNode );
    rootNode.addChild( solventFaucetNode );
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
    rootNode.addChild( pHMeterExpandCollapseBar );
    rootNode.addChild( graphNode );
    rootNode.addChild( graphExpandCollapseBar );
    rootNode.addChild( resetAllButton );
    rootNode.addChild( soluteComboBox );
    rootNode.addChild( soluteListParent ); // last, so that combo box list is on top

    // Layout
    ratioNode.centerX = beakerNode.centerX; //TODO delete
    ratioNode.centerY = beakerNode.top + ( 0.3 * beakerNode.height ); //TODO delete
    moleculeCountNode.right = mvt.modelToViewX( model.beaker.right ) - 20;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 15;
    soluteComboBox.centerX = mvt.modelToViewX( model.beaker.location.x );
    soluteComboBox.top = this.layoutBounds.top + 15;
    pHMeterExpandCollapseBar.left = drainFaucetNode.right + 30;
    pHMeterExpandCollapseBar.top = 20;
    pHMeterNode.top = pHMeterExpandCollapseBar.bottom + 10;
    pHMeterNode.centerX = pHMeterExpandCollapseBar.centerX;
    graphExpandCollapseBar.left = pHMeterExpandCollapseBar.right + 20;
    graphExpandCollapseBar.top = pHMeterExpandCollapseBar.top;
    graphNode.centerX = graphExpandCollapseBar.centerX;
    graphNode.top = pHMeterNode.top;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 15;
  }

  return inherit( ScreenView, SolutionsView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
