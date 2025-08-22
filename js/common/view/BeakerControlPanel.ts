// Copyright 2013-2025, University of Colorado Boulder

/**
 * Controls for things that you see in the beaker.
 * This includes the 'H3O+/OH- Ratio' and 'Particle Counts' checkboxes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const FONT = new PhetFont( 20 );
const CHECKBOX_TOUCH_AREA_X_DILATION = 10;
const CHECKBOX_TOUCH_AREA_Y_DILATION = 6;

type SelfOptions = {
  textMaxWidth: number;
  checkboxWidth: number; // width of the checkbox
};

type BeakerControlPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class BeakerControlPanel extends Panel {

  public constructor( ratioVisibleProperty: Property<boolean>, particleCountsVisibleProperty: Property<boolean>,
                      providedOptions: BeakerControlPanelOptions ) {

    const options = optionize<BeakerControlPanelOptions, SelfOptions, PanelOptions>()( {

      // PanelOptions
      xMargin: 15,
      yMargin: 10,
      lineWidth: 2,
      fill: PHScaleColors.panelFillProperty,
      phetioDocumentation: 'control panel that appears below the beaker',
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // 'H3O+ / OH- Ratio' checkbox
    const ratioText = new RichText( new PatternStringProperty( PhScaleStrings.pattern.H3O.OH.ratioStringProperty, {

      H3O: `<span style="color:${PHScaleColors.H3O_PARTICLES.toCSS()}">${PHScaleConstants.H3O_FORMULA}</span>`,
      OH: `<span style="color:${PHScaleColors.OH_PARTICLES.toCSS()}">${PHScaleConstants.OH_FORMULA}</span>`,
      ratio: PhScaleStrings.ratioStringProperty
    } ), {
      font: FONT,
      maxWidth: options.textMaxWidth
    } );

    const ratioCheckbox = new Checkbox( ratioVisibleProperty, ratioText, {
      touchAreaXDilation: CHECKBOX_TOUCH_AREA_X_DILATION,
      touchAreaYDilation: CHECKBOX_TOUCH_AREA_Y_DILATION,
      accessibleName: PhScaleStrings.a11y.beakerControls.ratioCheckbox.accessibleNameStringProperty,
      accessibleHelpText: PhScaleStrings.a11y.beakerControls.ratioCheckbox.accessibleHelpTextStringProperty,
      tandem: options.tandem.createTandem( 'ratioCheckbox' )
    } );

    // 'Particle Counts' checkbox
    const particleCountsText = new Text( PhScaleStrings.particleCountsStringProperty, {
      font: FONT,
      maxWidth: options.textMaxWidth
    } );
    const particleCountsCheckbox = new Checkbox( particleCountsVisibleProperty, particleCountsText, {
      touchAreaXDilation: CHECKBOX_TOUCH_AREA_X_DILATION,
      touchAreaYDilation: CHECKBOX_TOUCH_AREA_Y_DILATION,
      accessibleHelpText: PhScaleStrings.a11y.beakerControls.particleCountsCheckbox.accessibleHelpTextStringProperty,
      tandem: options.tandem.createTandem( 'particleCountsCheckbox' )
    } );
    particleCountsCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    const content = new VBox( {
      children: [
        ratioCheckbox,
        new HSeparator(),
        particleCountsCheckbox
      ],
      align: 'left',
      spacing: 10
    } );

    super( content, options );
  }
}

phScale.register( 'BeakerControlPanel', BeakerControlPanel );