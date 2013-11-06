// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Solutions' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {SolutionsModel} model
   * @constructor
   */
  function SolutionsView( model ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // Parent for all nodes added to this screen
    var rootNode = new Node();
    thisView.addChild( rootNode );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      model.reset();
    } );

    // Rendering order
    rootNode.addChild( resetAllButton );

    // Layout
    resetAllButton.right = this.layoutBounds.right - 20;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, SolutionsView );
} );
