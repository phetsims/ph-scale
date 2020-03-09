// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the 'Micro' screen.
 * This is essentially the 'Macro' model with a different user-interface on it.
 * The 'Macro' model also has a pHMeter model element, which we'll simply ignore.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SolutionMixin from '../../common/model/SolutionMixin.js';
import MacroModel from '../../macro/model/MacroModel.js';
import phScale from '../../phScale.js';

class MicroModel extends MacroModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem, {

      // pHMeter is not needed in the Micro screen, because it has no moving parts and it's always measuring the
      // pH of the solution. See https://github.com/phetsims/ph-scale/issues/137
      includePHMeter: false
    } );

    SolutionMixin.mixInto( this.solution );

    // adjust the drag bounds of the dropper to account for different user-interface constraints
    const yDropper = this.dropper.positionProperty.get().y;
    this.dropper.dragBounds = new Bounds2( this.beaker.left + 120, yDropper, this.beaker.right - 170, yDropper );
  }
}

phScale.register( 'MicroModel', MicroModel );
export default MicroModel;