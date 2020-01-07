// Copyright 2013-2019, University of Colorado Boulder

/**
 * Visual representation of a beaker that is filled to the top with a solution.
 * Origin is at the bottom center.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

  //strings
  const pattern0Value1UnitsString = require( 'string!PH_SCALE/pattern.0value.1units' );
  const unitsLitersString = require( 'string!PH_SCALE/units.liters' );

  // constants
  const RIM_OFFSET = 20;
  const MINOR_TICK_SPACING = 0.1; // L
  const MINOR_TICKS_PER_MAJOR_TICK = 5;
  const MAJOR_TICK_LENGTH = 30;
  const MINOR_TICK_LENGTH = 15;
  const TICK_LABEL_X_SPACING = 8;
  const MAJOR_TICK_LABELS = [ '\u00bd', '1' ]; // 1/2, 1
  const MAJOR_TICK_FONT = new PhetFont( 24 );

  /**
   * Constructor
   * @param {Beaker} beaker
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BeakerNode( beaker, modelViewTransform ) {

    Node.call( this );

    // outline of the beaker, starting from upper left
    const beakerWidth = modelViewTransform.modelToViewDeltaX( beaker.size.width );
    const beakerHeight = modelViewTransform.modelToViewDeltaY( beaker.size.height );
    const outlineShape = new Shape()
      .moveTo( -(beakerWidth / 2 ) - RIM_OFFSET, -beakerHeight - RIM_OFFSET )
      .lineTo( -(beakerWidth / 2), -beakerHeight )
      .lineTo( -(beakerWidth / 2), 0 )
      .lineTo( beakerWidth / 2, 0 )
      .lineTo( beakerWidth / 2, -beakerHeight )
      .lineTo( (beakerWidth / 2) + RIM_OFFSET, -beakerHeight - RIM_OFFSET );
    this.addChild( new Path( outlineShape, {
      stroke: 'black',
      lineWidth: 3,
      lineCap: 'round',
      lineJoin: 'round'
    } ) );

    // horizontal tick marks on left and right edges, labels on right ticks, from bottom up
    const ticksParent = new Node();
    this.addChild( ticksParent );
    const numberOfTicks = Utils.roundSymmetric( beaker.volume / MINOR_TICK_SPACING );
    const deltaY = beakerHeight / numberOfTicks;
    const beakerLeft = -beakerWidth / 2;
    const beakerRight = beakerWidth / 2;
    for ( let i = 1; i <= numberOfTicks; i++ ) {

      const isMajorTick = ( i % MINOR_TICKS_PER_MAJOR_TICK === 0 );
      const tickLength = ( isMajorTick ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH );
      const y = -( i * deltaY );

      // left tick
      ticksParent.addChild( new Path(
        new Shape().moveTo( beakerLeft, y ).lineTo( beakerLeft + tickLength, y ),
        { stroke: 'black', lineWidth: 2, lineCap: 'butt', lineJoin: 'bevel' } ) );

      // right tick
      ticksParent.addChild( new Path(
        new Shape().moveTo( beakerRight, y ).lineTo( beakerRight - tickLength, y ),
        { stroke: 'black', lineWidth: 2, lineCap: 'butt', lineJoin: 'bevel' } ) );

      // label on right 'major' tick
      if ( isMajorTick ) {
        const labelIndex = ( i / MINOR_TICKS_PER_MAJOR_TICK ) - 1;
        if ( labelIndex < MAJOR_TICK_LABELS.length ) {
          const label = StringUtils.format( pattern0Value1UnitsString, MAJOR_TICK_LABELS[ labelIndex ], unitsLitersString );
          ticksParent.addChild( new Text( label, {
            font: MAJOR_TICK_FONT,
            fill: 'black',
            right: beakerRight - tickLength - TICK_LABEL_X_SPACING,
            centerY: y,
            maxWidth: 0.25 * beaker.size.width
          } ) );
        }
      }
    }

    this.translation = modelViewTransform.modelToViewPosition( beaker.position );
  }

  phScale.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode );
} );
