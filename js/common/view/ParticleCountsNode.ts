// Copyright 2013-2025, University of Colorado Boulder

/**
 * ParticleCountsNode displays a count for each type of particle in the beaker.
 *
 * NOTE: Prior to 12/15/2022, this class was named MoleculeCountNode. We discovered that 'molecule' was incorrect
 * terminology here, because a molecule is neutral. While H2O is indeed a molecule, H3O+ and OH+ are charged
 * and should be referred to as ions. Since 'particles can be atoms, molecules or ions', we chose the term
 * 'particle' because we are displaying counts for both molecules and ions. This terminology change was made
 * throughout the sim where appropriate. More at https://github.com/phetsims/ph-scale/issues/258
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ScientificNotationNode, { ScientificNotationNodeOptions } from '../../../../scenery-phet/js/ScientificNotationNode.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox, { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import phScale from '../../phScale.js';
import SolutionDerivedProperties from '../model/SolutionDerivedProperties.js';
import PHScaleColors from '../PHScaleColors.js';
import H2ONode from './particles/H2ONode.js';
import H3ONode from './particles/H3ONode.js';
import OHNode from './particles/OHNode.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import PHScaleConstants from '../PHScaleConstants.js';

type SelfOptions = EmptySelfOptions;

type ParticleCountsNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class ParticleCountsNode extends Node {

  public constructor( derivedProperties: SolutionDerivedProperties, providedOptions: ParticleCountsNodeOptions ) {

    const options = optionize<ParticleCountsNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioDocumentation: 'displays the number of particles (ions and molecules) in the solution'
    }, providedOptions );

    // margins and spacing
    const xMargin = 10;
    const yMargin = 5;
    const xSpacing = 10;
    const ySpacing = 6;

    // count values
    const notationOptions: ScientificNotationNodeOptions = {
      font: new PhetFont( 22 ),
      fill: 'black',
      mantissaDecimalPlaces: 2
    };
    const formulaOptions = {
      font: new PhetFont( 22 ),
      fill: 'black'
    };
    const countsAlignBoxOptions: AlignBoxOptions = {
      group: new AlignGroup(),
      xAlign: 'right',
      yAlign: 'center'
    };
    const countH3ONode = new AlignBox( new ScientificNotationNode( derivedProperties.particleCountH3OProperty, notationOptions ), countsAlignBoxOptions );
    const countOHNode = new AlignBox( new ScientificNotationNode( derivedProperties.particleCountOHProperty, notationOptions ), countsAlignBoxOptions );
    const countH2ONode = new AlignBox( new ScientificNotationNode( derivedProperties.particleCountH2OProperty,
      combineOptions<ScientificNotationNodeOptions>( {}, notationOptions, { exponent: 25 } ) ), countsAlignBoxOptions );

    // Add an invisible count to the group, so that we get the correct (maximum) width.
    const invisibleCountNode = new AlignBox( new ScientificNotationNode( new Property( 1e16 ), notationOptions ), countsAlignBoxOptions );
    invisibleCountNode.visible = false;

    // formulas
    const formulaH3O = new RichText( PHScaleConstants.H3O_FORMULA, formulaOptions );
    const formulaOH = new RichText( PHScaleConstants.OH_FORMULA, formulaOptions );
    const formulaH2O = new RichText( PHScaleConstants.H2O_FORMULA, formulaOptions );

    // particle icons
    const iconsAlignBoxOptions: AlignBoxOptions = {
      group: new AlignGroup(),
      xAlign: 'center',
      yAlign: 'center'
    };
    const iconH3O = new AlignBox( new H3ONode(), iconsAlignBoxOptions );
    const iconOH = new AlignBox( new OHNode(), iconsAlignBoxOptions );
    const iconH2O = new AlignBox( new H2ONode(), iconsAlignBoxOptions );

    // HBoxes for layout
    const hboxH3O = new HBox( {
      children: [ countH3ONode, formulaH3O, iconH3O ],
      spacing: xSpacing
    } );
    const hboxOH = new HBox( {
      children: [ countOHNode, formulaOH, iconOH ],
      spacing: xSpacing
    } );
    const hboxH2O = new HBox( {
      children: [ countH2ONode, formulaH2O, iconH2O ],
      spacing: xSpacing
    } );

    // backgrounds
    const backgroundWidth = hboxH3O.width + ( 2 * xMargin );
    const backgroundHeight = hboxH3O.height + ( 2 * yMargin );
    const backgroundOptions = {
      cornerRadius: 5,
      backgroundStroke: 'rgb( 200, 200, 200 )'
    };
    const backgroundH3O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, combineOptions<RectangleOptions>(
      {}, backgroundOptions, { fill: PHScaleColors.acidicColorProperty } ) );
    const backgroundOH = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, combineOptions<RectangleOptions>(
      {}, backgroundOptions, { fill: PHScaleColors.basicColorProperty } ) );
    const backgroundH2O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, combineOptions<RectangleOptions>(
      {}, backgroundOptions, { fill: PHScaleColors.h2OBackgroundColorProperty } ) );

    options.children = [
      backgroundH3O, hboxH3O,
      backgroundOH, hboxOH,
      backgroundH2O, hboxH2O
    ];
    super( options );

    // layout...
    // backgrounds are vertically stacked
    backgroundOH.left = backgroundH3O.left;
    backgroundOH.top = backgroundH3O.bottom + ySpacing;
    backgroundH2O.left = backgroundOH.left;
    backgroundH2O.top = backgroundOH.bottom + ySpacing;
    // counts and icons are centered in backgrounds
    hboxH3O.center = backgroundH3O.center;
    hboxOH.center = backgroundOH.center;
    hboxH2O.center = backgroundH2O.center;

    // Links to the count Properties
    this.addLinkedElement( derivedProperties.particleCountH3OProperty, {
      tandemName: 'particleCountH3OProperty'
    } );

    this.addLinkedElement( derivedProperties.particleCountOHProperty, {
      tandemName: 'particleCountOHProperty'
    } );

    this.addLinkedElement( derivedProperties.particleCountH2OProperty, {
      tandemName: 'particleCountH2OProperty'
    } );
  }
}

phScale.register( 'ParticleCountsNode', ParticleCountsNode );