// Copyright 2022-2025, University of Colorado Boulder

/**
 * Keyboard drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import { ConcentrationValue, PHValue } from '../../model/PHModel.js';
import GraphIndicatorDragListener from './GraphIndicatorDragListener.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';
import ValueChangeUtterance from '../../../../../utterance-queue/js/ValueChangeUtterance.js';
import SoundKeyboardDragListener from '../../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import PHScaleConstants from '../../PHScaleConstants.js';

//CONSTANTS
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
  public constructor( graphIndicatorNode: GraphIndicatorNode,
                      pHProperty: Property<number>,
                      totalVolumeProperty: TReadOnlyProperty<number>,
                      graphUnitsProperty: EnumerationProperty<GraphUnits>,
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
    const toScientificNotation = ( value: number ) => {
      const absoluteValue = Math.abs( value );
      const exponent = Math.floor( Math.log( absoluteValue ) / Math.log( 10 ) );
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
        assert && assert( valueProperty.value !== null, 'valueProperty should not be null in the My Solution screen' );

        // Adjust the mantissa by the appropriate delta and convert back to a value
        const scientificNotation = toScientificNotation( valueProperty.value! );
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