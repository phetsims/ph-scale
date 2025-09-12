// Copyright 2013-2025, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at the bottom center of the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import phScale from '../../phScale.js';
import Beaker from '../model/Beaker.js';
import PHScaleConstants from '../PHScaleConstants.js';
import Solute from '../model/Solute.js';
import SoluteAccessibleListNode from './particles/SoluteAccessibleListNode.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { linear } from '../../../../dot/js/util/linear.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { ConcentrationValue } from '../model/PHModel.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';

type SelfOptions = {
  ratioVisibleProperty?: TReadOnlyProperty<boolean> | null; // for a11y
  concentrationH3OProperty?: TReadOnlyProperty<ConcentrationValue> | null; // for a11y
  concentrationOHProperty?: TReadOnlyProperty<ConcentrationValue> | null; // for a11y
  soluteProperty?: TReadOnlyProperty<Solute> | null; // for a11y
};

// PhET-iO: do not instrument. See https://github.com/phetsims/ph-scale/issues/108
type SolutionNodeOptions = SelfOptions & StrictOmit<RectangleOptions, 'fill' | 'stroke' | 'tandem' | 'children'>;
export default class SolutionNode extends Rectangle {

  // This class property is used in the MacroScreenView to define the pdom structure of content that is nested under
  // the beaker heading.
  public readonly soluteAccessibleListNode: SoluteAccessibleListNode;

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
      ratioVisibleProperty: null,

      // The solution node has the information needed to describe the contents of the beaker. To provide the
      // right pdom structure, we put the accessibleHeading on the solution node.
      accessibleHeading: PhScaleStrings.a11y.beaker.accessibleHeadingStringProperty
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
      affirm( solutionVolume >= 0 );

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

    // Add list items to the pdom to describe the solution in the beaker. Only provide the ion comparison if provided
    // by the screenView, since it is not pedagogically relevant for all screens.
    this.soluteAccessibleListNode = new SoluteAccessibleListNode(
      solutionVolumeProperty,
      phProperty,
      options.soluteProperty,
      options.concentrationH3OProperty,
      options.concentrationOHProperty,
      options.ratioVisibleProperty
    );
    this.addChild( this.soluteAccessibleListNode );
  }
}

phScale.register( 'SolutionNode', SolutionNode );