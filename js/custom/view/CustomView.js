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
  var CustomPHMeterNode = require( 'PH_SCALE/custom/view/CustomPHMeterNode' );
  var DropperFluidNode = require( 'PH_SCALE/common/view/DropperFluidNode' );
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolutionNode = require( 'PH_SCALE/common/view/SolutionNode' );
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
    var solutionNode = new SolutionNode( model.solvent, model.solution, model.beaker, mvt );
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

    // pH meter
    var pHMeterNode = new CustomPHMeterNode( model.pHMeter, mvt );

    // 'molecule count' representation
    var moleculeCountVisibleProperty = new Property( false );
    //TODO node goes here, visibility linked to moleculeCountProperty

    // 'H3O+/OH- ratio' representation
    var ratioVisibleProperty = new Property( false );
    //TODO node goes here, visibility linked to ratioVisibleProperty

    // beaker controls
    var beakerControls = new BeakerControls( moleculeCountVisibleProperty, ratioVisibleProperty );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      moleculeCountVisibleProperty.reset();
      ratioVisibleProperty.reset();
    } );

    // Rendering order
    rootNode.addChild( drainFluidNode );
    rootNode.addChild( drainFaucetNode );
    rootNode.addChild( dropperFluidNode );
    rootNode.addChild( dropperNode );
    rootNode.addChild( solutionNode );
    rootNode.addChild( beakerNode );
    rootNode.addChild( volumeIndicatorNode );
    rootNode.addChild( pHMeterNode );
    rootNode.addChild( beakerControls );
    rootNode.addChild( resetAllButton );

    // Layout
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 30;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, BasicsView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
