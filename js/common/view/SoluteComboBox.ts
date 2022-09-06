// Copyright 2013-2022, University of Colorado Boulder

/**
 * Combo box for choosing a solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import phScale from '../../phScale.js';
import Solute from '../model/Solute.js';

type SelfOptions = EmptySelfOptions;

export type SoluteComboBoxOptions = SelfOptions &
  PickRequired<ComboBoxOptions, 'tandem'> &
  PickOptional<ComboBoxOptions, 'maxWidth'>;

export default class SoluteComboBox extends ComboBox<Solute> {

  public constructor( selectedSoluteProperty: Property<Solute>,
                      solutes: Solute[], soluteListParent: Node,
                      providedOptions: SoluteComboBoxOptions ) {

    const options = optionize<SoluteComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // ComboBoxOptions
      listPosition: 'below',
      xMargin: 16,
      yMargin: 16,
      highlightFill: 'rgb( 218, 255, 255 )',
      buttonLineWidth: 2,
      cornerRadius: 10
    }, providedOptions );

    const items: ComboBoxItem<Solute>[] = [];
    const textNodes: Text[] = [];
    let maxWidth = 0; // max width of Text nodes

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
      //TODO https://github.com/phetsims/ph-scale/issues/239 support for dynamic locale
      solute.nameProperty.link( name => {
        textNode.text = name;
      } );

      const hBox = new HBox( {
        spacing: 5,
        children: [ colorNode, textNode ]
      } );

      items.push( {
        value: solute,
        node: hBox,
        tandemName: `${solute.tandemName}${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
      } );
    } );

    // ComboBox does not dynamically resize. So if a solution name does change, constrain the listbox item width.
    // See https://github.com/phetsims/ph-scale/issues/110
    //TODO https://github.com/phetsims/ph-scale/issues/239 support for dynamic locale
    textNodes.forEach( textNode => {
      textNode.maxWidth = maxWidth;
    } );

    super( selectedSoluteProperty, items, soluteListParent, options );
  }
}

phScale.register( 'SoluteComboBox', SoluteComboBox );