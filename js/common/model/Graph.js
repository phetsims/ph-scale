// Copyright 2020, University of Colorado Boulder

/**
 * Graph is the model of the graph that is displayed on the Micro and My Solutions screens.
 * It computes concentration and quantity of H2O, H3O+, and OH-.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';

class Graph extends PhetioObject {

  /**
   * @param {Solution} solution
   * @param {Object} [options]
   */
  constructor( solution, options ) {

    super( merge( {
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options ) );

    // The concentration (mol/L) of H2O in the solution
    this.concentrationH2OProperty = new DerivedProperty(
      [ solution.pHProperty, solution.volumeProperty ],
      ( pH, volume ) => solution.getConcentrationH2O(), {
        tandem: options.tandem.createTandem( 'concentrationH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'H<sub>2</sub>O concentration'
      } );

    // The quantity (mol) of H2O in the solution
    this.quantityH2OProperty = new DerivedProperty(
      [ solution.pHProperty, solution.volumeProperty ],
      ( pH, volume ) => solution.getMolesH2O(), {
        tandem: options.tandem.createTandem( 'quantityH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'H<sub>2</sub>O quantity'
      } );

    // The concentration (mol/L) of H3O+ in the solution
    this.concentrationH3OProperty = new DerivedProperty(
      [ solution.pHProperty, solution.volumeProperty ],
      ( pH, volume ) => solution.getConcentrationH3O(), {
        tandem: options.tandem.createTandem( 'concentrationH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'H<sub>3</sub>O<sup>+</sup> concentration'
      } );

    // The quantity (mol) of H3O+ in the solution
    this.quantityH3OProperty = new DerivedProperty(
      [ solution.pHProperty, solution.volumeProperty ],
      ( pH, volume ) => solution.getMolesH3O(), {
        tandem: options.tandem.createTandem( 'quantityH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'H<sub>3</sub>O<sup>+</sup> quantity'
      } );

    // The concentration (mol/L) of OH- in the solution
    this.concentrationOHProperty = new DerivedProperty(
      [ solution.pHProperty, solution.volumeProperty ],
      ( pH, volume ) => solution.getConcentrationOH(), {
        tandem: options.tandem.createTandem( 'concentrationOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'OH<sup>-</sup> concentration'
      } );

    // The quantity (mol) of OH- in the solution
    this.quantityOHProperty = new DerivedProperty(
      [ solution.pHProperty, solution.volumeProperty ],
      ( pH, volume ) => solution.getMolesOH(), {
        tandem: options.tandem.createTandem( 'quantityOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'OH<sup>-</sup> quantity'
      } );
  }
}

phScale.register( 'Graph', Graph );

export default Graph;