// Copyright 2013-2020, University of Colorado Boulder

/**
 * Displays the number of molecules in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const H2ONode = require( 'PH_SCALE/common/view/molecules/H2ONode' );
  const H3ONode = require( 'PH_SCALE/common/view/molecules/H3ONode' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const OHNode = require( 'PH_SCALE/common/view/molecules/OHNode' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );

  class MoleculeCountNode extends Node {
    /**
     * @param {Solution} solution
     */
    constructor( solution, options ) {

      super();

      // margins and spacing
      const xMargin = 10;
      const yMargin = 5;
      const xSpacing = 10;
      const ySpacing = 6;

      // molecule icons
      const nodeH3O = new H3ONode();
      const nodeOH = new OHNode();
      const nodeH2O = new H2ONode();
      const maxMoleculeWidth = Math.max( nodeH3O.width, Math.max( nodeOH.width, nodeH2O.width ) );
      const maxMoleculeHeight = Math.max( nodeH3O.height, Math.max( nodeOH.height, nodeH2O.height ) );

      // internal properties for counts
      const countH3OProperty = new NumberProperty( 1e16 );
      const countOHProperty = new NumberProperty( 1e16 );
      const countH2OProperty = new NumberProperty( 1e16 );

      // count values
      const notationOptions = { font: new PhetFont( 22 ), fill: 'white', mantissaDecimalPlaces: 2 };
      const countH3ONode = new ScientificNotationNode( countH3OProperty, notationOptions );
      const countOHNode = new ScientificNotationNode( countOHProperty, notationOptions );
      const countH2ONode = new ScientificNotationNode( countH2OProperty, merge( { exponent: 25 }, notationOptions ) );
      const maxCountWidth = countH3ONode.width;
      const maxCountHeight = countH3ONode.height;

      // backgrounds
      const backgroundWidth = maxCountWidth + xSpacing + maxMoleculeWidth + ( 2 * xMargin );
      const backgroundHeight = Math.max( maxCountHeight, maxMoleculeHeight ) + ( 2 * yMargin );
      const cornerRadius = 5;
      const backgroundStroke = 'rgb(200,200,200)';
      const backgroundH3O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
        { fill: PHScaleColors.ACIDIC, stroke: backgroundStroke } );
      const backgroundOH = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
        { fill: PHScaleColors.BASIC, stroke: backgroundStroke } );
      const backgroundH2O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
        { fill: PHScaleColors.H2O_BACKGROUND, stroke: backgroundStroke } );

      // rendering order
      this.addChild( backgroundH3O );
      this.addChild( backgroundOH );
      this.addChild( backgroundH2O );
      this.addChild( countH3ONode );
      this.addChild( countOHNode );
      this.addChild( countH2ONode );
      this.addChild( nodeH3O );
      this.addChild( nodeOH );
      this.addChild( nodeH2O );

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
      // counts will be dynamically positioned

      // update counts when the solution changes
      const moleculesLeft = Math.min( nodeH3O.left, Math.min( nodeOH.left, nodeH2O.left ) ); // for right justifying counts
      const updateCounts = () => {

        // set counts, which in turn updates values displayed by nodes
        countH3OProperty.set( solution.getMoleculesH3O() );
        countOHProperty.set( solution.getMoleculesOH() );
        countH2OProperty.set( solution.getMoleculesH2O() );

        // right justified
        countH3ONode.right = moleculesLeft - xSpacing;
        countOHNode.right = moleculesLeft - xSpacing;
        countH2ONode.right = moleculesLeft - xSpacing;

        // vertically centered
        countH3ONode.centerY = backgroundH3O.centerY;
        countOHNode.centerY = backgroundOH.centerY;
        countH2ONode.centerY = backgroundH2O.centerY;
      };
      solution.pHProperty.link( updateCounts.bind( this ) );
      solution.waterVolumeProperty.link( updateCounts.bind( this ) );
      solution.soluteVolumeProperty.link( updateCounts.bind( this ) );

      this.mutate( options );
    }
  }

  return phScale.register( 'MoleculeCountNode', MoleculeCountNode );
} );
