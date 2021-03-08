// Copyright 2020, University of Colorado Boulder

/**
 * MicroSolution is the solution model used in the Micro screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolutionDerivedQuantities from '../../common/model/SolutionDerivedQuantities.js';
import MacroSolution from '../../macro/model/MacroSolution.js';
import phScale from '../../phScale.js';

class MicroSolution extends MacroSolution {

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {Object} [options]
   * @mixes SolutionDerivedQuantities
   */
  constructor( soluteProperty, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( soluteProperty, options );

    // @public
    this.derivedQuantities = new SolutionDerivedQuantities( this.pHProperty, this.totalVolumeProperty, {
      tandem: options.tandem // Properties created by SolutionDerivedQuantities should appear as if they are children of MicroSolution.
    } );
  }
}

phScale.register( 'MicroSolution', MicroSolution );
export default MicroSolution;