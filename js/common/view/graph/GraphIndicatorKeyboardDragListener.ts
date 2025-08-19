// Copyright 2022-2025, University of Colorado Boulder

/**
 * Keyboard drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import SoundKeyboardDragListener from '../../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import ValueChangeUtterance from '../../../../../utterance-queue/js/ValueChangeUtterance.js';
import phScale from '../../../phScale.js';
import { ConcentrationValue, PHValue } from '../../model/PHModel.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphIndicatorDragListener from './GraphIndicatorDragListener.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';

// CONSTANTS
const MANTISSA_DELTA = 1; // delta for mantissa when dragging up or down
const SHIFT_MANTISSA_DELTA = 0.1; // delta for mantissa when shift is pressed while dragging up or down
export default class GraphIndicatorKeyboardDragListener extends SoundKeyboardDragListener {

  /**
   * @param graphIndicatorNode
   * @param pHProperty - pH of the solution
   * @param totalVolumeProperty - volume of the solution
   * @param graphUnitsProperty
   * @param yToValue - converts a y view coordinate to a model value
   * @param valueToY - converts a model value to a y view coordinate
   * @param concentrationToPH - converts concentration to pH
   * @param concentrationProperty - the concentration of the solute in the solution, used for CONCENTRATION graph units
   * @param molesToPH - converts moles + volume to pH
   * @param quantityProperty - the quantity of the solute in the solution, used for MOLES graph units
   * @param objectResponseStringProperty - for a11y
   * @param tandem
   */
  // TODO: This constructor is very long, consider refactoring to reduce the number of parameters, see https://github.com/phetsims/ph-scale/issues/323
  public constructor( graphIndicatorNode: GraphIndicatorNode,
                      pHProperty: Property<number>,
                      totalVolumeProperty: TReadOnlyProperty<number>,
                      graphUnitsProperty: EnumerationProperty<GraphUnits>,
                      // TODO: Consider combining yToValue and valueToY into one module, see https://github.com/phetsims/ph-scale/issues/323
                      yToValue: ( y: number ) => number,
                      valueToY: ( value: number ) => number,
                      concentrationToPH: ( concentration: ConcentrationValue ) => PHValue,
                      concentrationProperty: TReadOnlyProperty<ConcentrationValue>,
                      molesToPH: ( moles: number, volume: number ) => PHValue,
                      quantityProperty: TReadOnlyProperty<ConcentrationValue>,
                      objectResponseStringProperty: TReadOnlyProperty<string>,
                      tandem: Tandem ) {
    const objectResponseUtterance = new ValueChangeUtterance( {
      alert: objectResponseStringProperty
    } );

    // TODO: Would some unit tests be helpful here, to guarantee behavior? See https://github.com/phetsims/ph-scale/issues/323
    // TODO: Should we move this and its inverse to dot? See https://github.com/phetsims/ph-scale/issues/323
    const toScientificNotation = ( value: number ) => {

      // TODO: Should we affirm that the value is nonzero? see https://github.com/phetsims/ph-scale/issues/323
      const absoluteValue = Math.abs( value );

      // TODO: Should we just use Math.log10? See https://github.com/phetsims/ph-scale/issues/323
      const exponent = Math.floor( Math.log( absoluteValue ) / Math.log( 10 ) );

      // TODO: Will this be incorrect rounding makes the mantissa hit 10? See https://github.com/phetsims/ph-scale/issues/323
      const mantissa = toFixedNumber( absoluteValue / Math.pow( 10, exponent ), PHScaleConstants.PH_METER_DECIMAL_PLACES );

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

        // TODO: If we use affirm, we will not need the type assertion below, see https://github.com/phetsims/ph-scale/issues/323
        assert && assert( valueProperty.value !== null, 'valueProperty should not be null in the My Solution screen' );

        // Adjust the mantissa by the appropriate delta and convert back to a value
        const scientificNotation = toScientificNotation( valueProperty.value! );

        // If the mantissa is 1, and we are moving down the scale, we need to adjust the exponent instead of the mantissa
        if ( scientificNotation.mantissa === 1 && listener.movingDown() ) {
          scientificNotation.exponent -= 1;
          scientificNotation.mantissa = 10; // Mantissa is now 10, so we can drag down again
        }
        const newValue = scientificNotationToValue( { mantissa: scientificNotation.mantissa + mantissaDelta, exponent: scientificNotation.exponent } );
        const newShiftValue = scientificNotationToValue( {
          mantissa: scientificNotation.mantissa + shiftMantissaDelta,
          exponent: scientificNotation.exponent
        } );

        // Set the drag deltas for the listener to use during the drag
        listener.dragDelta = Math.abs( graphIndicatorNode.y - valueToY( newValue ) );
        listener.shiftDragDelta = Math.abs( graphIndicatorNode.y - valueToY( newShiftValue ) );
      },
      drag: ( event, listener ) => {
        GraphIndicatorDragListener.doDrag( graphIndicatorNode.y + listener.modelDelta.y, graphIndicatorNode, objectResponseUtterance,
          pHProperty, totalVolumeProperty.value, graphUnitsProperty.value, yToValue, concentrationToPH, molesToPH );
      },
      tandem: tandem
    } );
  }
}

phScale.register( 'GraphIndicatorKeyboardDragListener', GraphIndicatorKeyboardDragListener );