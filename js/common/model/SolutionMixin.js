// Copyright 2020, University of Colorado Boulder

/**
 * SolutionMixin adds DerivedProperties for concentration, quantity, and number of molecules to a host class.
 * These Properties are needed by the Micro and My Solution screens, but not by the Macro screen, and they must be
 * PhET-iO instrumented when present.  Subclassing would be preferred to mixin, but subclassing wasn't possible
 * because there is no common base class.  In Macro and Micro screens both have a solute, pH and total volume are
 * DerivedProperties. In My Solution screen, there is no solute, and pH and totalVolume are not derived.
 *
 * I believe it's appropriate to call this a mixin, vs a trait. The main difference between a trait and a mixin is
 * that a trait can reference properties or methods from the class that it's being mixed into, while a mixin does not.
 * I interpret "reference" to mean "reference directly via this".  `SolutionMixin` gets everything it needs passed
 * in via `initializeSolutionMixin`, so it does not reach into the host class via this.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Property from '../../../../axon/js/Property.js';
import extend from '../../../../phet-core/js/extend.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHModel from './PHModel.js';

const SolutionMixin = {

  /**
   * @param {function} type - constructor whose prototype will be modified
   */
  mixInto( type ) {

    const proto = type.prototype;

    extend( proto, {

      /**
       * Call in the constructor to initialize the features for this mixin.
       * @param {Property.<number|null>} pHProperty
       * @param {Property.<number>} totalVolumeProperty
       * @param {Tandem} tandem
       */
      initializeSolutionMixin( pHProperty, totalVolumeProperty, tandem ) {

        assert && assert( pHProperty instanceof Property, 'invalid pHProperty' );
        assert && assert( totalVolumeProperty instanceof Property, 'invalid totalVolumeProperty' );
        assert && assert( tandem instanceof Tandem, 'invalid tandem' );

        // Concentration (mol/L) ------------------------------------------------

        // The concentration (mol/L) of H2O in the solution
        this.concentrationH2OProperty = new DerivedProperty(
          [ this.totalVolumeProperty ],
          totalVolume => PHModel.volumeToConcentrationH20( totalVolume ), {
            tandem: tandem.createTandem( 'concentrationH2OProperty' ),
            phetioType: DerivedPropertyIO( NullableIO( NumberIO ) ),
            units: 'mol/L',
            phetioDocumentation: 'concentration of H<sub>2</sub>O in the solution',
            phetioHighFrequency: true
          } );

        // The concentration (mol/L) of H3O+ in the solution
        this.concentrationH3OProperty = new DerivedProperty(
          [ pHProperty ],
          pH => PHModel.pHToConcentrationH3O( pH ), {
            tandem: tandem.createTandem( 'concentrationH3OProperty' ),
            phetioType: DerivedPropertyIO( NullableIO( NumberIO ) ),
            units: 'mol/L',
            phetioDocumentation: 'concentration of H<sub>3</sub>O<sup>+</sup> in the solution',
            phetioHighFrequency: true
          } );

        // The concentration (mol/L) of OH- in the solution
        this.concentrationOHProperty = new DerivedProperty(
          [ pHProperty ],
          pH => PHModel.pHToConcentrationOH( pH ), {
            tandem: tandem.createTandem( 'concentrationOHProperty' ),
            phetioType: DerivedPropertyIO( NullableIO( NumberIO ) ),
            units: 'mol/L',
            phetioDocumentation: 'concentration of OH<sup>-</sup> in the solution',
            phetioHighFrequency: true
          } );

        // Quantity (mol) ------------------------------------------------

        // The quantity (mol) of H2O in the solution
        this.quantityH2OProperty = new DerivedProperty(
          [ this.concentrationH2OProperty, totalVolumeProperty ],
          ( concentrationH2O, totalVolume ) => PHModel.computeMoles( concentrationH2O, totalVolume ), {
            tandem: tandem.createTandem( 'quantityH2OProperty' ),
            phetioType: DerivedPropertyIO( NumberIO ),
            units: 'mol',
            phetioDocumentation: 'quantity of H<sub>2</sub>O in the solution',
            phetioHighFrequency: true
          } );

        // The quantity (mol) of H3O+ in the solution
        this.quantityH3OProperty = new DerivedProperty(
          [ this.concentrationH3OProperty, totalVolumeProperty ],
          ( concentrationH3O, totalVolume ) => PHModel.computeMoles( concentrationH3O, totalVolume ), {
            tandem: tandem.createTandem( 'quantityH3OProperty' ),
            phetioType: DerivedPropertyIO( NumberIO ),
            units: 'mol',
            phetioDocumentation: 'quantity of H<sub>3</sub>O<sup>+</sup> in the solution',
            phetioHighFrequency: true
          } );

        // The quantity (mol) of OH- in the solution
        this.quantityOHProperty = new DerivedProperty(
          [ this.concentrationOHProperty, totalVolumeProperty ],
          ( concentrationOH, totalVolume ) => PHModel.computeMoles( concentrationOH, totalVolume ), {
            tandem: tandem.createTandem( 'quantityOHProperty' ),
            phetioType: DerivedPropertyIO( NumberIO ),
            units: 'mol',
            phetioDocumentation: 'quantity of OH<sup>-</sup> in the solution',
            phetioHighFrequency: true
          } );

        // Molecule counts ------------------------------------------------

        // @public number of H2O molecules in the solution
        this.numberOfH2OMoleculesProperty = new DerivedProperty(
          [ this.concentrationH2OProperty, totalVolumeProperty ],
          ( concentrationH2O, totalVolume ) => PHModel.computeMolecules( concentrationH2O, totalVolume ), {
            tandem: tandem.createTandem( 'numberOfH2OMoleculesProperty' ),
            phetioType: DerivedPropertyIO( NumberIO ),
            phetioDocumentation: 'number of H<sub>2</sub>O molecules in the solution',
            phetioHighFrequency: true
          } );

        // @public number of H3O+ molecules in the solution
        this.numberOfH3OMoleculesProperty = new DerivedProperty(
          [ this.concentrationH3OProperty, totalVolumeProperty ],
          ( concentrationH3O, totalVolume ) => PHModel.computeMolecules( concentrationH3O, totalVolume ), {
            tandem: tandem.createTandem( 'numberOfH3OMoleculesProperty' ),
            phetioType: DerivedPropertyIO( NumberIO ),
            phetioDocumentation: 'number of H<sub>3</sub>O<sup>+</sup> molecules in the solution',
            phetioHighFrequency: true
          } );

        // @public number of OH- molecules in the solution
        this.numberOfOHMoleculesProperty = new DerivedProperty(
          [ this.concentrationOHProperty, totalVolumeProperty ],
          ( concentrationOH, totalVolume ) => PHModel.computeMolecules( concentrationOH, totalVolume ), {
            tandem: tandem.createTandem( 'numberOfOHMoleculesProperty' ),
            phetioType: DerivedPropertyIO( NumberIO ),
            phetioDocumentation: 'number of OH<sup>-</sup> molecules in the solution',
            phetioHighFrequency: true
          } );
      }
    } );
  }
};

phScale.register( 'SolutionMixin', SolutionMixin );
export default SolutionMixin;