// Copyright 2013-2017, University of Colorado Boulder

/**
 * Combo box for choosing a solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var phScale = require( 'PH_SCALE/phScale' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Solute[]} solutes
   * @param {Property.<Solute>} selectedSolute
   * @param {Node} soluteListParent
   * @param {Object} [options]
   * @constructor
   */
  function SoluteComboBox( solutes, selectedSolute, soluteListParent, options ) {

    options = _.extend( {
      listPosition: 'below',
      xMargin: 16,
      yMargin: 16,
      highlightFill: 'rgb(218,255,255)',
      buttonLineWidth: 3,
      cornerRadius: 10
    }, options );

    // items
    var items = [];
    for ( var i = 0; i < solutes.length; i++ ) {
      var solute = solutes[ i ];
      items[ i ] = createItem( solute );
    }

    ComboBox.call( this, items, selectedSolute, soluteListParent, options );
  }

  phScale.register( 'SoluteComboBox', SoluteComboBox );

  /**
   * Creates an item for the combo box.
   * @param solute
   * @returns {*|{node: *, value: *}}
   */
  var createItem = function( solute ) {
    var node = new Node();

    // color chip
    var soluteColor = solute.stockColor;
    var colorNode = new Rectangle( 0, 0, 20, 20, { fill: soluteColor, stroke: soluteColor.darkerColor() } );

    // label
    var textNode = new Text( solute.name, {
      font: new PhetFont( 22 )
    } );

    node.addChild( colorNode );
    node.addChild( textNode );
    textNode.left = colorNode.right + 5;
    textNode.centerY = colorNode.centerY;
    return ComboBox.createItem( node, solute );
  };

  return inherit( ComboBox, SoluteComboBox );
} );