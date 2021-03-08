// Copyright 2020, University of Colorado Boulder

/**
 * SolutionDerivedQuantities models the Properties of a solution that are derived from pH and volume, including
 * concentration (mol/L), quantity (mol), and numbers of molecules.
 *
 * These Properties are separated from the solution model for 2 reasons:
 *  - Different screens have different needs, and there is no base class model of solution that is shared by all
 *    screens. Macro and Micro screens have a solute, and pH and total volume are DerivedProperties. My Solution
 *    screen has no solute, and pH and totalVolume are not derived.
 *  - These Properties are not relevant to all screens, and we want these Properties to appear for PhET-iO only
 *    in the screens for which they are relevant. Specifically, these Properties are needed by the Micro and
 *    My Solution screens, but not by the Macro screen.
 *
 * We address the needs of all screens via composition, by creating an instance of this class for screens where
 * it's appropriate - that is, the Micro and MySolution screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHModel from './PHModel.js';

class SolutionDerivedQuantities {

  /**
   * @param {Property.<number|null>} pHProperty
   * @param {Property.<number>} totalVolumeProperty
   * @param {Object} [options]
   */
  constructor( pHProperty, totalVolumeProperty, options ) {

    assert && assert( pHProperty instanceof Property, 'invalid pHProperty' );
    assert && assert( totalVolumeProperty instanceof Property, 'invalid totalVolumeProperty' );

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

phScale.register( 'SolutionDerivedQuantities', SolutionDerivedQuantities );
export default SolutionDerivedQuantities;