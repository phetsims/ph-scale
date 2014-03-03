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
  var GraphIndicator = require( 'PH_SCALE/common/view/graph/GraphIndicator' );
  var H3OMoleculeNode = require( 'PH_SCALE/common/view/H3OMoleculeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {*} options
   * @constructor
   */
  function H3OIndicator( valueProperty, options ) {
    options = _.extend( { pointerLocation: 'topRight' }, options );
    var labelNode = new SubSupText( 'H<sub>3</sub>O<sup>+</sup>', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicator.call( this, valueProperty, new H3OMoleculeNode(), labelNode, PHScaleColors.ACIDIC, options );
  }

  return inherit( GraphIndicator, H3OIndicator );
} );