// Copyright 2020, University of Colorado Boulder

/**
 * SolutionMixin adds DerivedProperties for concentration, quantity, and number of molecules to an instance of Solution.
 * These Properties are needed by the Micro and My Solution screens, but not by the Macro screen, and they must be
 * PhET-iO instrumented when present.  Subclassing would be preferred to mixin, but subclassing wasn't possible with
 * the current implementation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHModel from './PHModel.js';

const SolutionMixin = {

  /**
   * @param {Solution} solution
   */
  mixInto( solution ) {

    // Prerequisites for solution
    assert && assert( solution.tandem );
    assert && assert( solution.pHProperty );
    assert && assert( solution.volumeProperty );

    // Concentration (mol/L) ------------------------------------------------

    // The concentration (mol/L) of H2O in the solution
    solution.concentrationH2OProperty = new DerivedProperty(
      [ solution.volumeProperty ],
      volume => PHModel.volumeToConcentrationH20( volume ), {
        tandem: solution.tandem.createTandem( 'concentrationH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>2</sub>O in the solution'
      } );

    // The concentration (mol/L) of H3O+ in the solution
    solution.concentrationH3OProperty = new DerivedProperty(
      [ solution.pHProperty ],
      pH => PHModel.pHToConcentrationH3O( pH ), {
        tandem: solution.tandem.createTandem( 'concentrationH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>3</sub>O<sup>+</sup> in the solution'
      } );

    // The concentration (mol/L) of OH- in the solution
    solution.concentrationOHProperty = new DerivedProperty(
      [ solution.pHProperty ],
      pH => PHModel.pHToConcentrationOH( pH ), {
        tandem: solution.tandem.createTandem( 'concentrationOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of OH<sup>-</sup> in the solution'
      } );

    // Quantity (mol) ------------------------------------------------

    // The quantity (mol) of H2O in the solution
    solution.quantityH2OProperty = new DerivedProperty(
      [ solution.concentrationH2OProperty, solution.volumeProperty ],
      ( concentrationH2O, volume ) => PHModel.computeMoles( concentrationH2O, volume ), {
        tandem: solution.tandem.createTandem( 'quantityH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>2</sub>O in the solution'
      } );

    // The quantity (mol) of H3O+ in the solution
    solution.quantityH3OProperty = new DerivedProperty(
      [ solution.concentrationH3OProperty, solution.volumeProperty ],
      ( concentrationH3O, volume ) => PHModel.computeMoles( concentrationH3O, volume ), {
        tandem: solution.tandem.createTandem( 'quantityH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>3</sub>O<sup>+</sup> in the solution'
      } );

    // The quantity (mol) of OH- in the solution
    solution.quantityOHProperty = new DerivedProperty(
      [ solution.concentrationOHProperty, solution.volumeProperty ],
      ( concentrationOH, volume ) => PHModel.computeMoles( concentrationOH, volume ), {
        tandem: solution.tandem.createTandem( 'quantityOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of OH<sup>-</sup> in the solution'
      } );

    // Molecule counts ------------------------------------------------

    // @public number of H2O molecules in the solution
    solution.numberOfH2OMoleculesProperty = new DerivedProperty(
      [ solution.concentrationH2OProperty, solution.volumeProperty ],
      ( concentrationH2O, volume ) => PHModel.computeMolecules( concentrationH2O, volume ), {
        tandem: solution.tandem.createTandem( 'numberOfH2OMoleculesProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of H<sub>2</sub>O molecules in the solution'
      } );

    // @public number of H3O+ molecules in the solution
    solution.numberOfH3OMoleculesProperty = new DerivedProperty(
      [ solution.concentrationH3OProperty, solution.volumeProperty ],
      ( concentrationH3O, volume ) => PHModel.computeMolecules( concentrationH3O, volume ), {
        tandem: solution.tandem.createTandem( 'numberOfH3OMoleculesProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of H<sub>3</sub>O<sup>+</sup> molecules in the solution'
      } );

    // @public number of OH- molecules in the solution
    solution.numberOfOHMoleculesProperty = new DerivedProperty(
      [ solution.concentrationOHProperty, solution.volumeProperty ],
      ( concentrationOH, volume ) => PHModel.computeMolecules( concentrationOH, volume ), {
        tandem: solution.tandem.createTandem( 'numberOfOHMoleculesProperty' ),
        phetioType: DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of OH<sup>-</sup> molecules in the solution'
      } );
  }
};

phScale.register( 'SolutionMixin', SolutionMixin );
export default SolutionMixin;