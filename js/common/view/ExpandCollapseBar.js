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
      barFill: 'rgb(114,9,56)',
      barStroke: null,
      textFill: 'white',
      rightTitle: null // optional second title that appear on the right end of the bar
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // bar
    var barNode = new Rectangle( 0, 0, options.size.width, options.size.height, options.cornerRadius, options.cornerRadius, {
      fill: options.barFill,
      stroke: options.barStroke
    } );
    thisNode.addChild( barNode );

    // title on left end of bar
    var titleOptions = { font: new PhetFont( { size: 28, weight: 'bold' } ), fill: options.textFill };
    var titleNode = new Text( title, titleOptions );
    thisNode.addChild( titleNode );
    titleNode.left = barNode.left + options.xMargin;
    titleNode.centerY = barNode.centerY;
    
    // expand/collapse button
    var button = new ExpandCollapseButton( 0.7 * options.size.height, visibleProperty );
    thisNode.addChild( button );
    button.right = barNode.right - options.xMargin;
    button.centerY = barNode.centerY;

    // optional title on right end of bar
    if ( options.rightTitle !== null ) {
      var rightTitleNode = new Text( options.rightTitle, titleOptions );
      thisNode.addChild( rightTitleNode );
      rightTitleNode.right = button.left - 10;
      rightTitleNode.centerY = button.centerY;
    }
  }

  return inherit( Node, ExpandCollapseBar );
} );
