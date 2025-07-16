// Copyright 2025, University of Colorado Boulder
/**
 * Creates the screen icon for the Macro screen which includes a pH gradient scale and probe.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import phScale from '../../phScale.js';
import { ScaleNode } from './MacroPHMeterNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ProbeNode from '../../../../scenery-phet/js/ProbeNode.js';
import { DEFAULT_MACRO_PH_PROBE_NODE_OPTIONS } from './MacroPHProbeNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Shape from '../../../../kite/js/Shape.js';
import PHScaleColors from '../../common/PHScaleColors.js';


export default class MacroScreenIcon extends ScreenIcon {

  public constructor() {
    const size = new Dimension2( 75, 180 );
    const scaleNode = ScaleNode.createBackground( size, 1 );

    const probePosition = new Vector2( size.width * 2.5, size.height * 0.5 );
    const probeNode = new ProbeNode( DEFAULT_MACRO_PH_PROBE_NODE_OPTIONS );
    probeNode.setCenter( probePosition );
    const wireNode = new WireNode( scaleNode, probeNode, size );
    const iconNode = new Node( {
      children: [ wireNode, scaleNode, probeNode ]
    } );
    super( iconNode, {
      maxIconWidthProportion: 0.8,
      maxIconHeightProportion: 0.8
    } );
  }
}

class WireNode extends Path {

  public constructor( bodyNode: Node, probeNode: Node, scaleSize: Dimension2 ) {

    super( new Shape(), {
      stroke: PHScaleColors.pHProbeWireColorProperty,
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round'
    } );

    const scaleCenterX = bodyNode.x + ( scaleSize.width / 2 );

    // Connect bottom-center of body to right-center of probe.
    const bodyConnectionPoint = new Vector2( scaleCenterX, bodyNode.bottom - 10 );
    const probeConnectionPoint = new Vector2( probeNode.left, probeNode.centerY );

    // control points, empirically determined for the desired icon look.
    const c1Offset = new Vector2( scaleSize.width, 100 );
    const c2Offset = new Vector2( -50, 0 );
    const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
    const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

    this.shape = new Shape()
      .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
      .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
  }
}

phScale.register( 'MacroScreenIcon', MacroScreenIcon );