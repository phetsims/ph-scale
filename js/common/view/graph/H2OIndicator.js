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
  var GraphIndicator = require( 'PH_SCALE/common/view/graph/GraphIndicator' );
  var H2OMoleculeNode = require( 'PH_SCALE/common/view/H2OMoleculeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var SubSupText = require( 'PH_SCALE/common/view/SubSupText' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {*} options
   * @constructor
   */
  function H2OIndicator( valueProperty, options ) {
    options = _.extend( {
      exponent: 0,
      mantissaDecimalPlaces: 0,
      pointerLocation: 'bottomLeft' }, options );
    var labelNode = new SubSupText( 'H<sub>2</sub>O', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicator.call( this, valueProperty, new H2OMoleculeNode(), labelNode, PHScaleColors.H2O_BACKGROUND, options );
  }

  return inherit( GraphIndicator, H2OIndicator );
} );