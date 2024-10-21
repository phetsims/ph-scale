// Copyright 2013-2022, University of Colorado Boulder

/**
 * Solution that appears in the beaker.
 * Origin is at bottom center of beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import phScale from '../../phScale.js';
import Beaker from '../model/Beaker.js';
import Solution from '../model/Solution.js';
import PHScaleConstants from '../PHScaleConstants.js';
import PHScaleDescriptionStrings from './description/PHScaleDescriptionStrings.js';
import SolutionDescriber from './SolutionDescriber.js';

export default class SolutionNode extends Rectangle {

  public readonly solutionDescriber: SolutionDescriber;

  public constructor( solution: Solution,
                      beaker: Beaker,
                      modelViewTransform: ModelViewTransform2 ) {

    // PhET-iO: do not instrument. See https://github.com/phetsims/ph-scale/issues/108

    super( 0, 0, 1, 1 ); // correct size will be set below

    // Update the color of the solution, accounting for saturation.
    solution.colorProperty.link( color => {
      this.fill = color;
      this.stroke = color.darkerColor();
    } );

    // Update the amount of stuff in the beaker, based on solution total volume.
    const viewPosition = modelViewTransform.modelToViewPosition( beaker.position );
    const viewWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    solution.totalVolumeProperty.link( solutionVolume => {
      assert && assert( solutionVolume >= 0 );

      // min non-zero volume, so that the solution is visible to the user and detectable by the concentration probe
      if ( solutionVolume !== 0 && solutionVolume < PHScaleConstants.MIN_SOLUTION_VOLUME ) {
        solutionVolume = PHScaleConstants.MIN_SOLUTION_VOLUME;
      }

      // determine dimensions in model coordinates
      const solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, solutionVolume ); // solutionVolume -> height

      // convert to view coordinates and create shape
      const viewHeight = modelViewTransform.modelToViewDeltaY( solutionHeight );

      // shape
      this.setRect( viewPosition.x - ( viewWidth / 2 ), viewPosition.y - viewHeight, viewWidth, viewHeight );
    } );

    this.solutionDescriber = new SolutionDescriber( solution );

    const solutionParagraph = new Node( {
      tagName: 'p',
      visibleProperty: new DerivedProperty( [ solution.soluteVolumeProperty ], soluteVolume => soluteVolume !== 0 ),
      accessibleName: PHScaleDescriptionStrings.solutionParagraph( this.solutionDescriber.soluteDescriptorProperty )
    } );

    const solutionUnorderedList = new Node( { tagName: 'ul' } );
    this.addChild( solutionParagraph );
    this.addChild( solutionUnorderedList );

    const addedWaterVolumeListItem = new Node( {
      tagName: 'li',
      visibleProperty: new DerivedProperty( [ this.solutionDescriber.totalVolumeDescriptorProperty ], totalVolumeDescriptor => totalVolumeDescriptor !== 'empty' )
    } );
    const totalSolutionVolumeListItem = new Node( { tagName: 'li' } );

    solutionUnorderedList.children = [ addedWaterVolumeListItem, totalSolutionVolumeListItem ];

    const solutionIsNeutralStringProperty = PHScaleDescriptionStrings.solutionIsNeutral();
    const solutionAddedVolumeStringProperty = PHScaleDescriptionStrings.solutionAddedVolumeDescription( this.solutionDescriber.soluteColorDescriptorProperty, this.solutionDescriber.addedWaterVolumeDescriptorProperty );
    const solutionAddedVolumeWithWaterStringProperty = PHScaleDescriptionStrings.solutionAddedVolumeDescriptionWithWater( this.solutionDescriber.soluteColorDescriptorProperty, this.solutionDescriber.addedWaterVolumeDescriptorProperty );

    Multilink.multilink( [

      // The Properties controlling the logic for the list item content.
      this.solutionDescriber.soluteDescriptorProperty,
      this.solutionDescriber.soluteColorDescriptorProperty,
      this.solutionDescriber.addedWaterVolumeDescriptorProperty,
      solution.soluteVolumeProperty,

      // Also observing the actual strings as they will change when the language changes.
      solutionIsNeutralStringProperty,
      solutionAddedVolumeStringProperty,
      solutionAddedVolumeWithWaterStringProperty
    ], (
      soluteDescriptor, soluteColorDescriptor, waterVolumeDescriptor, soluteVolume,
      isNeutralString, addedVolumeString, addedVolumeWithWaterString
    ) => {

      if ( soluteDescriptor === 'water' || soluteVolume === 0 ) {

        // If the solute is water, the solution is just described as 'neutral'.
        addedWaterVolumeListItem.innerContent = isNeutralString;
      }
      else if ( soluteColorDescriptor === 'colorless' || waterVolumeDescriptor === 'no' ) {

        // If the solute is colorless or there is no added water yet, a discription of the solute is provided.
        addedWaterVolumeListItem.innerContent = addedVolumeString;
      }
      else {

        // If there is a solute with color and there is added water, describe the lighter color
        addedWaterVolumeListItem.innerContent = addedVolumeWithWaterString;
      }
    } );

    totalSolutionVolumeListItem.innerContent = PHScaleDescriptionStrings.solutionTotalVolumeDescription( this.solutionDescriber.totalVolumeDescriptorProperty, this.solutionDescriber.formattedVolumeStringProperty );
  }
}

phScale.register( 'SolutionNode', SolutionNode );