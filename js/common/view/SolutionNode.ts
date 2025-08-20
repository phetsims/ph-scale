// Copyright 2013-2025, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at the bottom center of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import phScale from '../../phScale.js';
import Beaker from '../model/Beaker.js';
import PHScaleConstants from '../PHScaleConstants.js';
import Solute from '../model/Solute.js';
import AccessibleListNode from '../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { linear } from '../../../../dot/js/util/linear.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { ConcentrationValue } from '../model/PHModel.js';

type SelfOptions = {
  concentrationH3OProperty?: TReadOnlyProperty<ConcentrationValue> | null; // for a11y
  concentrationOHProperty?: TReadOnlyProperty<ConcentrationValue> | null; // for a11y
  soluteProperty?: TReadOnlyProperty<Solute> | null; // for a11y
};

// PhET-iO: do not instrument. See https://github.com/phetsims/ph-scale/issues/108
type SolutionNodeOptions = SelfOptions & StrictOmit<RectangleOptions, 'fill' | 'stroke' | 'tandem' | 'children'>;
export default class SolutionNode extends Rectangle {

  public constructor( solutionVolumeProperty: TReadOnlyProperty<number>,
                      phProperty: TReadOnlyProperty<number | null>,
                      solutionColorProperty: TReadOnlyProperty<Color>,
                      beaker: Beaker,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: SolutionNodeOptions
  ) {
    const options = optionize<SolutionNodeOptions, SelfOptions, RectangleOptions>()( {
      concentrationH3OProperty: null,
      concentrationOHProperty: null,
      soluteProperty: null,

      // The solution node has the information needed to describe the contents of the beaker. To provide the
      // right pdom structure, we put the accessibleHeading on the solution node.
      accessibleHeading: PhScaleStrings.a11y.beaker.accessibleHeadingStringProperty,

      // Add list items to the pdom to describe the solution in the beaker. Only provide the ion comparison if provided
      // by the screenView, since it is not pedagogically relevant for all screens.
      children: [

        // TODO: Would this be clearer in a separate file, like SoluteAccessibleListNode? See https://github.com/phetsims/ph-scale/issues/323
        new AccessibleListNode( [
          {
            stringProperty: PhScaleStrings.a11y.beaker.emptyStringProperty,
            visibleProperty: DerivedProperty.valueEqualsConstant( solutionVolumeProperty, 0 )
          },
          {
            stringProperty: new PatternStringProperty( PhScaleStrings.a11y.beaker.solutionPatternStringProperty, {
              volume: solutionVolumeProperty,
              solute: providedOptions?.soluteProperty ?
                      new DynamicProperty<string, string, Solute>( providedOptions.soluteProperty, { derive: 'nameProperty' } ) :
                      PhScaleStrings.a11y.beaker.unknownSolutionStringProperty
            }, {
              maps: {
                volume: volume => toFixed( volume, PHScaleConstants.VOLUME_DECIMAL_PLACES ),

                // This map is necessary to avoid a type error.
                solute: solute => solute
              }
            } ),

            // We only want to show this list item when there is a solution in the beaker (i.e. volume > 0 and not pure water).
            visibleProperty: new DerivedProperty( [ solutionVolumeProperty, phProperty ],
              ( volume, pH ) => volume > 0 && pH !== 7 )
          },
          {
            stringProperty: new PatternStringProperty( PhScaleStrings.a11y.beaker.waterPatternStringProperty, {
              volume: solutionVolumeProperty
            }, {
              maps: {
                volume: volume => toFixed( volume, PHScaleConstants.VOLUME_DECIMAL_PLACES )
              }
            } ),
            visibleProperty: new DerivedProperty( [ solutionVolumeProperty, phProperty ],
              ( volume, pH ) => volume > 0 && pH === 7 )
          },
          ...( providedOptions?.concentrationOHProperty && providedOptions.concentrationH3OProperty ? [ {
            stringProperty: new PatternStringProperty( PhScaleStrings.a11y.beaker.ionComparisonPatternStringProperty, {
              comparison: new DerivedProperty( [ providedOptions.concentrationH3OProperty, providedOptions.concentrationOHProperty,
                  PhScaleStrings.a11y.beaker.greaterThanStringProperty, PhScaleStrings.a11y.beaker.lessThanStringProperty,
                  PhScaleStrings.a11y.beaker.equalToStringProperty ],
                ( concentrationH3O, concentrationOH, greaterThanString, lessThanString, equalToString ) => {
                  if ( concentrationH3O === null || concentrationOH === null ) {
                    return PhScaleStrings.a11y.unknownStringProperty;
                  }
                  else {
                    // Rounding to nine decimal places was empirically determined to provide consistent results with the pH scale.
                    const roundedH3O = toFixed( concentrationH3O, 9 );
                    const roundedOH = toFixed( concentrationOH, 9 );
                    return roundedH3O > roundedOH ? greaterThanString : roundedH3O < roundedOH ? lessThanString : equalToString;
                  }


                } )
            } ),
            visibleProperty: DerivedProperty.valueNotEqualsConstant( solutionVolumeProperty, 0 )
          } ] : [] )
        ] ) ]
    }, providedOptions );

    super( 0, 0, 1, 1, options ); // the correct size will be set below

    // Update the color of the solution, accounting for saturation.
    solutionColorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor( 0.5 );
    } );

    // Update the amount of stuff in the beaker, based on the solution's total volume.
    const viewPosition = modelViewTransform.modelToViewPosition( beaker.position );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solutionVolumeProperty.link( solutionVolume => {
      assert && assert( solutionVolume >= 0 );

      // min non-zero volume, so that the solution is visible to the user and detectable by the concentration probe
      if ( solutionVolume !== 0 && solutionVolume < PHScaleConstants.MIN_SOLUTION_VOLUME ) {
        solutionVolume = PHScaleConstants.MIN_SOLUTION_VOLUME;
      }

      // determine dimensions in model coordinates
      const solutionHeight = linear( 0, beaker.volume, 0, beaker.size.height, solutionVolume ); // solutionVolume -> height

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );

      // shape
      this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y - viewHeight, viewWidth, viewHeight );
    } );
  }
}

phScale.register( 'SolutionNode', SolutionNode );