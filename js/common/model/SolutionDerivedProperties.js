// Copyright 2021-2022, University of Colorado Boulder

/**
 * SolutionDerivedProperties models the Properties of a solution that are derived from pH and volume, including
 * concentration (mol/L), quantity (mol), and numbers of molecules. This class is separated from the solution
 * model so that it can be used in different solution models via composition.
 *
 * This sim has different solution models because:
 * - Different screens have different needs, and there is no solution base class that is appropriate for all screens.
 *   Macro and Micro screens have a solute, with pH and total volume being DerivedProperties. My Solution
 *   screen has no solute, and pH and totalVolume are not derived.
 * - For PhET-iO, these Properties should appear only in the screens for which they are relevant; that is, the
 *   Micro and My Solution screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { ReadOnlyProperty } from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHModel from './PHModel.js';

class SolutionDerivedProperties {

  /**
   * @param {ReadOnlyProperty.<number|null>} pHProperty
   * @param {ReadOnlyProperty.<number>} totalVolumeProperty
   * @param {Object} [options]
   */
  constructor( pHProperty, totalVolumeProperty, options ) {

    assert && assert( pHProperty instanceof ReadOnlyProperty, 'invalid pHProperty' );
    assert && assert( totalVolumeProperty instanceof ReadOnlyProperty, 'invalid totalVolumeProperty' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // Concentration (mol/L) ------------------------------------------------

    // The concentration (mol/L) of H2O in the solution
    this.concentrationH2OProperty = new DerivedProperty(
      [ totalVolumeProperty ],
      totalVolume => PHModel.volumeToConcentrationH20( totalVolume ), {
        tandem: options.tandem.createTandem( 'concentrationH2OProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>2</sub>O in the solution',
        phetioHighFrequency: true
      } );

    // The concentration (mol/L) of H3O+ in the solution
    this.concentrationH3OProperty = new DerivedProperty(
      [ pHProperty ],
      pH => PHModel.pHToConcentrationH3O( pH ), {
        tandem: options.tandem.createTandem( 'concentrationH3OProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>3</sub>O<sup>+</sup> in the solution',
        phetioHighFrequency: true
      } );

    // The concentration (mol/L) of OH- in the solution
    this.concentrationOHProperty = new DerivedProperty(
      [ pHProperty ],
      pH => PHModel.pHToConcentrationOH( pH ), {
        tandem: options.tandem.createTandem( 'concentrationOHProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NullableIO( NumberIO ) ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of OH<sup>-</sup> in the solution',
        phetioHighFrequency: true
      } );

    // Quantity (mol) ------------------------------------------------

    // The quantity (mol) of H2O in the solution
    this.quantityH2OProperty = new DerivedProperty(
      [ this.concentrationH2OProperty, totalVolumeProperty ],
      ( concentrationH2O, totalVolume ) => PHModel.computeMoles( concentrationH2O, totalVolume ), {
        tandem: options.tandem.createTandem( 'quantityH2OProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>2</sub>O in the solution',
        phetioHighFrequency: true
      } );

    // The quantity (mol) of H3O+ in the solution
    this.quantityH3OProperty = new DerivedProperty(
      [ this.concentrationH3OProperty, totalVolumeProperty ],
      ( concentrationH3O, totalVolume ) => PHModel.computeMoles( concentrationH3O, totalVolume ), {
        tandem: options.tandem.createTandem( 'quantityH3OProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>3</sub>O<sup>+</sup> in the solution',
        phetioHighFrequency: true
      } );

    // The quantity (mol) of OH- in the solution
    this.quantityOHProperty = new DerivedProperty(
      [ this.concentrationOHProperty, totalVolumeProperty ],
      ( concentrationOH, totalVolume ) => PHModel.computeMoles( concentrationOH, totalVolume ), {
        tandem: options.tandem.createTandem( 'quantityOHProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        units: 'mol',
        phetioDocumentation: 'quantity of OH<sup>-</sup> in the solution',
        phetioHighFrequency: true
      } );

    // Molecule counts ------------------------------------------------

    // @public number of H2O molecules in the solution
    this.numberOfH2OMoleculesProperty = new DerivedProperty(
      [ this.concentrationH2OProperty, totalVolumeProperty ],
      ( concentrationH2O, totalVolume ) => PHModel.computeMolecules( concentrationH2O, totalVolume ), {
        tandem: options.tandem.createTandem( 'numberOfH2OMoleculesProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of H<sub>2</sub>O molecules in the solution',
        phetioHighFrequency: true
      } );

    // @public number of H3O+ molecules in the solution
    this.numberOfH3OMoleculesProperty = new DerivedProperty(
      [ this.concentrationH3OProperty, totalVolumeProperty ],
      ( concentrationH3O, totalVolume ) => PHModel.computeMolecules( concentrationH3O, totalVolume ), {
        tandem: options.tandem.createTandem( 'numberOfH3OMoleculesProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of H<sub>3</sub>O<sup>+</sup> molecules in the solution',
        phetioHighFrequency: true
      } );

    // @public number of OH- molecules in the solution
    this.numberOfOHMoleculesProperty = new DerivedProperty(
      [ this.concentrationOHProperty, totalVolumeProperty ],
      ( concentrationOH, totalVolume ) => PHModel.computeMolecules( concentrationOH, totalVolume ), {
        tandem: options.tandem.createTandem( 'numberOfOHMoleculesProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'number of OH<sup>-</sup> molecules in the solution',
        phetioHighFrequency: true
      } );
  }
}

phScale.register( 'SolutionDerivedProperties', SolutionDerivedProperties );
export default SolutionDerivedProperties;