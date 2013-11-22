// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var ExpandCollapseBar = require( 'PH_SCALE/solutions/view/ExpandCollapseBar' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var SolutionsGraphNode = require( 'PH_SCALE/solutions/view/SolutionsGraphNode' );
  var SolutionsPHMeterNode = require( 'PH_SCALE/solutions/view/SolutionsPHMeterNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );

  /**
   * @param {BasicsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SolutionsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // view-specific properties
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
    var solventLabelNode = new Text( model.solvent.name, { font: new PhetFont( 40 ) } );
    var solventFaucetNode = new PHFaucetNode( model.solventFaucet, mvt, solventLabelNode );
    var drainFaucetNode = new PHFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // pH meter
    var pHMeterNode = new SolutionsPHMeterNode( model.pHMeter, mvt );
    var phMeterExpandCollapseBar = new ExpandCollapseBar( pHString, pHMeterVisibleProperty, {
      size: new Dimension2( 1.25 * pHMeterNode.width, 40 )
    } );
    pHMeterVisibleProperty.link( function( visible ) {
      pHMeterNode.visible = visible;
    } );
    // graph
    var graphNode = new SolutionsGraphNode(); //TODO args
    //TODO add expand-collapse bar
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
    rootNode.addChild( beakerNode );
    rootNode.addChild( volumeIndicatorNode );
    rootNode.addChild( pHMeterNode );
    rootNode.addChild( phMeterExpandCollapseBar );
    rootNode.addChild( graphNode );
    rootNode.addChild( resetAllButton );
    rootNode.addChild( soluteComboBox );
    rootNode.addChild( soluteListParent ); // last, so that combo box list is on top

    // Layout
    soluteComboBox.left = mvt.modelToViewX( model.beaker.location.x ) - 40;
    soluteComboBox.top = this.layoutBounds.top + 15;
    phMeterExpandCollapseBar.centerX = pHMeterNode.centerX;
    phMeterExpandCollapseBar.bottom = pHMeterNode.top - 15;
    graphNode.left = phMeterExpandCollapseBar.right + 60;
    graphNode.top = pHMeterNode.top;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, SolutionsView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
