// Copyright 2013-2020, University of Colorado Boulder

/**
 * Displays a volume value, with an left-pointing arrow to the left of the value.
 * The origin is at the tip of the arrowhead.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const ARROW_SIZE = new Dimension2( 21, 28 );
const VALUE_FONT = new PhetFont( { size: 24, weight: 'bold' } );

class VolumeIndicatorNode extends Node {

  /**
   * @param {Property.<number>} totalVolumeProperty
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( totalVolumeProperty, beaker, modelViewTransform, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'indicates the volume of the solution in the beaker'
    }, options );

    super( options );

    // arrow head that points to the left
    const arrowHeadShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( ARROW_SIZE.width, ARROW_SIZE.height / 2 )
      .lineTo( ARROW_SIZE.width, -ARROW_SIZE.height / 2 )
      .close();
    const arrowHead = new Path( arrowHeadShape, { fill: 'black' } );

    // volume value
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

    // update when the total volume of the solution changes...
    totalVolumeProperty.link( totalVolume => {

      // text
      valueNode.text = StringUtils.format( phScaleStrings.pattern[ '0value' ][ '1units' ],
        Utils.toFixed( totalVolume, PHScaleConstants.VOLUME_DECIMAL_PLACES ), phScaleStrings.units.liters );
      valueNode.centerY = arrowHead.centerY;

      // y position
      const solutionHeight = Utils.linear( 0, beaker.volume, 0, beaker.size.height, totalVolume ); // volume -> height, model coordinates
      this.y = modelViewTransform.modelToViewY( beaker.position.y - solutionHeight );
    } );
  }
}

phScale.register( 'VolumeIndicatorNode', VolumeIndicatorNode );
export default VolumeIndicatorNode;