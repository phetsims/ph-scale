// Copyright 2021-2025, University of Colorado Boulder

/**
 * SolutionDerivedProperties models the Properties of a solution that are derived from pH and volume, including
 * concentration (mol/L), quantity (mol), and numbers of particles. This class is separated from the solution
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
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHModel, { ConcentrationValue, PHValue } from './PHModel.js';
import ScientificNotationNode, { ScientificNotation } from '../../../../scenery-phet/js/ScientificNotationNode.js';

type SelfOptions = EmptySelfOptions;

type SolutionDerivedPropertiesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SolutionDerivedProperties {

  // The concentration (mol/L) of H2O, H3O+, and OH- in the solution
  public readonly concentrationH2OProperty: ReadOnlyProperty<ConcentrationValue>;
  public readonly concentrationH3OProperty: ReadOnlyProperty<ConcentrationValue>;
  public readonly concentrationOHProperty: ReadOnlyProperty<ConcentrationValue>;

  // The quantity (mol) of H2O, H3O+, and OH- in the solution
  public readonly quantityH2OProperty: ReadOnlyProperty<number>;
  public readonly quantityH3OProperty: ReadOnlyProperty<number>;
  public readonly quantityOHProperty: ReadOnlyProperty<number>;

  // The number of H2O, H3O+, and OH- particles in the solution
  public readonly particleCountH2OProperty: ReadOnlyProperty<number>;
  public readonly particleCountH3OProperty: ReadOnlyProperty<number>;
  public readonly particleCountOHProperty: ReadOnlyProperty<number>;

  // The scientific notation of concentration (mol/L) and quantity (mol) of H3O+, and OH- in the solution
  // These Properties are for a11y, to fill in pattern strings in the pdom.
  public readonly concentrationH3OScientificNotationProperty: TReadOnlyProperty<ScientificNotation>;
  public readonly concentrationOHScientificNotationProperty: TReadOnlyProperty<ScientificNotation>;
  public readonly quantityH3OScientificNotationProperty: TReadOnlyProperty<ScientificNotation>;
  public readonly quantityOHScientificNotationProperty: TReadOnlyProperty<ScientificNotation>;

  public constructor( pHProperty: TReadOnlyProperty<PHValue>,
                      totalVolumeProperty: TReadOnlyProperty<number>,
                      providedOptions: SolutionDerivedPropertiesOptions ) {

    const options = providedOptions;

    this.concentrationH2OProperty = new DerivedProperty(
      [ totalVolumeProperty ],
      totalVolume => PHModel.volumeToConcentrationH20( totalVolume ), {
        tandem: options.tandem.createTandem( 'concentrationH2OProperty' ),
        phetioFeatured: true,
        phetioValueType: NullableIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>2</sub>O in the solution',
        phetioHighFrequency: true
      } );

    this.concentrationH3OProperty = new DerivedProperty(
      [ pHProperty ],
      pH => PHModel.pHToConcentrationH3O( pH ), {
        tandem: options.tandem.createTandem( 'concentrationH3OProperty' ),
        phetioFeatured: true,
        phetioValueType: NullableIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of H<sub>3</sub>O<sup>+</sup> in the solution',
        phetioHighFrequency: true
      } );

    this.concentrationOHProperty = new DerivedProperty(
      [ pHProperty ],
      pH => PHModel.pHToConcentrationOH( pH ), {
        tandem: options.tandem.createTandem( 'concentrationOHProperty' ),
        phetioFeatured: true,
        phetioValueType: NullableIO( NumberIO ),
        units: 'mol/L',
        phetioDocumentation: 'concentration of OH<sup>-</sup> in the solution',
        phetioHighFrequency: true
      } );

    this.quantityH2OProperty = new DerivedProperty(
      [ this.concentrationH2OProperty, totalVolumeProperty ],
      ( concentrationH2O, totalVolume ) => PHModel.computeMoles( concentrationH2O, totalVolume ), {
        tandem: options.tandem.createTandem( 'quantityH2OProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>2</sub>O in the solution',
        phetioHighFrequency: true
      } );

    this.quantityH3OProperty = new DerivedProperty(
      [ this.concentrationH3OProperty, totalVolumeProperty ],
      ( concentrationH3O, totalVolume ) => PHModel.computeMoles( concentrationH3O, totalVolume ), {
        tandem: options.tandem.createTandem( 'quantityH3OProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        units: 'mol',
        phetioDocumentation: 'quantity of H<sub>3</sub>O<sup>+</sup> in the solution',
        phetioHighFrequency: true
      } );

    this.quantityOHProperty = new DerivedProperty(
      [ this.concentrationOHProperty, totalVolumeProperty ],
      ( concentrationOH, totalVolume ) => PHModel.computeMoles( concentrationOH, totalVolume ), {
        tandem: options.tandem.createTandem( 'quantityOHProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        units: 'mol',
        phetioDocumentation: 'quantity of OH<sup>-</sup> in the solution',
        phetioHighFrequency: true
      } );

    this.particleCountH2OProperty = new DerivedProperty(
      [ this.concentrationH2OProperty, totalVolumeProperty ],
      ( concentrationH2O, totalVolume ) => PHModel.computeParticleCount( concentrationH2O, totalVolume ), {
        tandem: options.tandem.createTandem( 'particleCountH2OProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'number of H<sub>2</sub>O molecules in the solution',
        phetioHighFrequency: true
      } );

    this.particleCountH3OProperty = new DerivedProperty(
      [ this.concentrationH3OProperty, totalVolumeProperty ],
      ( concentrationH3O, totalVolume ) => PHModel.computeParticleCount( concentrationH3O, totalVolume ), {
        tandem: options.tandem.createTandem( 'particleCountH3OProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'number of H<sub>3</sub>O<sup>+</sup> ions in the solution',
        phetioHighFrequency: true
      } );

    this.particleCountOHProperty = new DerivedProperty(
      [ this.concentrationOHProperty, totalVolumeProperty ],
      ( concentrationOH, totalVolume ) => PHModel.computeParticleCount( concentrationOH, totalVolume ), {
        tandem: options.tandem.createTandem( 'particleCountOHProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'number of OH<sup>-</sup> ions in the solution',
        phetioHighFrequency: true
      } );

    const createScientificNotationProperty = <T>( property: ReadOnlyProperty<T> ): TReadOnlyProperty<ScientificNotation> =>
      new DerivedProperty( [ this.concentrationH3OProperty ],
        h3OConcentration => h3OConcentration !== null ? ScientificNotationNode.toScientificNotation( h3OConcentration ) :
          { mantissa: 'null', exponent: 'null' } );
    this.concentrationH3OScientificNotationProperty = createScientificNotationProperty( this.concentrationH3OProperty );
    this.quantityH3OScientificNotationProperty = createScientificNotationProperty( this.quantityH3OProperty );
    this.concentrationOHScientificNotationProperty = createScientificNotationProperty( this.concentrationOHProperty );
    this.quantityOHScientificNotationProperty = createScientificNotationProperty( this.quantityOHProperty );
  }
}

phScale.register( 'SolutionDerivedProperties', SolutionDerivedProperties );