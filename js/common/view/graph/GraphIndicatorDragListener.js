// Copyright 2014-2021, University of Colorado Boulder

/**
 * Drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../../dot/js/Utils.js';
import ScientificNotationNode from '../../../../../scenery-phet/js/ScientificNotationNode.js';
import { DragListener } from '../../../../../scenery/js/imports.js';
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

          // Convert the y-coordinate to a model value.
          const value = yToValue( y );
          assert && assert( value > 0 );

          // Round the model value to the first 2 non-zero decimal places. This prevents continuous dragging from
          // creating values that have too much precision, which can result in pH = 7.00 with unequal amounts of 
          // H3O+ and OH-. See https://github.com/phetsims/ph-scale/issues/225.
          const scientificNotation = ScientificNotationNode.toScientificNotation( value, {
            mantissaDecimalPlaces: PHScaleConstants.LOGARITHMIC_MANTISSA_DECIMAL_PLACES
          } );
          const exponent = scientificNotation.exponent - PHScaleConstants.LOGARITHMIC_MANTISSA_DECIMAL_PLACES;
          const interval = Math.pow( 10, exponent );
          let adjustedValue = Utils.roundToInterval( value, interval );

          // Workaround for https://github.com/phetsims/ph-scale/issues/225.
          // For one value (9.9e-8), the precision of what we're displaying results in a situation where we have
          // different concentrations of H3O+ and OH-, but are displaying a neutral pH of 7.00.  So we decided
          // that it was preferable to avoid that value, and snap to the concentration (1.0e-7) that results in
          // a neutral solution.
          const isConcentration = ( graphUnitsProperty.get() === GraphUnits.MOLES_PER_LITER );
          if ( isConcentration && adjustedValue === 9.9e-8 ) {
            adjustedValue = 1.0e-7;
          }

          // Map the model value to pH, depending on which units we're using.
          let pH = isConcentration ? concentrationToPH( adjustedValue ) : molesToPH( adjustedValue, totalVolumeProperty.get() );

          // Constrain the pH to the valid range
          pH = Utils.clamp( pH, PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max );

          phet.log && phet.log( `value=${value} adjustedValue=${adjustedValue} pH=${pH}` );

          // Set the solution's pH
          pHProperty.set( pH );
        }
      },

      // phet-io
      tandem: tandem
    } );
  }
}

phScale.register( 'GraphIndicatorDragListener', GraphIndicatorDragListener );
export default GraphIndicatorDragListener;