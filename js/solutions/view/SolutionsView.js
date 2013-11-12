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
  var DropperNode = require( 'PH_SCALE/common/view/DropperNode' );
  var FaucetFluidNode = require( 'PH_SCALE/common/view/FaucetFluidNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

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

    // dropper
    var dropperNode = new DropperNode( model.dropper, model.soluteProperty, mvt );

    // faucets
    var solventFaucetNode = new PHFaucetNode( model.solventFaucet, mvt );
    var drainFaucetNode = new PHFaucetNode( model.drainFaucet, mvt );
    var SOLVENT_FLUID_HEIGHT = model.beaker.location.y - model.solventFaucet.location.y;
    var DRAIN_FLUID_HEIGHT = 1000; // tall enough that resizing the play area is unlikely to show bottom of fluid
    var solventFluidNode = new FaucetFluidNode( model.solventFaucet, model.solution.solvent, SOLVENT_FLUID_HEIGHT, mvt );
    var drainFluidNode = new FaucetFluidNode( model.drainFaucet, model.solution, DRAIN_FLUID_HEIGHT, mvt );

    var resetAllButton = new ResetAllButton( function() {
      model.reset();
    } );

    // Rendering order
    rootNode.addChild( beakerNode );
    rootNode.addChild( dropperNode );
    rootNode.addChild( solventFaucetNode );
    rootNode.addChild( drainFaucetNode );
    rootNode.addChild( solventFluidNode );
    rootNode.addChild( drainFluidNode );
    rootNode.addChild( resetAllButton );

    // Layout
    resetAllButton.right = this.layoutBounds.right - 20;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, SolutionsView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
