// Copyright 2013-2020, University of Colorado Boulder

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Origin is at the bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScaleStrings from '../../phScaleStrings.js';
import phScale from '../../phScale.js';

//strings
const pattern0Value1UnitsString = phScaleStrings.pattern[ '0value' ][ '1units' ];
const unitsLitersString = phScaleStrings.units.liters;

// constants
const RIM_OFFSET = 20;
const MINOR_TICK_SPACING = 0.1; // L
const MINOR_TICKS_PER_MAJOR_TICK = 5;
const MAJOR_TICK_LENGTH = 30;
const MINOR_TICK_LENGTH = 15;
const TICK_LABEL_X_SPACING = 8;
const MAJOR_TICK_LABELS = [ '\u00bd', '1' ]; // 1/2, 1
const MAJOR_TICK_FONT = new PhetFont( 24 );

class BeakerNode extends Node {

  /**
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( beaker, modelViewTransform, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,

      // BeakerNode should not be hideable, but its subcomponents are.
      // See https://github.com/phetsims/ph-scale/issues/108
      phetioComponentOptions: {
        visibleProperty: {
          phetioReadOnly: true
        }
      }
    }, options );

    super( options );

    // outline of the beaker, starting from upper left
    const beakerWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    const beakerHeight = modelViewTransform.modelToViewDeltaY( beaker.size.height );
    const outlineShape = new Shape()
      .moveTo( -( beakerWidth / 2 ) - RIM_OFFSET, -beakerHeight - RIM_OFFSET )
      .lineTo( -( beakerWidth / 2 ), -beakerHeight )
      .lineTo( -( beakerWidth / 2 ), 0 )
      .lineTo( beakerWidth / 2, 0 )
      .lineTo( beakerWidth / 2, -beakerHeight )
      .lineTo( ( beakerWidth / 2 ) + RIM_OFFSET, -beakerHeight - RIM_OFFSET );
    this.addChild( new Path( outlineShape, {
      stroke: 'black',
      lineWidth: 3,
      lineCap: 'round',
      lineJoin: 'round'
    } ) );

    // horizontal tick marks on left and right edges, labels on right ticks, from bottom up
    const tickMarksTandem = options.tandem.createTandem( 'tickMarks' );
    const tickMarks = new Node( {
      tandem: tickMarksTandem
    } );
    this.addChild( tickMarks );

    // tickLabels are a child of tickMarks so that hiding tickMarks also hides labels
    const tickLabels = new Node( {
      tandem: tickMarksTandem.createTandem( 'tickLabels' )
    } );
    tickMarks.addChild( tickLabels );

    const numberOfTicks = Utils.roundSymmetric( beaker.volume / MINOR_TICK_SPACING );
    const deltaY = beakerHeight / numberOfTicks;
    const beakerLeft = -beakerWidth / 2;
    const beakerRight = beakerWidth / 2;
    for ( let i = 1; i <= numberOfTicks; i++ ) {

      const isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
      const tickLength = ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
      const y = -( i * deltaY );

      // left tick
      tickMarks.addChild( new Path(
        new Shape().moveTo( beakerLeft, y ).lineTo( beakerLeft + tickLength, y ),
        { stroke: 'black', lineWidth: 2, lineCap: 'butt', lineJoin: 'bevel' } ) );

      // right tick
      tickMarks.addChild( new Path(
        new Shape().moveTo( beakerRight, y ).lineTo( beakerRight - tickLength, y ),
        { stroke: 'black', lineWidth: 2, lineCap: 'butt', lineJoin: 'bevel' } ) );

      // label on right 'major' tick
      if ( isMajorTick ) {
        const labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( labelIndex < MAJOR_TICK_LABELS.length ) {
          const label = StringUtils.format( pattern0Value1UnitsString, MAJOR_TICK_LABELS[ labelIndex ], unitsLitersString );
          tickLabels.addChild( new Text( label, {
            font: MAJOR_TICK_FONT,
            fill: 'black',
            right: beakerRight - tickLength - TICK_LABEL_X_SPACING,
            centerY: y,
            maxWidth: 80 // determined empirically
          } ) );
        }
      }
    }

    this.translation = modelViewTransform.modelToViewPosition( beaker.position );
  }
}

phScale.register( 'BeakerNode', BeakerNode );
export default BeakerNode;