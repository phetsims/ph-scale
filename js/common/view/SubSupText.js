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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function SubSupText( text, options ) {

    // defaults
    options = _.extend( {
      font: new PhetFont(),
      fill: 'black',
      subScale: 0.85, // percentage of text size
      supScale: 0.85, // percentage of text size
      subYOffset: 0.5, // percentage of text height, positive is above baseline, negative is below baseline
      supYOffset: 0.5 // percentage of text height, positive is above baseline, negative is below baseline
    }, options );

    // scenery.Text properties with setters and getters
    this._text = text; // @private
    this._font = options.font; // @private
    this._fill = options.fill; // @private

    Node.call( this );

    // Single parent for all Text nodes, so that we can change properties without affecting children added by clients.
    this._textParent = new Node(); // @private
    this.addChild( this._textParent );

    // TODO render using a single HTMLText for now
    this._textParent.addChild( new HTMLText( text, { font: options.font, fill: options.fill } ) );

    this.mutate( options ); //TODO be careful about which options are passed to supertype
  }

  return inherit( Node, SubSupText, {

    //TODO add setters and getters for other scenery.Text properties as needed

    // text ----------------------------------------------------------

    setText: function( text ) {
      this._text = text;
      var childrenCount = this._textParent.getChildrenCount();
      for ( var i = 0; i < childrenCount; i++ ) {
        this._textParent.getChildAt( i ).text = text;
      }
    },

    getText: function() { return this._text; },

    // ES5
    set text( value ) { this.setText( value ); },
    get text() { return this.getText(); },

    // font ----------------------------------------------------------

    setFont: function( font ) {
      this._font = font;
      var childrenCount = this._textParent.getChildrenCount();
      for ( var i = 0; i < childrenCount; i++ ) {
        this._textParent.getChildAt( i ).font = font;
      }
    },

    getFont: function() { return this._font; },

    // ES5
    set font( value ) { this.setFont( value ); },
    get font() { return this.getFont(); },

    // fill ----------------------------------------------------------

    setFill: function( fill ) {
      this._fill = fill;
      var childrenCount = this._textParent.getChildrenCount();
      for ( var i = 0; i < childrenCount; i++ ) {
        this._textParent.getChildAt( i ).fill = fill;
      }
    },

    getFill: function() { return this._fill; },

    // ES5
    set fill( value ) { this.setFill( value ); },
    get fill() { return this.getFill(); }
  } );
} );
