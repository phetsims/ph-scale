// Copyright 2025, University of Colorado Boulder

/**
 * The meter's vertical scale.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import PHScaleColors from '../../common/PHScaleColors.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import Range from '../../../../dot/js/Range.js';

// constants
const SCALE_LABEL_FONT = new PhetFont( { size: 30, weight: 'bold' } );
const TICK_LENGTH = 15;
const TICK_FONT = new PhetFont( 22 );
const NEUTRAL_TICK_LENGTH = 40;
const TICK_LABEL_X_SPACING = 5;

type ScaleNodeSelfOptions = {
  range?: Range;
  size?: Dimension2;
};
type ScaleNodeOptions = ScaleNodeSelfOptions & NodeOptions;

export default class ScaleNode extends Node {

  public constructor( providedOptions?: ScaleNodeOptions ) {

    const options = optionize<ScaleNodeOptions, ScaleNodeSelfOptions, NodeOptions>()( {
      range: PHScaleConstants.PH_RANGE,
      size: new Dimension2( 75, 450 )
    }, providedOptions );

    super( options );

    // gradient background
    const backgroundStrokeWidth = 2;
    const backgroundNode = ScaleNode.createBackground( options.size, backgroundStrokeWidth );
    this.addChild( backgroundNode );

    // 'Acidic' label
    const textOptions = { fill: 'black', font: SCALE_LABEL_FONT, maxWidth: 0.45 * options.size.height };
    const acidicText = new Text( PhScaleStrings.acidicStringProperty, textOptions );
    acidicText.rotation = -Math.PI / 2;
    this.addChild( acidicText );
    acidicText.boundsProperty.link( bounds => {
      acidicText.centerX = backgroundNode.centerX;
      acidicText.centerY = 0.75 * backgroundNode.height;
    } );

    // 'Basic' label
    const basicText = new Text( PhScaleStrings.basicStringProperty, textOptions );
    basicText.rotation = -Math.PI / 2;
    this.addChild( basicText );
    basicText.boundsProperty.link( bounds => {
      basicText.centerX = backgroundNode.centerX;
      basicText.centerY = 0.25 * backgroundNode.height;
    } );

    // tick marks, labeled at 'even' values, skip 7 (neutral)
    let y = options.size.height;
    const dy = -options.size.height / options.range.getLength();
    for ( let pH = options.range.min; pH <= options.range.max; pH++ ) {
      if ( pH !== 7 ) {
        // tick mark
        const lineNode = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
        lineNode.right = backgroundNode.left;
        lineNode.centerY = y;
        this.addChild( lineNode );

        // tick label
        if ( pH % 2 === 0 ) {
          const tickText = new Text( pH, { font: TICK_FONT } );
          tickText.right = lineNode.left - TICK_LABEL_X_SPACING;
          tickText.centerY = lineNode.centerY;
          this.addChild( tickText );
        }
      }
      y += dy;
    }

    // 'Neutral' tick mark
    const neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 3 } );
    neutralLineNode.right = backgroundNode.left;
    neutralLineNode.centerY = options.size.height / 2;
    this.addChild( neutralLineNode );
    const neutralText = new Text( '7', {
      fill: 'black',
      font: new PhetFont( { family: 'Arial black', size: 28, weight: 'bold' } )
    } );
    this.addChild( neutralText );
    neutralText.right = neutralLineNode.left - TICK_LABEL_X_SPACING;
    neutralText.centerY = neutralLineNode.centerY;
  }

  public static createBackground( size: Dimension2, lineWidth: number ): Node {
    return new Rectangle( 0, 0, size.width, size.height, {
      fill: new LinearGradient( 0, 0, 0, size.height )
        .addColorStop( 0, PHScaleColors.basicColorProperty )
        .addColorStop( 0.5, PHScaleColors.neutralColorProperty )
        .addColorStop( 1, PHScaleColors.acidicColorProperty ),
      stroke: 'black',
      lineWidth: lineWidth
    } );
  }
}

phScale.register( 'ScaleNode', ScaleNode );