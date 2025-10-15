// Copyright 2014-2025, University of Colorado Boulder

/**
 * Drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ScientificNotationNode from '../../../../../scenery-phet/js/ScientificNotationNode.js';
import phScale from '../../../phScale.js';
import { ConcentrationValue, PHValue } from '../../model/PHModel.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';
import { numberOfDecimalPlaces } from '../../../../../dot/js/util/numberOfDecimalPlaces.js';
import { roundToInterval } from '../../../../../dot/js/util/roundToInterval.js';
import { clamp } from '../../../../../dot/js/util/clamp.js';
import ValueChangeUtterance from '../../../../../utterance-queue/js/ValueChangeUtterance.js';
import Utterance from '../../../../../utterance-queue/js/Utterance.js';
import SoundDragListener, { SoundDragListenerOptions } from '../../../../../scenery-phet/js/SoundDragListener.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import LogarithmicGraphNode from './LogarithmicGraphNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  scaleHeight: number; // height of the graph's scale
  objectResponseStringProperty: TReadOnlyProperty<string>; // for a11y
};
type GraphIndicatorDragListenerOptions = SelfOptions & PickRequired<SoundDragListenerOptions, 'tandem'>;
export default class GraphIndicatorDragListener extends SoundDragListener {

  /**
   * @param graphIndicatorNode
   * @param pHProperty - pH of the solution
   * @param totalVolumeProperty - volume of the solution
   * @param graphUnitsProperty
   * @param concentrationToPH - converts concentration to pH
   * @param molesToPH - converts moles + volume to pH
   * @param startCallback - called when drag starts
   * @param providedOptions
   */
  public constructor( graphIndicatorNode: GraphIndicatorNode,
                      pHProperty: Property<number>,
                      totalVolumeProperty: TReadOnlyProperty<number>,
                      graphUnitsProperty: EnumerationProperty<GraphUnits>,
                      concentrationToPH: ( concentration: ConcentrationValue ) => PHValue,
                      molesToPH: ( moles: number, volume: number ) => PHValue,
                      startCallback: () => void,
                      providedOptions: GraphIndicatorDragListenerOptions ) {
    const options = providedOptions;

    let clickYOffset: number; // y-offset between initial click and indicator's origin
    const objectResponseUtterance = new ValueChangeUtterance( {
      alert: options.objectResponseStringProperty
    } );
    super( {

      allowTouchSnag: true,

      // Record the offset between the pointer and the indicator's origin.
      start: event => {
        startCallback();
        clickYOffset = graphIndicatorNode.globalToParentPoint( event.pointer.point ).y - graphIndicatorNode.y;
      },

      // When the indicator is dragged, create a custom solute that corresponds to the new pH.
      drag: event => {

        // Prevent downstream RangeError in Number.toFixed. See https://github.com/phetsims/ph-scale/issues/286
        const yPointer = Math.min( graphIndicatorNode.globalToParentPoint( event.pointer.point ).y,
          PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds.height );

        // Adjust the y-coordinate for the offset between the pointer and the indicator's origin
        const yView = yPointer - clickYOffset;

        GraphIndicatorDragListener.doDrag( yView, graphIndicatorNode, objectResponseUtterance, pHProperty, totalVolumeProperty.value,
          graphUnitsProperty.value, concentrationToPH, molesToPH, options.scaleHeight );
      },

      // phet-io
      tandem: options.tandem
    } );
  }

  /**
   * When the indicator is dragged, create a custom solute that corresponds to the new pH.
   * This is used by both GraphIndicatorDragListener and GraphIndicatorKeyboardDragListener.
   */
  public static doDrag( yView: number,
                        graphIndicatorNode: GraphIndicatorNode,
                        objectResponseUtterance: Utterance,
                        pHProperty: Property<number>,
                        totalVolume: number,
                        graphUnits: GraphUnits,
                        concentrationToPH: ( concentration: ConcentrationValue ) => PHValue,
                        molesToPH: ( moles: number, volume: number ) => PHValue,
                        scaleHeight: number ): void {

    // If the solution volume is zero (empty beaker), then we have no solution, and therefore no pH, so do nothing.
    if ( totalVolume !== 0 ) {

      // Convert the y-coordinate to a model value.
      const value = LogarithmicGraphNode.yToValue( yView, scaleHeight );
      affirm( value > 0 );

      // Round the model value to the first 2 non-zero decimal places. This prevents continuous dragging from
      // creating values that have too much precision, which can result in pH = 7.00 with unequal amounts of
      // H3O+ and OH-. See https://github.com/phetsims/ph-scale/issues/225.
      const scientificNotation = ScientificNotationNode.toScientificNotation( value, {
        mantissaDecimalPlaces: PHScaleConstants.LOGARITHMIC_MANTISSA_DECIMAL_PLACES
      } );
      const exponent = +scientificNotation.exponent - PHScaleConstants.LOGARITHMIC_MANTISSA_DECIMAL_PLACES;
      const interval = Math.pow( 10, exponent );

      affirm( numberOfDecimalPlaces( interval ) <= 100, 'Number of decimal places: ' + numberOfDecimalPlaces( interval ) + ', yView: ' + yView + ', value: ' + value + ', exponent: ' + exponent + ', interval: ' + interval + ', totalVolume = ' + totalVolume + ', graphUnits = ' + graphUnits );
      let adjustedValue = roundToInterval( value, interval );

      // Workaround for https://github.com/phetsims/ph-scale/issues/225.
      // For one value (9.9e-8), the precision of what we're displaying results in a situation where we have
      // different concentrations of H3O+ and OH-, but are displaying a neutral pH of 7.00.  So we decided
      // that it was preferable to avoid that value, and snap to the concentration (1.0e-7) that results in
      // a neutral solution.
      const isConcentration = ( graphUnits === GraphUnits.MOLES_PER_LITER );
      if ( isConcentration && adjustedValue === 9.9e-8 ) {
        adjustedValue = 1.0e-7;
      }

      // Map the model value to pH, depending on which units we're using.
      let pH = isConcentration ? concentrationToPH( adjustedValue ) : molesToPH( adjustedValue, totalVolume );

      // Constrain the pH to the valid range
      affirm( pH !== null, 'pH is not expected to be null here, because we checked that totalVolume !== 0 above' );
      pH = clamp( pH, PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );

      phet.log && phet.log( `value=${value} adjustedValue=${adjustedValue} pH=${pH}` );

      // Set the solution's pH
      pHProperty.value = pH;

      // We do not want to interrupt other responses so we queue.
      graphIndicatorNode.addAccessibleObjectResponse( objectResponseUtterance, { alertBehavior: 'queue' } );
    }
  }
}

phScale.register( 'GraphIndicatorDragListener', GraphIndicatorDragListener );