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
  var GraphIndicator = require( 'PH_SCALE/common/view/graph/GraphIndicator' );
  var OHMoleculeNode = require( 'PH_SCALE/common/view/OHMoleculeNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  /**
   * @param {Property<Number>} valueProperty
   * @param {*} options
   * @constructor
   */
  function OHIndicator( valueProperty, options ) {
    options = _.extend( {
      backgroundFill: PHScaleColors.BASIC,
      pointerLocation: 'topLeft'
    }, options );
    var labelNode = new SubSupText( 'OH<sup>-</sup>', { font: new PhetFont( 28 ), fill: 'white' } );
    GraphIndicator.call( this, valueProperty, new OHMoleculeNode(), labelNode, options );
  }

  return inherit( GraphIndicator, OHIndicator );
} );