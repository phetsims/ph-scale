// Copyright 2013-2022, University of Colorado Boulder

/**
 * Controls what you see in the beaker.
 * This includes the 'H3O+/OH- ratio' and 'Molecule count' representations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const FONT = new PhetFont( 20 );

class BeakerControlPanel extends Panel {

  /**
   * @param {Property.<boolean>} ratioVisibleProperty
   * @param {Property.<boolean>} moleculeCountVisibleProperty
   * @param {Object} [options]
   */
  constructor( ratioVisibleProperty, moleculeCountVisibleProperty, options ) {

    options = merge( {
      xMargin: 15,
      yMargin: 10,
      lineWidth: 2,
      fill: PHScaleColors.PANEL_FILL,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'control panel that appears below the beaker'
    }, options );

    // 'H3O+ / OH- Ratio' checkbox, with color-coded symbols
    assert && assert( PHScaleColors.H3O_MOLECULES instanceof Color );
    assert && assert( PHScaleColors.OH_MOLECULES instanceof Color );
    const ratioString = StringUtils.fillIn( `{{h3o}} / {{oh}} ${phScaleStrings.ratio} `, {
      h3o: `<span style="color:${PHScaleColors.H3O_MOLECULES.toCSS()}">${PHScaleConstants.H3O_FORMULA}</span>`,
      oh: `<span style="color:${PHScaleColors.OH_MOLECULES.toCSS()}">${PHScaleConstants.OH_FORMULA}</span>`
    } );
    const ratioLabel = new RichText( ratioString, {
      font: FONT
    } );
    const ratioCheckbox = new Checkbox( ratioVisibleProperty, ratioLabel, {
      tandem: options.tandem.createTandem( 'ratioCheckbox' )
    } );
    ratioCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    // 'Molecule count' checkbox
    const moleculeCountLabel = new Text( phScaleStrings.moleculeCount, { font: FONT } );
    const moleculeCountCheckbox = new Checkbox( moleculeCountVisibleProperty, moleculeCountLabel, {
      tandem: options.tandem.createTandem( 'moleculeCountCheckbox' )
    } );
    moleculeCountCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    const separator = new Line( 0, 0, Math.max( moleculeCountCheckbox.width, ratioCheckbox.width ), 0, {
      stroke: 'gray',
      tandem: options.tandem.createTandem( 'separator' )
    } );

    const content = new VBox( {
      children: [ ratioCheckbox, separator, moleculeCountCheckbox ],
      align: 'left',
      spacing: 10
    } );

    super( content, options );
  }
}

phScale.register( 'BeakerControlPanel', BeakerControlPanel );
export default BeakerControlPanel;