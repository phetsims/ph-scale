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
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
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

    GraphIndicator.call( this, valueProperty,
      new OHMoleculeNode(),
      new SubSupText( PHScaleConstants.OH_FORMULA, { font: new PhetFont( 28 ), fill: 'white' } ),
      options );
  }

  return inherit( GraphIndicator, OHIndicator );
} );