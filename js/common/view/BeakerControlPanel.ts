// Copyright 2013-2022, University of Colorado Boulder

/**
 * Controls for things that you see in the beaker.
 * This includes the 'H3O+/OH- ratio' and 'Molecule count' checkboxes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText, Text, VBox, VDivider } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const FONT = new PhetFont( 20 );

type SelfOptions = EmptySelfOptions;

type BeakerControlPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem' | 'maxWidth'>;

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
    const ratioStringProperty = new DerivedProperty(
      [ PhScaleStrings.ratioStringProperty ],
      ( ratioString: string ) => StringUtils.fillIn( `{{h3o}} / {{oh}} ${ratioString} `, {
        h3o: `<span style="color:${PHScaleColors.H3O_MOLECULES.toCSS()}">${PHScaleConstants.H3O_FORMULA}</span>`,
        oh: `<span style="color:${PHScaleColors.OH_MOLECULES.toCSS()}">${PHScaleConstants.OH_FORMULA}</span>`
      } ) );
    const ratioText = new RichText( ratioStringProperty, {
      font: FONT
    } );
    const ratioCheckbox = new Checkbox( ratioVisibleProperty, ratioText, {
      tandem: options.tandem.createTandem( 'ratioCheckbox' )
    } );
    ratioCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    // 'Molecule count' checkbox
    const moleculeCountLabelText = new Text( PhScaleStrings.moleculeCountStringProperty, { font: FONT } );
    const moleculeCountCheckbox = new Checkbox( moleculeCountVisibleProperty, moleculeCountLabelText, {
      tandem: options.tandem.createTandem( 'moleculeCountCheckbox' )
    } );
    moleculeCountCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    const divider = new VDivider( {
      tandem: options.tandem.createTandem( 'divider' )
    } );

    const content = new VBox( {
      children: [ ratioCheckbox, divider, moleculeCountCheckbox ],
      align: 'left',
      spacing: 10
    } );

    super( content, options );
  }
}

phScale.register( 'BeakerControlPanel', BeakerControlPanel );