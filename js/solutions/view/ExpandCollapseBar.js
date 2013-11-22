// Copyright 2002-2013, University of Colorado Boulder

/**
 * Horizontal bar placed above UI components that can be shown/hidden.
 * (It would have been nice to be able to use sun.AccordionBox, but sim's design specified a very different look.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {String} title
   * @param {Property<Boolean>} visibleProperty
   * @param {*} options
   * @constructor
   */
  function ExpandCollapseBar( title, visibleProperty, options ) {

    options = _.extend( {
      size: new Dimension2( 220, 40 ),
      cornerRadius: 6,
      xMargin: 10,
      backgroundFill: 'rgb(114,9,56)',
      backgroundStroke: null,
      textFill: 'white'
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    var backgroundNode = new Rectangle( 0, 0, options.size.width, options.size.height, options.cornerRadius, options.cornerRadius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke
    } );
    var titleNode = new Text( title, { font: new PhetFont( { size: 28, weight: 'bold' } ), fill: options.textFill } );
    var button = new ExpandCollapseButton( 0.7 * options.size.height, visibleProperty );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( titleNode );
    thisNode.addChild( button );

    // layout
    titleNode.left = backgroundNode.left + options.xMargin;
    titleNode.centerY = backgroundNode.centerY;
    button.right = backgroundNode.right - options.xMargin;
    button.centerY = backgroundNode.centerY;
  }

  return inherit( Node, ExpandCollapseBar );
} );
