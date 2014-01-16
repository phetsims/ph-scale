// Copyright 2002-2013, University of Colorado Boulder

/**
 * Displays the number of molecules in the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var H2OMoleculeNode = require( 'PH_SCALE/common/view/H2OMoleculeNode' );
  var H3OMoleculeNode = require( 'PH_SCALE/common/view/H3OMoleculeNode' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OHMoleculeNode = require( 'PH_SCALE/common/view/OHMoleculeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHUtils = require( 'PH_SCALE/common/PHUtils' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function MoleculeCountNode( solution, options ) {

    var thisNode = this;
    Node.call( thisNode );

    // margins and spacing
    var xMargin = 10;
    var yMargin = 5;
    var xSpacing = 10;
    var ySpacing = 6;

    // molecule icons
    var nodeH3O = new H3OMoleculeNode();
    var nodeOH = new OHMoleculeNode();
    var nodeH2O = new H2OMoleculeNode();
    var maxMoleculeWidth = Math.max( nodeH3O.width, Math.max( nodeOH.width, nodeH2O.width ) );
    var maxMoleculeHeight = Math.max( nodeH3O.height, Math.max( nodeOH.height, nodeH2O.height ) );

    // count values
    var font = new PhetFont( 22 );
    var countH3O = new HTMLText( '0.00 x 10<sup>00</sup>', { font: font, fill: 'white' } );
    var countOH = new HTMLText( '0.00 x 10<sup>00</sup>', { font: font, fill: 'white' } );
    var countH2O = new HTMLText( '0.00 x 10<sup>00</sup>', { font: font, fill: 'white' } );
    var maxCountWidth = countH3O.width;
    var maxCountHeight = countH3O.height;

    // backgrounds
    var backgroundWidth = maxCountWidth + xSpacing + maxMoleculeWidth + ( 2 * xMargin );
    var backgroundHeight = Math.max( maxCountHeight, maxMoleculeHeight ) + ( 2 * yMargin );
    var cornerRadius = 5;
    var backgroundStroke = 'rgb(200,200,200)';
    var backgroundH3O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.ACIDIC, stroke: backgroundStroke } );
    var backgroundOH = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.BASIC, stroke: backgroundStroke } );
    var backgroundH2O = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
      { fill: PHScaleColors.H2O_BACKGROUND, stroke: backgroundStroke } );

    // rendering order
    thisNode.addChild( backgroundH3O );
    thisNode.addChild( backgroundOH );
    thisNode.addChild( backgroundH2O );
    thisNode.addChild( countH3O );
    thisNode.addChild( countOH );
    thisNode.addChild( countH2O );
    thisNode.addChild( nodeH3O );
    thisNode.addChild( nodeOH );
    thisNode.addChild( nodeH2O );

    // layout
    {
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
      // counts are vertically centered in the backgrounds
      countH3O.centerY = backgroundH3O.centerY;
      countOH.centerY = backgroundOH.centerY;
      countH2O.centerY = backgroundH2O.centerY;
      // counts will be dynamically right-justified
    }

    // update counts when the solution changes
    var moleculesLeft = Math.min( nodeH3O.left, Math.min( nodeOH.left, nodeH2O.left ) ); // for right justifying counts
    var updateCounts = function() {
      // format and set values
      countH3O.text = PHUtils.toTimesTenString( solution.getMoleculesH3O(), 2 );
      countOH.text = PHUtils.toTimesTenString( solution.getMoleculesOH(), 2 );
      countH2O.text = PHUtils.toTimesTenString( solution.getMoleculesH2O(), 2, 25 );
      // right justify
      countH3O.right = moleculesLeft - xSpacing;
      countOH.right = moleculesLeft - xSpacing;
      countH2O.right = moleculesLeft - xSpacing;
    };
    solution.pHProperty.link( updateCounts );
    solution.waterVolumeProperty.link( updateCounts );
    solution.soluteVolumeProperty.link( updateCounts );

    this.mutate( options );
  }

  return inherit( Node, MoleculeCountNode );
} );
