// Copyright 2013-2020, University of Colorado Boulder

/**
 * MicroModel is the model for the 'Micro' screen.  It extends the MacroModel, substituting a different solution
 * model, and omitting the pH meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MacroModel from '../../macro/model/MacroModel.js';
import phScale from '../../phScale.js';
import MicroSolution from './MicroSolution.js';

class MicroModel extends MacroModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( tandem, {

      // Creates the solution needed by the Micro screen
      createSolution: ( solutionProperty, options ) => new MicroSolution( solutionProperty, options ),

      // pHMeter is not needed in the Micro screen, because it has no moving parts and it's always measuring the
      // pH of the solution. See https://github.com/phetsims/ph-scale/issues/137
      includePHMeter: false
    } );

    // adjust the drag bounds of the dropper to account for different user-interface constraints
    const yDropper = this.dropper.positionProperty.get().y;
    this.dropper.dragBounds = new Bounds2( this.beaker.left + 120, yDropper, this.beaker.right - 170, yDropper );
  }
}

phScale.register( 'MicroModel', MicroModel );
export default MicroModel;