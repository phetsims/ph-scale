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

  /**
   * @param {Property<Number>} valueProperty
   * @param {*} options
   * @constructor
   */
  function H2OIndicatorNode( valueProperty, options ) {
    options = _.extend( { pointerLocation: 'topLeft' }, options );
    var thisNode = this;
    var labelNode = new HTMLText( 'OH<sup>-</sup>', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicatorNode.call( thisNode, valueProperty, new OHMoleculeNode(), labelNode, PHScaleColors.BASIC, options );
  }

  return inherit( GraphIndicatorNode, H2OIndicatorNode );
} );