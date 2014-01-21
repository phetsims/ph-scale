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
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );

  function SubSupText( text, options ) {
    var thisNode = this;
    HTMLText.call( thisNode, text, options ); //TODO use HTMLText for now
  }

  return inherit( HTMLText, SubSupText, {
    //TODO prototype functions for setting scenery.Text attributes
  } );
} );
