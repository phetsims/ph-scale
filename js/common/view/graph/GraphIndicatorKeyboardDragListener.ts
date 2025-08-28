// Copyright 2022-2025, University of Colorado Boulder

/**
 * Keyboard drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import SoundKeyboardDragListener, { SoundKeyboardDragListenerOptions } from '../../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import ValueChangeUtterance from '../../../../../utterance-queue/js/ValueChangeUtterance.js';
import phScale from '../../../phScale.js';
import { ConcentrationValue, PHValue } from '../../model/PHModel.js';
import GraphIndicatorDragListener from './GraphIndicatorDragListener.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { equalsEpsilon } from '../../../../../dot/js/util/equalsEpsilon.js';
import LogarithmicGraphNode from './LogarithmicGraphNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  scaleHeight: number; // height of the graph's scale
  objectResponseStringProperty: TReadOnlyProperty<string>; // for a11y
};

type GraphIndicatorKeyboardDragListenerOptions = SelfOptions & PickRequired<SoundKeyboardDragListenerOptions, 'tandem'>;

// CONSTANTS
const MANTISSA_DELTA = 1; // delta for mantissa when dragging up or down
const SHIFT_MANTISSA_DELTA = 0.1; // delta for mantissa when shift is pressed while dragging up or down
export default class GraphIndicatorKeyboardDragListener extends SoundKeyboardDragListener {

  /**
   * @param graphIndicatorNode
   * @param pHProperty - pH of the solution
   * @param totalVolumeProperty - volume of the solution
   * @param graphUnitsProperty
   * @param concentrationToPH - converts concentration to pH
   * @param concentrationProperty - the concentration of the solute in the solution, used for CONCENTRATION graph units
   * @param molesToPH - converts moles + volume to pH
   * @param quantityProperty - the quantity of the solute in the solution, used for MOLES graph units
   * @param providedOptions
   */
  // TODO: This constructor is very long, consider refactoring to reduce the number of parameters, see https://github.com/phetsims/ph-scale/issues/323
  public constructor( graphIndicatorNode: GraphIndicatorNode,
                      pHProperty: Property<number>,
                      totalVolumeProperty: TReadOnlyProperty<number>,
                      graphUnitsProperty: EnumerationProperty<GraphUnits>,
                      concentrationToPH: ( concentration: ConcentrationValue ) => PHValue,
                      concentrationProperty: TReadOnlyProperty<ConcentrationValue>,
                      molesToPH: ( moles: number, volume: number ) => PHValue,
                      quantityProperty: TReadOnlyProperty<ConcentrationValue>,
                      providedOptions: GraphIndicatorKeyboardDragListenerOptions ) {
    const options = providedOptions;
    const objectResponseUtterance = new ValueChangeUtterance( {
      alert: options.objectResponseStringProperty
    } );

    const toScientificNotation = ( value: number ) => {

      const absoluteValue = Math.abs( value );
      const exponent = Math.floor( Math.log10( absoluteValue ) );
      const mantissa = absoluteValue / Math.pow( 10, exponent );

      return {
        mantissa: mantissa,
        exponent: exponent
      };
    };

    const scientificNotationToValue = ( scientificNotation: { mantissa: number; exponent: number } ) => {
      return scientificNotation.mantissa * Math.pow( 10, scientificNotation.exponent );
    };
    super( {
      keyboardDragDirection: 'upDown', // constrained to vertical dragging,
      start: ( event, listener ) => {

        // Identify the direction of the drag
        const mantissaDelta = listener.movingUp() ? MANTISSA_DELTA : -MANTISSA_DELTA;
        const shiftMantissaDelta = listener.movingUp() ? SHIFT_MANTISSA_DELTA : -SHIFT_MANTISSA_DELTA;

        // Identify the value that is being dragged, based on the graph units
        const valueProperty = graphUnitsProperty.value === GraphUnits.MOLES ? quantityProperty : concentrationProperty;

        affirm( valueProperty.value !== null, 'valueProperty should not be null in the My Solution screen' );

        // Adjust the mantissa by the appropriate delta and convert back to a value
        const scientificNotation = toScientificNotation( valueProperty.value );

        // If the mantissa is 1, and we are moving down the scale, we need to adjust the exponent instead of the mantissa
        if ( equalsEpsilon( scientificNotation.mantissa, 1, 0.0001 ) && listener.movingDown() ) {
          scientificNotation.exponent -= 1;
          scientificNotation.mantissa = 10; // Mantissa is now 10, so we can drag down again
        }
        const newValue = scientificNotationToValue( { mantissa: scientificNotation.mantissa + mantissaDelta, exponent: scientificNotation.exponent } );
        const newShiftValue = scientificNotationToValue( {
          mantissa: scientificNotation.mantissa + shiftMantissaDelta,
          exponent: scientificNotation.exponent
        } );

        // Set the drag deltas for the listener to use during the drag
        listener.dragDelta = Math.abs( graphIndicatorNode.y - LogarithmicGraphNode.valueToY( newValue, options.scaleHeight ) );
        listener.shiftDragDelta = Math.abs( graphIndicatorNode.y - LogarithmicGraphNode.valueToY( newShiftValue, options.scaleHeight ) );
      },
      drag: ( event, listener ) => {
        GraphIndicatorDragListener.doDrag( graphIndicatorNode.y + listener.modelDelta.y, graphIndicatorNode, objectResponseUtterance,
          pHProperty, totalVolumeProperty.value, graphUnitsProperty.value, concentrationToPH, molesToPH, options.scaleHeight );
      },
      tandem: options.tandem
    } );
  }
}

phScale.register( 'GraphIndicatorKeyboardDragListener', GraphIndicatorKeyboardDragListener );