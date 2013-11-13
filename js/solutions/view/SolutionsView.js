// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Solutions' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var BeakerNode = require( 'PH_SCALE/common/view/BeakerNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var PHMeterNode = require( 'PH_SCALE/common/view/PHMeterNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoluteComboBox = require( 'PH_SCALE/common/view/SoluteComboBox' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
  var VolumeIndicatorNode = require( 'PH_SCALE/common/view/VolumeIndicatorNode' );

  /**
   * @param {SolutionsModel} model
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SolutionsView( model, mvt ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // Parent for all nodes added to this screen
    var rootNode = new Node();
    thisView.addChild( rootNode );

    // beaker
    var beakerNode = new BeakerNode( model.beaker, mvt );
    var solutionNode = new SolutionNode( model.solution, model.beaker, mvt );
    var volumeIndicatorNode = new VolumeIndicatorNode( model.solution.volumeProperty, model.beaker, mvt );

    // dropper
    var dropperNode = new DropperNode( model.dropper, mvt );
    var dropperFluidNode = new DropperFluidNode( model.dropper, model.beaker, dropperNode.getTipWidth(), mvt );

    // faucets
    var solventFaucetNode = new PHFaucetNode( model.solventFaucet, mvt );
    var drainFaucetNode = new PHFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    // pH meter
    var pHMeterNode = new PHMeterNode(  model.pHMeter, model.solution, model.solvent, model.dropper,
          solutionNode, dropperFluidNode, solventFluidNode, drainFluidNode, mvt );

    // solutes combo box
    var soluteListParent = new Node();
    var soluteComboBox = new SoluteComboBox( model.solutes, model.dropper.soluteProperty, soluteListParent );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
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
    rootNode.addChild( resetAllButton );
    rootNode.addChild( soluteComboBox );
    rootNode.addChild( soluteListParent ); // last, so that combo box list is on top

    // Layout
    soluteComboBox.left = mvt.modelToViewX( model.beaker.right ) + 20;
    soluteComboBox.top = this.layoutBounds.top + 20;
    resetAllButton.right = this.layoutBounds.right - 20;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, SolutionsView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
