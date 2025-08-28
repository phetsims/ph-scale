// Copyright 2024, University of Colorado Boulder

/**
 * Creates a list that describes the solutes for accessibility.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import AccessibleListNode from '../../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import phScale from '../../../phScale.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import { ConcentrationValue } from '../../model/PHModel.js';
import Solute from '../../model/Solute.js';
import PhScaleStrings from '../../../PhScaleStrings.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import DynamicProperty from '../../../../../axon/js/DynamicProperty.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import PHScaleConstants from '../../PHScaleConstants.js';

export default class SoluteAccessibleListNode extends AccessibleListNode {

  public constructor( solutionVolumeProperty: TReadOnlyProperty<number>,
                      phProperty: TReadOnlyProperty<number | null>,
                      soluteProperty: TReadOnlyProperty<Solute> | null,
                      concentrationH3OProperty: TReadOnlyProperty<ConcentrationValue> | null,
                      concentrationOHProperty: TReadOnlyProperty<ConcentrationValue> | null ) {

    const items = [
      {
        stringProperty: PhScaleStrings.a11y.beaker.emptyStringProperty,
        visibleProperty: new DerivedProperty( [ solutionVolumeProperty ], volume => volume === 0 )
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.beaker.solutionPatternStringProperty, {
          volume: solutionVolumeProperty,
          solute: soluteProperty ?
                  new DynamicProperty<string, string, Solute>( soluteProperty, { derive: 'nameProperty' } ) :
                  PhScaleStrings.a11y.beaker.unknownSolutionStringProperty
        }, {
          maps: {
            volume: ( volume: number ) => toFixed( volume, PHScaleConstants.VOLUME_DECIMAL_PLACES ),
            solute: ( solute: string ) => solute
          }
        } ),
        visibleProperty: new DerivedProperty( [ solutionVolumeProperty, phProperty ],
          ( volume, pH ) => volume > 0 && pH !== 7 )
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.beaker.waterPatternStringProperty, {
          volume: solutionVolumeProperty
        }, {
          maps: {
            volume: ( volume: number ) => toFixed( volume, PHScaleConstants.VOLUME_DECIMAL_PLACES )
          }
        } ),
        visibleProperty: new DerivedProperty( [ solutionVolumeProperty, phProperty ],
          ( volume, pH ) => volume > 0 && pH === 7 )
      },
      ...( concentrationOHProperty && concentrationH3OProperty ? [ {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.beaker.ionComparisonPatternStringProperty, {
          comparison: new DerivedProperty( [ concentrationH3OProperty, concentrationOHProperty,
              PhScaleStrings.a11y.beaker.greaterThanStringProperty, PhScaleStrings.a11y.beaker.lessThanStringProperty,
              PhScaleStrings.a11y.beaker.equalToStringProperty ],
            ( concentrationH3O, concentrationOH, greaterThanString, lessThanString, equalToString ) => {
              if ( typeof concentrationH3O !== 'number' || typeof concentrationOH !== 'number' ) {
                return PhScaleStrings.a11y.unknownStringProperty;
              }
              else {
                const roundedH3O = toFixed( concentrationH3O, 9 );
                const roundedOH = toFixed( concentrationOH, 9 );
                return roundedH3O > roundedOH ? greaterThanString : roundedH3O < roundedOH ? lessThanString : equalToString;
              }
            } )
        } ),
        visibleProperty: new DerivedProperty( [ solutionVolumeProperty ], volume => volume > 0 )
      } ] : [] )
    ];

    super( items );
  }
}

phScale.register( 'SoluteAccessibleListNode', SoluteAccessibleListNode );