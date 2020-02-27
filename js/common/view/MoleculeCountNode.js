// Copyright 2013-2020, University of Colorado Boulder

/**
 * Displays the number of molecules in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ScientificNotationNode from '../../../../scenery-phet/js/ScientificNotationNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import phScale from '../../phScale.js';
import PHScaleColors from '../PHScaleColors.js';
import H2ONode from './molecules/H2ONode.js';
import H3ONode from './molecules/H3ONode.js';
import OHNode from './molecules/OHNode.js';

class MoleculeCountNode extends Node {

  /**
   * @param {Solution} solution
   * @param {Property.<boolean>} moleculeCountVisibleProperty
   * @param {Object} [options]
   */
  constructor( solution, moleculeCountVisibleProperty, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioComponentOptions: {
        visibleProperty: {
          phetioReadOnly: true
        }
      },
      phetioDocumentation: 'displays the number of molecules in the solution'
    }, options );

    // margins and spacing
    const xMargin = 10;
    const yMargin = 5;
    const xSpacing = 10;
    const ySpacing = 6;

    const countH3OProperty = new DerivedProperty(
      [ solution.pHProperty, solution.waterVolumeProperty, solution.soluteVolumeProperty ],
      ( pH, waterVolume, soluteVolume ) => solution.getMoleculesH3O(), {
        tandem: options.tandem.createTandem( 'countH3OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO )
      } );

    const countOHProperty = new DerivedProperty(
      [ solution.pHProperty, solution.waterVolumeProperty, solution.soluteVolumeProperty ],
      ( pH, waterVolume, soluteVolume ) => solution.getMoleculesOH(), {
        tandem: options.tandem.createTandem( 'countOHProperty' ),
        phetioType: DerivedPropertyIO( NumberIO )
      } );

    const countH2OProperty = new DerivedProperty(
      [ solution.pHProperty, solution.waterVolumeProperty, solution.soluteVolumeProperty ],
      ( pH, waterVolume, soluteVolume ) => solution.getMoleculesH2O(), {
        tandem: options.tandem.createTandem( 'countH2OProperty' ),
        phetioType: DerivedPropertyIO( NumberIO )
      } );

    // count values
    const notationOptions = {
      font: new PhetFont( 22 ),
      fill: 'white',
      mantissaDecimalPlaces: 2
    };
    const countH3ONode = new ScientificNotationNode( countH3OProperty, notationOptions );
    const countOHNode = new ScientificNotationNode( countOHProperty, notationOptions );
    const countH2ONode = new ScientificNotationNode( countH2OProperty, merge( { exponent: 25 }, notationOptions ) );
    const maxCountWidth = new ScientificNotationNode( new Property( 1e16 ), notationOptions ).width;
    const maxCountHeight = countH3ONode.height;

    // molecule icons
    const nodeH3O = new H3ONode();
    const nodeOH = new OHNode();
    const nodeH2O = new H2ONode();
    const maxMoleculeWidth = Math.max( nodeH3O.width, Math.max( nodeOH.width, nodeH2O.width ) );
    const maxMoleculeHeight = Math.max( nodeH3O.height, Math.max( nodeOH.height, nodeH2O.height ) );

    // backgrounds
    const backgroundWidth = maxCountWidth + xSpacing + maxMoleculeWidth + ( 2 * xMargin );
    const backgroundHeight = Math.max( maxCountHeight, maxMoleculeHeight ) + ( 2 * yMargin );
    const backgroundOptions = {
      cornerRadius: 5,
      backgroundStroke: 'rgb( 200, 200, 200 )'
    };
    const backgroundH3O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, merge( {
      fill: PHScaleColors.ACIDIC
    }, backgroundOptions ) );
    const backgroundOH = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, merge( {
      fill: PHScaleColors.BASIC
    }, backgroundOptions ) );
    const backgroundH2O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, merge( {
      fill: PHScaleColors.H2O_BACKGROUND
    }, backgroundOptions ) );

    assert && assert( !options.children, 'MoleculeCountsNode sets children' );
    options.children = [
      backgroundH3O, backgroundOH, backgroundH2O,
      countH3ONode, countOHNode, countH2ONode,
      nodeH3O, nodeOH, nodeH2O
    ];
    super( options );

    // layout...
    // backgrounds are vertically stacked
    backgroundOH.left = backgroundH3O.left;
    backgroundOH.top = backgroundH3O.bottom + ySpacing;
    backgroundH2O.left = backgroundOH.left;
    backgroundH2O.top = backgroundOH.bottom + ySpacing;
    // molecule icons are vertically centered in the backgrounds, horizontally centered above each other
    nodeH3O.centerX = backgroundH3O.right - xMargin - ( maxMoleculeWidth / 2 );
    nodeH3O.centerY = backgroundH3O.centerY;
    nodeOH.centerX = backgroundOH.right - xMargin - ( maxMoleculeWidth / 2 );
    nodeOH.centerY = backgroundOH.centerY;
    nodeH2O.centerX = backgroundH2O.right - xMargin - ( maxMoleculeWidth / 2 );
    nodeH2O.centerY = backgroundH2O.centerY;

    // reposition counts when they change: right justified, vertically centered
    const countRight = Math.min( nodeH3O.left, Math.min( nodeOH.left, nodeH2O.left ) ) - xSpacing;
    countH3OProperty.link( () => {
      countH3ONode.right = countRight;
      countH3ONode.centerY = backgroundH3O.centerY;
    } );
    countOHProperty.link( () => {
      countOHNode.right = countRight;
      countOHNode.centerY = backgroundOH.centerY;
    } );
    countH2OProperty.link( () => {
      countH2ONode.right = countRight;
      countH2ONode.centerY = backgroundH2O.centerY;
    } );

    moleculeCountVisibleProperty.linkAttribute( this, 'visible' );

    // Create a link to moleculeCountVisibleProperty, so it's easier to find in Studio.
    this.addLinkedElement( moleculeCountVisibleProperty, {
      tandem: options.tandem.createTandem( 'moleculeCountVisibleProperty' )
    } );
  }
}

phScale.register( 'MoleculeCountNode', MoleculeCountNode );
export default MoleculeCountNode;