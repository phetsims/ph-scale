// Copyright 2013-2020, University of Colorado Boulder

/**
 * Solute model, with instances used by this sim.
 * Solutes are immutable, so all fields should be considered immutable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import PHScaleConstants from '../PHScaleConstants.js';
import SoluteIO from './SoluteIO.js';
import Water from './Water.js';

class Solute extends PhetioObject {

  /**
   * @param {string} name - the name of the solute, displayed to the user
   * @param {number} pH - the pH of the solute
   * @param {Color} stockColor - color of the solute in stock solution (no dilution)
   * @param {Object} [options]
   */
  constructor( name, pH, stockColor, options ) {

    assert && assert( PHScaleConstants.PH_RANGE.contains( pH ), `invalid pH: ${pH}` );
    assert && assert( stockColor instanceof Color, 'invalid color' );

    options = merge( {

      // {Color} color when the solute is barely present in solution (fully diluted)
      dilutedColor: Water.color,

      // {Color|null} optional color used to smooth out some color transitions
      colorStopColor: null,

      // {number} ratio for the color-stop, (0,1) exclusive, ignored if colorStopColor is null
      colorStopRatio: 0.25,

      // phet-io
      tandem: Tandem.OPTIONAL, // this is optional because in MySolutions, a new Solute is created for each pH change
      phetioType: SoluteIO
    }, options );

    super( options );

    assert && assert( options.dilutedColor instanceof Color, `invalid dilutedColor: ${options.dilutedColor}` );
    assert && assert( options.colorStopColor === null || options.colorStopColor instanceof Color, `invalid colorStopColor: ${options.colorStopColor}` );
    assert && assert( options.colorStopRatio > 0 && options.colorStopRatio < 1, `invalid colorStopRatio: ${options.colorStopRatio}` );

    // @public (read-only)
    this.nameProperty = new StringProperty( name, {
      tandem: options.tandem.createTandem( 'nameProperty' ),
      phetioDocumentation: 'name of the solute, as displayed in the user interface'
    } );
    this.pH = pH;
    this.stockColor = stockColor;

    // @private
    this.dilutedColor = options.dilutedColor;
    this.colorStopColor = options.colorStopColor;
    this.colorStopRatio = options.colorStopRatio;
  }

  /**
   * String representation of this Solute. For debugging only, do not depend on the format!
   * @returns {string}
   * @public
   */
  toString() {
    return `Solution[name:${this.name}, pH:${this.pH}]`;
  }

  /**
   * Gets the solute's name.
   * @returns {string}
   */
  get name() {
    return this.nameProperty.value;
  }

  /**
   * Computes the color for a dilution of this solute.
   * @param {number} ratio describes the dilution, range is [0,1] inclusive, 0 is no solute, 1 is all solute
   * @returns {Color}
   * @public
   */
  computeColor( ratio ) {
    assert && assert( ratio >= 0 && ratio <= 1 );
    let color;
    if ( this.colorStopColor ) {
      if ( ratio > this.colorStopRatio ) {
        color = Color.interpolateRGBA( this.colorStopColor, this.stockColor,
          ( ratio - this.colorStopRatio ) / ( 1 - this.colorStopRatio ) );
      }
      else {
        color = Color.interpolateRGBA( this.dilutedColor, this.colorStopColor,
          ratio / this.colorStopRatio );
      }
    }
    else {
      color = Color.interpolateRGBA( this.dilutedColor, this.stockColor, ratio );
    }
    return color;
  }
}

phScale.register( 'Solute', Solute );
export default Solute;