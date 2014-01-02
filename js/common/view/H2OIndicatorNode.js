// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph indicator that points to the value for H2O (water).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var GraphIndicatorNode = require( 'PH_SCALE/common/view/GraphIndicatorNode' );
  var H2OMoleculeNode = require( 'PH_SCALE/common/view/H2OMoleculeNode' );
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
    options.pointerLocation = 'bottomLeft';
    var thisNode = this;
    var valueProperty = new Property( 55 ); //TODO compute initial value
    var labelNode = new HTMLText( 'H<sub>2</sub>O', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicatorNode.call( thisNode, valueProperty, new H2OMoleculeNode(), labelNode, PHScaleColors.H2O_BACKGROUND, options );
    //TODO update valueProperty when solution changes
  }

  return inherit( GraphIndicatorNode, H2OIndicatorNode );
} );