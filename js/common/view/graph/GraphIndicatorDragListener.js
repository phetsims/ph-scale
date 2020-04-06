// Copyright 2014-2020, University of Colorado Boulder

/**
 * Drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../../dot/js/Utils.js';
import DragListener from '../../../../../scenery/js/listeners/DragListener.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphUnits from './GraphUnits.js';

class GraphIndicatorDragListener extends DragListener {

  /**
   * @param {Node} targetNode
   * @param {Property.<number>} pHProperty - pH of the solution
   * @param {Property.<number>} totalVolumeProperty - volume of the solution
   * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
   * @param {function} yToValue - function that takes a {number} y coordinate and converts it to a {number} model value
   * @param {function} concentrationToPH - takes {number} concentration, returns pH
   * @param {function} molesToPH - takes {number} moles and {number} volume (L), returns pH
   * @param {Tandem} tandem
   */
  constructor( targetNode, pHProperty, totalVolumeProperty, graphUnitsProperty, yToValue, concentrationToPH, molesToPH, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    let clickYOffset; // y-offset between initial click and indicator's origin

    super( {

      allowTouchSnag: true,

      // Record the offset between the pointer and the indicator's origin.
      start: event => {
        clickYOffset = targetNode.globalToParentPoint( event.pointer.point ).y - targetNode.y;
      },

      // When the indicator is dragged, create a custom solute that corresponds to the new pH.
      drag: event => {

        // If the solution volume is zero (empty beaker), then we have no solution, and therefore no pH, so do nothing.
        if ( totalVolumeProperty.get() !== 0 ) {

          // Adjust the y-coordinate for the offset between the pointer and the indicator's origin
          const y = targetNode.globalToParentPoint( event.pointer.point ).y - clickYOffset;

          // Convert the y-coordinate to a model value
          const value = yToValue( y );

          // Map the model value to pH, depending on which units we're using.
          let pH = ( graphUnitsProperty.get() === GraphUnits.MOLES_PER_LITER ) ? concentrationToPH( value ) : molesToPH( value, totalVolumeProperty.get() );

          // Constrain the pH to the valid range
          pH = Utils.clamp( pH, PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );

          // Set the solution's pH
          pHProperty.set( pH );
        }
      },

      // phet-io
      tandem: tandem
    } );
  }
}

phScale.register( 'GraphIndicatorDragHandler', GraphIndicatorDragListener );
export default GraphIndicatorDragListener;