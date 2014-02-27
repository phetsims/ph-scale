// Copyright 2002-2014, University of Colorado Boulder

/**
 * Renders text that contains subscripts and superscripts. This is intended primarily to render
 * chemical formulae (e.g., 'H<sub>3</sub>O<sup>+</sup>') and 'power-of-ten' numbers (e.g. '4.2 x 10<sup>8</sup>').
 * Uses HTML markup, ignores all tags except <sub> and <sup>.
 * Nesting of tags is not supported.
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
      fill: 'black', // used for all text
      font: new PhetFont( 20 ), // font used for everything that's not a subscript or superscript
      // subscripts
      subFont: new PhetFont( 16 ),
      subXOffset: 2,
      subYOffset: 5, // y-offset from baseline
      // superscripts
      supFont: new PhetFont( 16 ),
      supXOffset: 2,
      supYOffset: -20 // y-offset from baseline //TODO offset from cap line would be better
    }, options );

    // scenery.Text properties with setters and getters
    this._text = text; // @private
    this._font = options.font; // @private
    this._fill = options.fill; // @private

    Node.call( this );

    // Single parent for all Text nodes, so that we can change properties without affecting children added by clients.
    this._textParent = new Node(); // @private
    this.addChild( this._textParent );

    this._htmlText = new HTMLText( this._text, { font: this._font, fill: this._fill } ); //TODO delete this, use HTMLText for now
    this._textParent.addChild( this._htmlText );
    this.update();

    this.mutate( options ); //TODO be careful about which options are passed to supertype
  }

  return inherit( Node, SubSupText, {

    // @private
    update: function() {
      //TODO parse this._text and build scene graph
    },

    //TODO add setters and getters for other scenery.Text properties as needed

    // text ----------------------------------------------------------

    setText: function( text ) {
      this._text = text;
      this._htmlText.text = text; //TODO delete this
      this.update();
    },

    getText: function() { return this._text; },

    // ES5
    set text( value ) { this.setText( value ); },
    get text() { return this.getText(); },

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
