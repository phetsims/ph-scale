// Copyright 2020, University of Colorado Boulder

/**
 * MicroSolution is the solution model used in the Micro screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SolutionMixin from '../../common/model/SolutionMixin.js';
import MacroSolution from '../../macro/model/MacroSolution.js';
import phScale from '../../phScale.js';

class MicroSolution extends MacroSolution {

  /**
   * @param {Property.<Solute>} soluteProperty
   * @param {Object} [options]
   * @mixes SolutionMixin
   */
  constructor( soluteProperty, options ) {
    super( soluteProperty, options );
    this.initializeSolutionMixin( this.pHProperty, this.totalVolumeProperty, this.tandem );
  }
}

SolutionMixin.mixInto( MicroSolution );

phScale.register( 'MicroSolution', MicroSolution );
export default MicroSolution;