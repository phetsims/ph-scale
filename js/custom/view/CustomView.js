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
  var inherit = require( 'PHET_CORE/inherit' );
  var MoleculeCountNode = require( 'PH_SCALE/common/view/MoleculeCountNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PHMeterNode = require( 'PH_SCALE/common/view/PHMeterNode' );
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
  function CustomView( model, mvt ) {

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

    // 'H3O+/OH- ratio' representation
    var ratioNode = new RatioNode( model.beaker, model.solution, mvt );
    viewProperties.ratioVisibleProperty.linkAttribute( ratioNode, 'visible' );

    // 'molecule count' representation
    var moleculeCountNode = new MoleculeCountNode( model.solution );
    viewProperties.moleculeCountVisibleProperty.linkAttribute( moleculeCountNode, 'visible' );

    // beaker controls
    var beakerControls = new BeakerControls( viewProperties.ratioVisibleProperty, viewProperties.moleculeCountVisibleProperty );

    // pH meter
    var pHMeterYOffset = 20;
    var pHMeterNode = new PHMeterNode( model.solution, mvt.modelToViewY( model.beaker.location.y ) - pHMeterYOffset, { isInteractive: true } );

    // graph
    var graphNode = new CustomGraphNode( model.solution );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
      viewProperties.reset();
    } );

    // Parent for all nodes added to this screen
    var rootNode = new Node( { children: [
      // nodes are rendered in this order
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
    pHMeterNode.left = mvt.modelToViewX( model.beaker.left );
    pHMeterNode.top = 20;
    moleculeCountNode.centerX = beakerNode.centerX;
    moleculeCountNode.bottom = beakerNode.bottom - 25;
    beakerControls.centerX = beakerNode.centerX;
    beakerControls.top = beakerNode.bottom + 15;
    graphNode.right = beakerNode.left - 70;
    graphNode.top = 20;
    resetAllButton.right = this.layoutBounds.right - 40;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, CustomView, { layoutBounds: PHScaleConstants.LAYOUT_BOUNDS } );
} );
