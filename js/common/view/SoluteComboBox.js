// Copyright 2013-2021, University of Colorado Boulder

/**
 * Combo box for choosing a solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';

class SoluteComboBox extends ComboBox {

  /**
   * @param {Property.<Solute>} selectedSolute
   * @param {Solute[]} solutes
   * @param {Node} soluteListParent
   * @param {Object} [options]
   * @constructor
   */
  constructor( selectedSolute, solutes, soluteListParent, options ) {

    options = merge( {
      listPosition: 'below',
      xMargin: 16,
      yMargin: 16,
      highlightFill: 'rgb( 218, 255, 255 )',
      buttonLineWidth: 2,
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
      const textNode = new Text( solute.nameProperty.get(), {
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
        tandemName: `${solute.tandemName}Item` // Item suffix is required by ComboBoxItem
      } ) );
    } );

    // ComboBox does not dynamically resize. So if a solution name does change, constrain the listbox item width.
    // See https://github.com/phetsims/ph-scale/issues/110
    textNodes.forEach( textNode => {
      textNode.maxWidth = maxWidth;
    } );

    super( selectedSolute, items, soluteListParent, options );
  }
}

phScale.register( 'SoluteComboBox', SoluteComboBox );
export default SoluteComboBox;