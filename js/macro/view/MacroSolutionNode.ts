// Copyright 2024, University of Colorado Boulder

/**
 * MacroSolutionNode is a view node that represents a solution in a beaker for the 'Macro' screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Beaker from '../../common/model/Beaker.js';
import Solution from '../../common/model/Solution.js';
import SolutionDescriber from '../../common/view/SolutionDescriber.js';
import SolutionNode from '../../common/view/SolutionNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import PHScaleDescriptionStrings from '../../common/view/description/PHScaleDescriptionStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import phScale from '../../phScale.js';

export default class MacroSolutionNode extends SolutionNode {
  public readonly solutionDescriber: SolutionDescriber;

  public constructor( solution: Solution, beaker: Beaker, modelViewTransform: ModelViewTransform2 ) {
    super( solution.totalVolumeProperty, solution.colorProperty, beaker, modelViewTransform );

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

phScale.register( 'MacroSolutionNode', MacroSolutionNode );