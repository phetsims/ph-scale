// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the 'My Solution' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Beaker from '../../common/model/Beaker.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import MySolution from './MySolution.js';

// constants
const DEFAULT_PH = 7;
const VOLUME = 0.5; // L

class MySolutionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
    this.beaker = new Beaker( PHScaleConstants.BEAKER_POSITION );

    // @public solution in the beaker
    this.solution = new MySolution( {
      pH: DEFAULT_PH,
      volume: VOLUME,
      maxVolume: this.beaker.volume,
      tandem: tandem.createTandem( 'solution' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.solution.reset();
  }
}

phScale.register( 'MySolutionModel', MySolutionModel );
export default MySolutionModel;