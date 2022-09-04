// Copyright 2013-2022, University of Colorado Boulder

/**
 * Controls for things that you see in the beaker.
 * This includes the 'H3O+/OH- ratio' and 'Molecule count' checkboxes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const FONT = new PhetFont( 20 );

type SelfOptions = EmptySelfOptions;

export type BeakerControlPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class BeakerControlPanel extends Panel {

  public constructor( ratioVisibleProperty: Property<boolean>, moleculeCountVisibleProperty: Property<boolean>,
                      providedOptions: BeakerControlPanelOptions ) {

    const options = optionize<BeakerControlPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 15,
      yMargin: 10,
      lineWidth: 2,
      fill: PHScaleColors.PANEL_FILL,
      phetioDocumentation: 'control panel that appears below the beaker'
    }, providedOptions );

    // 'H3O+ / OH- Ratio' checkbox, with color-coded symbols
    assert && assert( PHScaleColors.H3O_MOLECULES instanceof Color );
    assert && assert( PHScaleColors.OH_MOLECULES instanceof Color );
    const ratioString = StringUtils.fillIn( `{{h3o}} / {{oh}} ${phScaleStrings.ratio} `, {
      h3o: `<span style="color:${PHScaleColors.H3O_MOLECULES.toCSS()}">${PHScaleConstants.H3O_FORMULA}</span>`,
      oh: `<span style="color:${PHScaleColors.OH_MOLECULES.toCSS()}">${PHScaleConstants.OH_FORMULA}</span>`
    } );
    const ratioText = new RichText( ratioString, {
      font: FONT
    } );
    const ratioCheckbox = new Checkbox( ratioVisibleProperty, ratioText, {
      tandem: options.tandem.createTandem( 'ratioCheckbox' )
    } );
    ratioCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    // 'Molecule count' checkbox
    const moleculeCountLabelText = new Text( phScaleStrings.moleculeCountStringProperty, { font: FONT } );
    const moleculeCountCheckbox = new Checkbox( moleculeCountVisibleProperty, moleculeCountLabelText, {
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