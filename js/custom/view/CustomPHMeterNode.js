// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Custom' screen.
 * Origin is at top left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PHValueNode = require( 'PH_SCALE/common/view/PHValueNode' );

  /**
   * @param {PHMeter} meter
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function CustomPHMeterNode( meter, mvt ) {

    var thisNode = this;
    PHValueNode.call( thisNode, meter.valueProperty );

    // location
    meter.body.locationProperty.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );
  }

  return inherit( PHValueNode, CustomPHMeterNode );
} );
