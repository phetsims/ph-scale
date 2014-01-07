// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph indicator that points to the value for H3O+ (hydronium).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var GraphIndicatorNode = require( 'PH_SCALE/common/view/graph/GraphIndicatorNode' );
  var H3OMoleculeNode = require( 'PH_SCALE/common/view/H3OMoleculeNode' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {*} options
   * @constructor
   */
  function H2OIndicatorNode( valueProperty, options ) {
    options = _.extend( { pointerLocation: 'topRight' }, options );
    var thisNode = this;
    var labelNode = new HTMLText( 'H<sub>3</sub>O<sup>+</sup>', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicatorNode.call( thisNode, valueProperty, new H3OMoleculeNode(), labelNode, PHScaleColors.ACIDIC, options );
  }

  return inherit( GraphIndicatorNode, H2OIndicatorNode );
} );