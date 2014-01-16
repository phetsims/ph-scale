// Copyright 2002-2014, University of Colorado Boulder

/**
 * Renders text that contains subscripts and superscripts. This is intended primarily to render
 * chemical formulae (e.g., 'H<sub>3</sub>O<sup>+</sup>') and 'power-of-ten' numbers (e.g. '4.2 x 10<sup>8</sup>').
 * Uses HTML markup, ignores all tags except <sub> and <sup> tags.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  function SubSupText( text, options ) {

    options = _.extend( {
      //TODO defaults for scenery.Text options
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // break text into subscripts, superscripts, and plain-text tokens
    var i, c;
    for ( i = 0; i < text.length; i++ ) {
      c = text.charAt( i );
      //TODO look for <sub>, </sub>, <sup> and </sup> tags, ignore other HTML tags
    }

    // create a scenery.Text for each token

    thisNode.mutate( options );
  }

  return inherit( Node, SubSupText, {
    //TODO prototype functions for setting scenery.Text attributes
  } );
} );
