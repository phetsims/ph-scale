// Copyright 2013-2020, University of Colorado Boulder

/**
 * Displays a volume value, with an left-pointing arrow to the left of the value.
 * The origin is at the tip of the arrowhead.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  // strings
  const pattern0Value1UnitsString = require( 'string!PH_SCALE/pattern.0value.1units' );
  const unitsLitersString = require( 'string!PH_SCALE/units.liters' );

  // constants
  const ARROW_SIZE = new Dimension2( 21, 28 );
  const VALUE_FONT = new PhetFont( { size: 24, weight: 'bold' } );

  class VolumeIndicatorNode extends Node {
    /**
     * @param {Property.<number>} volumeProperty
     * @param {Beaker} beaker
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( volumeProperty, beaker, modelViewTransform ) {

      super();

      // nodes
      const arrowHead = new Path( new Shape()
          .moveTo( 0, 0 )
          .lineTo( ARROW_SIZE.width, ARROW_SIZE.height / 2 )
          .lineTo( ARROW_SIZE.width, -ARROW_SIZE.height / 2 )
          .close(),
        { fill: 'black' } );
      const valueNode = new Text( '0', {
        font: VALUE_FONT,
        left: arrowHead.right + 3,
        maxWidth: 75
      } );

      // rendering order
      this.addChild( valueNode );
      this.addChild( arrowHead );

      // x position
      this.left = modelViewTransform.modelToViewX( beaker.right ) + 3;

      // update when the volume changes...
      volumeProperty.link( volume => {

        // text
        valueNode.text = StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( volume, PHScaleConstants.VOLUME_DECIMAL_PLACES ), unitsLitersString );
        valueNode.centerY = arrowHead.centerY;

        // y position
        const solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, volume ); // volume -> height, model coordinates
        this.y = modelViewTransform.modelToViewY( beaker.position.y - solutionHeight );
      } );
    }
  }

  return phScale.register( 'VolumeIndicatorNode', VolumeIndicatorNode );
} );