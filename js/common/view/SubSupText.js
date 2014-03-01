// Copyright 2002-2014, University of Colorado Boulder

/**
 * Renders text that contains subscripts and superscripts. This is intended primarily to render
 * chemical formulas (e.g., 'H<sub>3</sub>O<sup>+</sup>') and numbers in scientific notation (e.g. '4.2 x 10<sup>8</sup>').
 * Text must be provided in HTML format, and may contain only plaintext, <sub> and <sup>.
 * Each <sub> and <sup> tag must be preceded by plaintext, and nesting of tags is not supported.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  function SubSupText( text, options ) {

    // defaults
    options = _.extend( {
      fill: 'black', // used for all text
      font: new PhetFont( 20 ), // font used for everything that's not a subscript or superscript
      // plain text
      textXSpacing: 2,
      // subscripts
      subScale: 0.75,
      subXSpacing: 2,
      subYOffset: 5, // y-offset from baseline
      // superscripts
      supScale: 0.75,
      supXSpacing: 2,
      supYOffset: 5 // offset of superscript's center from top of plaintext
    }, options );

    // scenery.Text properties with setters and getters
    this._text = text; // @private
    this._options = options; // @private

    Node.call( this );

    // Single parent for all Text nodes, so that we can change properties without affecting children added by clients.
    this._textParent = new Node(); // @private
    this.addChild( this._textParent );

    this.update();

    this.mutate( options ); //TODO be careful about which options are passed to supertype
  }

  return inherit( Node, SubSupText, {

    /*
     * @private
     * @throws Error if the text doesn't follow the constraints defines in the JSdoc above
     */
    update: function() {

      var thisNode = this;
      var options = thisNode._options;

      thisNode._textParent.removeAllChildren();

      var node, previousNode, previousNodeType;
      $( $.parseHTML( thisNode._text ) ).each( function( index, element ) {
        if ( element.nodeType === 3 ) {
          // Text
          node = new Text( element.nodeValue, { font: options.font, fill: options.fill } );
          thisNode._textParent.addChild( node );
          if ( previousNode ) {
            node.left = previousNode.right + options.textXSpacing;
          }
        }
        else if ( element.nodeType === 1 ) {
          // Element
          if ( previousNodeType !== 3 ) {
            throw new Error( 'sub or sup element must be preceded by text' );
          }

          if ( element.tagName === 'SUB' ) {
            node = new Text( element.innerHTML, { font: options.font, fill: options.fill, scale: options.subScale } );
            thisNode._textParent.addChild( node );
            node.left = previousNode.right + options.subXSpacing;
            node.centerY = previousNode.y; // center on baseline
          }
          else if ( element.tagName === 'SUP' ) {
            node = new Text( element.innerHTML, { font: options.font, fill: options.fill, scale: options.supScale } );
            thisNode._textParent.addChild( node );
            node.left = previousNode.right + options.supXSpacing;
            node.centerY = previousNode.top + options.supYOffset; // center at top of plaintext
          }
          else {
            throw new Error( 'unsupported tagName: ' + element.tagName );
          }
        }
        else {
          throw new Error( 'unsupported nodeType: ' + element.nodeType );
        }
        previousNode = node;
        previousNodeType = element.nodeType;
      } );
    },

    //TODO add setters and getters for other scenery.Text properties as needed

    // text ----------------------------------------------------------

    setText: function( text ) {
      this._text = text;
      this.update();
    },

    getText: function() { return this._text; },

    // ES5
    set text( value ) { this.setText( value ); },
    get text() { return this.getText(); },

    // fill ----------------------------------------------------------

    setFill: function( fill ) {
      this._options.fill = fill;
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
