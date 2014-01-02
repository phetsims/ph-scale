// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph indicator that points to the value for OH- (hydroxide).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var GraphIndicatorNode = require( 'PH_SCALE/common/view/graph/GraphIndicatorNode' );
  var OHMoleculeNode = require( 'PH_SCALE/common/view/OHMoleculeNode' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Solution} solution
   * @param {*} options
   * @constructor
   */
  function H2OIndicatorNode( solution, options ) {
    options.pointerLocation = 'topLeft';
    var thisNode = this;
    var valueProperty = new Property( 0.000000000000012 ); //TODO compute initial value
    var labelNode = new HTMLText( 'OH<sup>-</sup>', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicatorNode.call( thisNode, valueProperty, new OHMoleculeNode(), labelNode, PHScaleColors.BASIC, options );
    //TODO update valueProperty when solution changes
  }

  return inherit( GraphIndicatorNode, H2OIndicatorNode );
} );