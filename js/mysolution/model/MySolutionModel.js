// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the 'My Solution' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Beaker from '../../common/model/Beaker.js';
import Solute from '../../common/model/Solute.js';
import Solution from '../../common/model/Solution.js';
import phScale from '../../phScale.js';

class MySolutionModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public Beaker, everything else is positioned relative to it. Offset constants were set by visual inspection.
    this.beaker = new Beaker( new Vector2( 750, 580 ), new Dimension2( 450, 300 ) );

    // @public Solution in the beaker
    this.solution = new Solution( new Property( Solute.createCustom( 7 ) ), 0.5, 0, this.beaker.volume, {
      hasSolute: false,
      tandem: tandem.createTandem( 'solution' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.beaker.reset();
    this.solution.reset();
  }
}

phScale.register( 'MySolutionModel', MySolutionModel );
export default MySolutionModel;