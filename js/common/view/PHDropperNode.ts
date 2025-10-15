// Copyright 2013-2025, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 * Optionally displays the pH value on the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EyeDropperNode, { EyeDropperNodeOptions } from '../../../../scenery-phet/js/EyeDropperNode.js';
import phScale from '../../phScale.js';
import Dropper from '../model/Dropper.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import isResettingAllProperty from '../../../../scenery-phet/js/isResettingAllProperty.js';

type SelfOptions = EmptySelfOptions;

type PHDropperNodeOptions = SelfOptions & WithRequired<EyeDropperNodeOptions, 'tandem' | 'visibleProperty'>;

export default class PHDropperNode extends EyeDropperNode {

  public constructor( dropper: Dropper, modelViewTransform: ModelViewTransform2, providedOptions: PHDropperNodeOptions ) {
    const soluteStringProperty = new DynamicProperty( dropper.soluteProperty, {
      derive: 'nameProperty'
    } );
    const dropperAccessibleNameStringProperty = new PatternStringProperty( PhScaleStrings.a11y.beakerControls.dropper.accessibleNameStringProperty, {
      solute: soluteStringProperty
    } );

    const options = optionize<PHDropperNodeOptions, SelfOptions, EyeDropperNodeOptions>()( {

      // EyeDropperNodeOptions
      isDispensingProperty: dropper.isDispensingProperty,
      buttonOptions: {
        enabledProperty: dropper.enabledProperty,
        accessibleName: dropperAccessibleNameStringProperty,
        accessibleHelpText: PhScaleStrings.a11y.beakerControls.dropper.accessibleHelpTextStringProperty,
        accessibleContextResponseValueOn: PhScaleStrings.a11y.beakerControls.dropper.accessibleContextResponseOnStringProperty
      },
      cursor: null,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    // position
    this.translation = modelViewTransform.modelToViewPosition( dropper.position );

    // change fluid color when the solute changes
    dropper.soluteProperty.link( solute => {
      this.setFluidColor( solute.stockColor );
    } );

    dropper.isDispensingProperty.link( isDispensing => {
      !isDispensing && !isResettingAllProperty.value && this.addAccessibleContextResponse( PhScaleStrings.a11y.beakerControls.dropper.accessibleContextResponseOffStringProperty, { alertBehavior: 'queue' } );
    } );
  }
}

phScale.register( 'PHDropperNode', PHDropperNode );