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
  var Shape = require( 'KITE/Shape' );
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
      barFill: 'rgb(135,19,70)',
      barStroke: null,
      titleFont: new PhetFont( { size: 18, weight: 'bold' } ),
      titleFill: 'white'
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
    var titleOptions = { font: options.titleFont, fill: options.titleFill };
    this.titleNode = new Text( title, titleOptions ); // private
    thisNode.addChild( this.titleNode );
    this.titleNode.left = barNode.left + options.xMargin;
    this.titleNode.centerY = barNode.centerY;
    
    // expand/collapse button
    var button = new ExpandCollapseButton( 0.7 * options.size.height, visibleProperty );
    thisNode.addChild( button );
    button.right = barNode.right - options.xMargin;
    button.centerY = barNode.centerY;
    button.touchArea = Shape.bounds( button.localBounds.dilatedXY( 10, 10 ) );
  }

  return inherit( Node, ExpandCollapseBar, {
    setTitle: function( title ) {
      this.titleNode.text = title;
    }
  } );
} );
