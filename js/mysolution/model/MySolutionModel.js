// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model for the 'My Solution' screen.
 * The solution in the beaker is 100% solute (stock solution).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Beaker from '../../common/model/Beaker.js';
import Solute from '../../common/model/Solute.js';
import Solution from '../../common/model/Solution.js';
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

    // @public solution with pH that can be directly mutated
    this.mutableSolution = new MySolution( {
      pH: DEFAULT_PH,
      volume: VOLUME,
      maxVolume: this.beaker.volume,
      tandem: tandem.createTandem( 'solution' )
    } );

    // In this screen, we want pHProperty to be mutable, and solute/solvent are irrelevant. We also want to reuse as
    // much as possible from the other screens. But the other screens use Solution, where pHProperty is a
    // DerivedProperty and therefore not directly settable. So we create an internal Solution here, with no water
    // and all solute. When this.mutableSolution.pHProperty changes, we create a Solute with the pH and put it in
    // this.solution.  This bit of cleverness was necessitated by https://github.com/phetsims/ph-scale/issues/119.
    this.solution = new Solution( new Property( Solute.createCustom( this.mutableSolution.pHProperty.value ) ), {
      waterVolume: 0, // L
      soluteVolume: VOLUME,
      maxVolume: this.beaker.volume // L
      // DO NOT INSTRUMENT! This is an internal detail that should remain hidden.
    } );

    this.mutableSolution.pHProperty.link( pH => {
      if ( pH !== this.solution.pHProperty.get() ) {
        this.solution.soluteProperty.set( Solute.createCustom( pH ) );
      }
    } );

    this.solution.volumeProperty.lazyLink( () => {
      throw new Error( 'volume is not mutable in My Solution screen' );
    } );
  }

  /**
   * @public
   */
  reset() {
    this.mutableSolution.reset();
  }
}

phScale.register( 'MySolutionModel', MySolutionModel );
export default MySolutionModel;