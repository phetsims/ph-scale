// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Custom' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {CustomModel} model
   * @constructor
   */
  function CustomView( model ) {

    var thisView = this;
    ScreenView.call( thisView, { renderer: 'svg' } );

    // Parent for all nodes added to this screen
    var rootNode = new Node();
    thisView.addChild( rootNode );

    var underConstruction = new Text( 'Custom: Under Construction', new PhetFont( 30 ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( function() {
      model.reset();
    } );

    // Rendering order
    rootNode.addChild( underConstruction );
    rootNode.addChild( resetAllButton );

    // Layout
    underConstruction.centerX = this.layoutBounds.centerX;
    underConstruction.centerY = this.layoutBounds.centerY;
    resetAllButton.right = this.layoutBounds.right - 20;
    resetAllButton.bottom = this.layoutBounds.bottom - 20;
  }

  return inherit( ScreenView, CustomView, { layoutBounds: new Bounds2( 0, 0, 1100, 700 ) } );
} );
