// Copyright 2013-2025, University of Colorado Boulder

/**
 * Controls for things that you see in the beaker.
 * This includes the 'H3O+/OH- Ratio' and 'Particle Counts' checkboxes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const FONT = new PhetFont( 20 );

type SelfOptions = EmptySelfOptions;

type BeakerControlPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem' | 'maxWidth'>;

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
    const ratioCheckbox = new RatioCheckbox( ratioVisibleProperty, options.tandem.createTandem( 'ratioCheckbox' ) );
    ratioCheckbox.touchArea = ratioCheckbox.localBounds.dilatedXY( 10, 6 );

    // 'Particle Counts' checkbox
    const particleCountsCheckbox = new ParticleCountsCheckbox( particleCountsVisibleProperty, options.tandem.createTandem( 'particleCountsCheckbox' ) );
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

/**
 * 'H3O+ / OH- Ratio' checkbox, with color-coded symbols
 */
class RatioCheckbox extends Checkbox {

  public constructor( ratioVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const stringProperty = new PatternStringProperty( PhScaleStrings.pattern.H3O.OH.ratioStringProperty, {
      H3O: `<span style="color:${PHScaleColors.H3O_PARTICLES.toCSS()}">${PHScaleConstants.H3O_FORMULA}</span>`,
      OH: `<span style="color:${PHScaleColors.OH_PARTICLES.toCSS()}">${PHScaleConstants.OH_FORMULA}</span>`,
      ratio: PhScaleStrings.ratioStringProperty
    }, {
      tandem: tandem.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME )
    } );

    const ratioText = new RichText( stringProperty, {
      font: FONT
    } );

    super( ratioVisibleProperty, ratioText, {
      accessibleName: new PatternStringProperty( PhScaleStrings.pattern.H3O.OH.ratioStringProperty, {
        H3O: PHScaleConstants.H3O_FORMULA,
        OH: PHScaleConstants.OH_FORMULA,
        ratio: PhScaleStrings.ratioStringProperty
      } ),
      tandem: tandem
    } );
  }
}

/**
 * 'Particle Counts' checkbox
 */
class ParticleCountsCheckbox extends Checkbox {

  public constructor( particleCountsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const text = new Text( PhScaleStrings.particleCountsStringProperty, {
      font: FONT
    } );

    super( particleCountsVisibleProperty, text, {
      tandem: tandem
    } );
  }
}

phScale.register( 'BeakerControlPanel', BeakerControlPanel );