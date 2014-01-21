// Copyright 2002-2014, University of Colorado Boulder

/**
 * Zoom button, has an icon with a magnifying glass, with either a plus or minus sign in the center of the glass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Line = require( 'SCENERY/nodes/Line' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );

  function ZoomButton( options ) {

    options = _.extend( {
      in: true, // true: zoom-in button, false: zoom-out button
      radius: 15
    }, options );

    // the magnifying glass
    var glassNode = new Circle( options.radius, { fill: 'white', stroke: 'black', lineWidth: options.radius / 4 } );

    // handle at lower-left of glass, at a 45-degree angle
    var handleNode = new Line( options.radius * Math.cos( Math.PI / 4 ), options.radius * Math.sin( Math.PI / 4 ),
      options.radius * Math.cos( Math.PI / 4 ) + ( 0.65 * options.radius ), options.radius * Math.sin( Math.PI / 4 ) + ( 0.65 * options.radius ),
      { stroke: 'black', lineWidth: 0.4 * options.radius, lineCap: 'round' } );

    // plus or minus sign in middle of magnifying glass
    var signOptions = { size: new Dimension2( 1.3 * options.radius, options.radius / 3 ), centerX: glassNode.centerX, centerY: glassNode.centerY };
    var signNode = options.in ? new PlusNode( signOptions ) : new MinusNode( signOptions );

    RectanglePushButton.call( this, new Node( { children: [ handleNode, glassNode, signNode ] } ) );
  }

  return inherit( RectanglePushButton, ZoomButton );
} );
