// Copyright 2002-2013, University of Colorado Boulder

/**
 * Horizontal bar placed above UI components that can be shown/hidden.
 * (It would have been nice to use sun.AccordionBox, but this sim's design specified a very different look.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Node} titleNode
   * @param {Property<Boolean>} visibleProperty
   * @param {*} options
   * @constructor
   */
  function ExpandCollapseBar( titleNode, visibleProperty, options ) {

    options = _.extend( {
      buttonLength: 15,
      cornerRadius: 6,
      xMargin: 10,
      yMargin: 8,
      barWidth: 220,
      barFill: 'rgb(222,222,222)',
      barStroke: 'black',
      barLineWidth: 1
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // expand/collapse button
    var button = new ExpandCollapseButton( options.buttonLength, visibleProperty );
    button.touchArea = Shape.bounds( button.localBounds.dilatedXY( 10, 10 ) );

    // bar
    var barHeight = Math.max( button.height, titleNode.height ) + ( 2 * options.yMargin );
    var barNode = new Rectangle( 0, 0, options.barWidth, barHeight, options.cornerRadius, options.cornerRadius, {
      fill: options.barFill,
      stroke: options.barStroke,
      lineWidth: options.barLineWidth
    } );

    // rendering order
    thisNode.addChild( barNode );
    thisNode.addChild( titleNode );
    thisNode.addChild( button );

    // layout
    titleNode.left = barNode.left + options.xMargin;
    titleNode.centerY = barNode.centerY;
    button.right = barNode.right - options.xMargin;
    button.centerY = barNode.centerY;
  }

  return inherit( Node, ExpandCollapseBar );
} );
