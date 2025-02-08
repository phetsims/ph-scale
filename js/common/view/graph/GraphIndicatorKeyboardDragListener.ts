// Copyright 2022-2025, University of Colorado Boulder

/**
 * Keyboard drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import KeyboardDragListener from '../../../../../scenery/js/listeners/KeyboardDragListener.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import { ConcentrationValue, PHValue } from '../../model/PHModel.js';
import GraphIndicatorDragListener from './GraphIndicatorDragListener.js';
import GraphIndicatorNode from './GraphIndicatorNode.js';
import GraphUnits from './GraphUnits.js';

export default class GraphIndicatorKeyboardDragListener extends KeyboardDragListener {

  /**
   * @param graphIndicatorNode
   * @param pHProperty - pH of the solution
   * @param totalVolumeProperty - volume of the solution
   * @param graphUnitsProperty
   * @param yToValue - converts a y view coordinate to a model value
   * @param concentrationToPH - converts concentration to pH
   * @param molesToPH - converts moles + volume to pH
   * @param tandem
   */
  public constructor( graphIndicatorNode: GraphIndicatorNode,
                      pHProperty: Property<number>,
                      totalVolumeProperty: TReadOnlyProperty<number>,
                      graphUnitsProperty: EnumerationProperty<GraphUnits>,
                      yToValue: ( y: number ) => number,
                      concentrationToPH: ( concentration: ConcentrationValue ) => PHValue,
                      molesToPH: ( moles: number, volume: number ) => PHValue,
                      tandem: Tandem ) {
    super( {
      keyboardDragDirection: 'upDown', // constrained to vertical dragging
      drag: ( event, listener ) => GraphIndicatorDragListener.doDrag( graphIndicatorNode.y + listener.modelDelta.y, graphIndicatorNode, pHProperty,
        totalVolumeProperty.value, graphUnitsProperty.value, yToValue, concentrationToPH, molesToPH ),

      // Drag speed, in view coordinates per second.
      dragSpeed: 300,

      // Slower drag speed.
      // Careful! If this value is too small, the indicator will not move, due to the precision of the value.
      shiftDragSpeed: 40,
      tandem: tandem
    } );
  }
}

phScale.register( 'GraphIndicatorKeyboardDragListener', GraphIndicatorKeyboardDragListener );