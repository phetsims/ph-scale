// Copyright 2013-2020, University of Colorado Boulder

/**
 * Combo box for choosing a solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );

  class SoluteComboBox extends ComboBox {

    /**
     * @param {Solute[]} solutes
     * @param {Property.<Solute>} selectedSolute
     * @param {Node} soluteListParent
     * @param {Object} [options]
     * @constructor
     */
    constructor( solutes, selectedSolute, soluteListParent, options ) {

      options = merge( {
        listPosition: 'below',
        xMargin: 16,
        yMargin: 16,
        highlightFill: 'rgb( 218, 255, 255 )',
        buttonLineWidth: 3,
        cornerRadius: 10,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const items = []; // {ComboBoxItem[]}
      let maxWidth = 0; // max width of Text nodes
      const textNodes = []; // {Text[]}

      // Create items for the listbox
      solutes.forEach( solute => {

        // color chip
        const colorNode = new Rectangle( 0, 0, 20, 20, {
          fill: solute.stockColor,
          stroke: solute.stockColor.darkerColor()
        } );

        // label
        const textNode = new Text( solute.nameProperty.value, {
          font: new PhetFont( 22 )
        } );
        textNodes.push( textNode );
        maxWidth = Math.max( maxWidth, textNode.width );

        // If the solute name changes, update the item.
        // See https://github.com/phetsims/ph-scale/issues/110
        solute.nameProperty.link( name => {
          textNode.text = name;
        } );

        const hBox = new HBox( {
          spacing: 5,
          children: [ colorNode, textNode ]
        } );

        items.push( new ComboBoxItem( hBox, solute, {
          tandemName: _.camelCase( solute.name )
        } ) );
      } );

      // ComboBox does not dynamically resize. So if a solution name does change, constrain the listbox item width.
      // See https://github.com/phetsims/ph-scale/issues/110
      textNodes.forEach( textNode => {
        textNode.maxWidth = maxWidth;
      } );

      super( items, selectedSolute, soluteListParent, options );
    }
  }

  return phScale.register( 'SoluteComboBox', SoluteComboBox );
} );