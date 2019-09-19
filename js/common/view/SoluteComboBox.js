// Copyright 2013-2019, University of Colorado Boulder

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
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
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

      options = _.extend( {
        listPosition: 'below',
        xMargin: 16,
        yMargin: 16,
        highlightFill: 'rgb(218,255,255)',
        buttonLineWidth: 3,
        cornerRadius: 10
      }, options );

      // {ComboBoxItem[]}
      const items = solutes.map( createItem );

      super( items, selectedSolute, soluteListParent, options );
    }
  }

  phScale.register( 'SoluteComboBox', SoluteComboBox );

  /**
   * Creates an item for the combo box.
   * @param {Solute} solute
   * @returns {ComboBoxItem}
   */
  function createItem( solute ) {

    // color chip
    const soluteColor = solute.stockColor;
    const colorNode = new Rectangle( 0, 0, 20, 20, {
      fill: soluteColor,
      stroke: soluteColor.darkerColor()
    } );

    // label
    const textNode = new Text( solute.name, {
      font: new PhetFont( 22 )
    } );

    const hBox = new HBox( {
      spacing: 5,
      children: [ colorNode, textNode ]
    } );

    return new ComboBoxItem( hBox, solute );
  }

  return SoluteComboBox;
} );