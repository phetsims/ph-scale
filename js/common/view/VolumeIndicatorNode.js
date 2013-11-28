// Copyright 2002-2013, University of Colorado Boulder

/**
 * Displays a volume value, with an left-pointing arrow to the left of the value.
 * The origin is at the tip of the arrowhead.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern_0value_1units = require( 'string!PH_SCALE/pattern.0value.1units' );
  var litersString = require( 'string!PH_SCALE/units.liters' );

  // constants
  var ARROW_SIZE = new Dimension2( 21, 28 );
  var VALUE_FONT = new PhetFont( 28 );

  function VolumeIndicatorNode( volumeProperty, beaker, mvt ) {

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var arrowHead = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( -ARROW_SIZE.width, ARROW_SIZE.height / 2 )
      .lineTo( -ARROW_SIZE.width, -ARROW_SIZE.height / 2 )
      .close(),
      { fill: 'black' } );
    var valueNode = new Text( '0', {
      font: VALUE_FONT,
      centerY: arrowHead.centerY
    } );

    // rendering order
    thisNode.addChild( valueNode );
    thisNode.addChild( arrowHead );

    // update when the volume changes
    volumeProperty.link( function( volume ) {

      // value
      valueNode.text = StringUtils.format( pattern_0value_1units, Util.toFixed( volume, PHScaleConstants.VOLUME_DECIMAL_PLACES ), litersString );
      valueNode.right = arrowHead.left - 5;
      thisNode.right = mvt.modelToViewX( beaker.left ) - 3;

      // location
      var solutionHeight = Util.linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height, model coordinates
      thisNode.y = mvt.modelToViewY( beaker.location.y - solutionHeight );
    } );
  }

  return inherit( Node, VolumeIndicatorNode );
} );