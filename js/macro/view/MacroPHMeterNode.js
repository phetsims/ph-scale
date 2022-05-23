// Copyright 2013-2022, University of Colorado Boulder

/**
 * pH meter for the 'Macro' screen.
 *
 * The probe registers the concentration of all possible fluids that it may contact, including:
 * - solution in the beaker
 * - output of the water faucet
 * - output of the drain faucet
 * - output of the dropper
 *
 * Rather than trying to model the shapes of all of these fluids, we handle 'probe is in fluid'
 * herein via intersection of node shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ProbeNode from '../../../../scenery-phet/js/ProbeNode.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { Line } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { LinearGradient } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Water from '../../common/model/Water.js';
import PHScaleColors from '../../common/PHScaleColors.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';

// constants
const BACKGROUND_ENABLED_FILL = 'rgb( 31, 113, 2 )';
const BACKGROUND_DISABLED_FILL = 'rgb( 178, 178, 178 )';
const SCALE_SIZE = new Dimension2( 55, 450 );
const SCALE_LABEL_FONT = new PhetFont( { size: 30, weight: 'bold' } );
const TICK_LENGTH = 15;
const TICK_FONT = new PhetFont( 22 );
const NEUTRAL_TICK_LENGTH = 40;
const TICK_LABEL_X_SPACING = 5;
const CORNER_RADIUS = 12;

class MacroPHMeterNode extends Node {

  /**
   * @param {MacroPHMeter} meter
   * @param {MicroSolution|MySolution} solution
   * @param {Dropper} dropper
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} waterFluidNode
   * @param {Node} drainFluidNode
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( meter, solution, dropper, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode,
               modelViewTransform, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // the vertical scale, positioned at the meter 'body' position
    const scaleNode = new ScaleNode( { size: SCALE_SIZE } );
    scaleNode.translation = modelViewTransform.modelToViewPosition( meter.bodyPosition );

    // indicator that slides vertically along scale
    const pHIndicatorNode = new PHIndicatorNode( meter.pHProperty, SCALE_SIZE.width, {
      tandem: options.tandem.createTandem( 'pHIndicatorNode' )
    } );
    pHIndicatorNode.left = scaleNode.x;

    // interactive probe
    const probeNode = new PHProbeNode( meter.probe, modelViewTransform, solutionNode, dropperFluidNode,
      waterFluidNode, drainFluidNode, {
        tandem: options.tandem.createTandem( 'probeNode' ),
        phetioInputEnabledPropertyInstrumented: true
      } );

    // wire that connects the probe to the meter
    const wireNode = new WireNode( meter.probe, scaleNode, probeNode );

    // rendering order
    this.addChild( wireNode );
    this.addChild( probeNode );
    this.addChild( scaleNode );
    this.addChild( pHIndicatorNode );

    // vertical position of the indicator
    meter.pHProperty.link( pH => {
      pHIndicatorNode.centerY = scaleNode.y + Utils.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, pH || 7 );
    } );

    const updateValue = () => {
      let pH;
      if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
        pH = solution.pHProperty.get();
      }
      else if ( probeNode.isInWater() ) {
        pH = Water.pH;
      }
      else if ( probeNode.isInDropperSolution() ) {
        pH = dropper.soluteProperty.get().pH;
      }
      else {
        pH = null;
      }
      meter.pHProperty.set( pH );
    };
    Multilink.multilink( [
      meter.probe.positionProperty,
      solution.soluteProperty,
      solution.pHProperty,
      solutionNode.boundsProperty,
      dropperFluidNode.boundsProperty,
      waterFluidNode.boundsProperty,
      drainFluidNode.boundsProperty
    ], () => updateValue() );

    // Create a link to pHProperty, so it's easier to find in Studio.
    this.addLinkedElement( meter.pHProperty, {
      tandem: options.tandem.createTandem( 'pHProperty' )
    } );
  }
}

phScale.register( 'MacroPHMeterNode', MacroPHMeterNode );

/**
 * The meter's vertical scale.
 */
class ScaleNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      range: PHScaleConstants.PH_RANGE,
      size: new Dimension2( 75, 450 )
    }, options );

    super();

    // gradient background
    this.backgroundStrokeWidth = 2; // @private
    const backgroundNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      fill: new LinearGradient( 0, 0, 0, options.size.height )
        .addColorStop( 0, PHScaleColors.BASIC )
        .addColorStop( 0.5, PHScaleColors.NEUTRAL )
        .addColorStop( 1, PHScaleColors.ACIDIC ),
      stroke: 'black',
      lineWidth: this.backgroundStrokeWidth
    } );
    this.addChild( backgroundNode );

    // 'Acidic' label
    const textOptions = { fill: 'white', font: SCALE_LABEL_FONT, maxWidth: 0.45 * options.size.height };
    const acidicNode = new Text( phScaleStrings.acidic, textOptions );
    acidicNode.rotation = -Math.PI / 2;
    acidicNode.centerX = backgroundNode.centerX;
    acidicNode.centerY = 0.75 * backgroundNode.height;
    this.addChild( acidicNode );

    // 'Basic' label
    const basicNode = new Text( phScaleStrings.basic, textOptions );
    basicNode.rotation = -Math.PI / 2;
    basicNode.centerX = backgroundNode.centerX;
    basicNode.centerY = 0.25 * backgroundNode.height;
    this.addChild( basicNode );

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
          const tickLabelNode = new Text( pH, { font: TICK_FONT } );
          tickLabelNode.right = lineNode.left - TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = lineNode.centerY;
          this.addChild( tickLabelNode );
        }
      }
      y += dy;
    }

    // 'Neutral' tick mark
    const neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 3 } );
    neutralLineNode.right = backgroundNode.left;
    neutralLineNode.centerY = options.size.height / 2;
    this.addChild( neutralLineNode );
    const neutralLabelNode = new Text( '7', {
      fill: PHScaleColors.NEUTRAL,
      font: new PhetFont( { family: 'Arial black', size: 28, weight: 'bold' } )
    } );
    this.addChild( neutralLabelNode );
    neutralLabelNode.right = neutralLineNode.left - TICK_LABEL_X_SPACING;
    neutralLabelNode.centerY = neutralLineNode.centerY;
  }

  // @public needed for precise positioning of things that point to values on the scale
  getBackgroundStrokeWidth() {
    return this.backgroundStrokeWidth;
  }
}

/**
 * Meter probe, origin at center of crosshairs.
 */
class PHProbeNode extends ProbeNode {

  /**
   * @param {PHMovable} probe
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Node} solutionNode
   * @param {Node} dropperFluidNode
   * @param {Node} waterFluidNode
   * @param {Node} drainFluidNode
   * @param {Object} [options]
   */
  constructor( probe, modelViewTransform, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, options ) {

    options = merge( {
      sensorTypeFunction: ProbeNode.crosshairs( {
        intersectionRadius: 6
      } ),
      radius: 34,
      innerRadius: 26,
      handleWidth: 30,
      handleHeight: 25,
      handleCornerRadius: 12,
      lightAngle: 0.85 * Math.PI,
      color: 'rgb( 35, 129, 0 )',
      rotation: Math.PI / 2,
      cursor: 'pointer',

      // phet-io
      tandem: Tandem.REQUIRED,
      visiblePropertyOptions: {
        phetioReadOnly: true
      }
    }, options );

    super( options );

    // probe position
    probe.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );

    // touch area
    this.touchArea = this.localBounds.dilated( 20 );

    // drag listener
    this.addInputListener( new DragListener( {
      positionProperty: probe.positionProperty,
      dragBoundsProperty: new Property( probe.dragBounds ),
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    const isInNode = node => node.getBounds().containsPoint( probe.positionProperty.get() );
    this.isInSolution = () => isInNode( solutionNode );
    this.isInWater = () => isInNode( waterFluidNode );
    this.isInDrainFluid = () => isInNode( drainFluidNode );
    this.isInDropperSolution = () => isInNode( dropperFluidNode );
  }
}

/**
 * Wire that connects the body and probe.
 */
class WireNode extends Path {

  /**
   * @param {PHMovable} probe
   * @param {Node} bodyNode
   * @param {Node} probeNode
   */
  constructor( probe, bodyNode, probeNode ) {

    super( new Shape(), {
      stroke: 'rgb( 80, 80, 80 )',
      lineWidth: 8,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false // no need to drag the wire, and we don't want to do cubic-curve intersection here, or have it get in the way
    } );

    const updateCurve = () => {

      const scaleCenterX = bodyNode.x + ( SCALE_SIZE.width / 2 );

      // Connect bottom-center of body to right-center of probe.
      const bodyConnectionPoint = new Vector2( scaleCenterX, bodyNode.bottom - 10 );
      const probeConnectionPoint = new Vector2( probeNode.left, probeNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, Utils.linear( 0, 800, 0, 300, probeNode.left - scaleCenterX ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( -50, 0 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      this.shape = new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    };
    probe.positionProperty.link( updateCurve );
  }
}

/**
 * pH indicator that slides vertically along scale.
 * When there is no pH value, it points to 'neutral' but does not display a value.
 */
class PHIndicatorNode extends Node {

  /**
   * @param {Property.<number>} pHProperty
   * @param {number} scaleWidth
   * @param {Object} [options]
   */
  constructor( pHProperty, scaleWidth, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // dashed line that extends across the scale
    const lineNode = new Line( 0, 0, scaleWidth, 0, {
      stroke: 'black',
      lineDash: [ 5, 5 ],
      lineWidth: 2
    } );

    // pH display
    const numberDisplay = new NumberDisplay( pHProperty, PHScaleConstants.PH_RANGE, {
      decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
      align: 'right',
      noValueAlign: 'center',
      cornerRadius: CORNER_RADIUS,
      xMargin: 8,
      yMargin: 5,
      textOptions: {
        font: new PhetFont( 28 ),
        textPropertyOptions: { phetioHighFrequency: true }
      },
      tandem: options.tandem.createTandem( 'numberDisplay' )
    } );

    // label above the value
    const labelNode = new Text( phScaleStrings.pH, {
      fill: 'white',
      font: new PhetFont( { size: 28, weight: 'bold' } ),
      maxWidth: 100
    } );

    // background
    const backgroundXMargin = 14;
    const backgroundYMargin = 10;
    const backgroundYSpacing = 6;
    const backgroundWidth = Math.max( labelNode.width, numberDisplay.width ) + ( 2 * backgroundXMargin );
    const backgroundHeight = labelNode.height + numberDisplay.height + backgroundYSpacing + ( 2 * backgroundYMargin );
    const backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      cornerRadius: CORNER_RADIUS,
      fill: BACKGROUND_ENABLED_FILL
    } );

    // highlight around the background
    const highlightLineWidth = 3;
    const outerHighlight = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      cornerRadius: CORNER_RADIUS,
      stroke: 'black',
      lineWidth: highlightLineWidth
    } );
    const innerHighlight = new Rectangle( highlightLineWidth, highlightLineWidth,
      backgroundWidth - ( 2 * highlightLineWidth ), backgroundHeight - ( 2 * highlightLineWidth ), {
        cornerRadius: CORNER_RADIUS,
        stroke: 'white', lineWidth: highlightLineWidth
      } );
    const highlight = new Node( {
      children: [ innerHighlight, outerHighlight ],
      visible: false
    } );

    // arrow head pointing at the scale
    const arrowSize = new Dimension2( 21, 28 );
    const arrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( arrowSize.width, -arrowSize.height / 2 )
      .lineTo( arrowSize.width, arrowSize.height / 2 )
      .close();
    const arrowNode = new Path( arrowShape, { fill: 'black' } );

    // rendering order
    this.addChild( arrowNode );
    this.addChild( backgroundRectangle );
    this.addChild( highlight );
    this.addChild( labelNode );
    this.addChild( numberDisplay );
    this.addChild( lineNode );

    // layout, origin at arrow tip
    lineNode.left = 0;
    lineNode.centerY = 0;
    arrowNode.left = lineNode.right;
    arrowNode.centerY = lineNode.centerY;
    backgroundRectangle.left = arrowNode.right - 1; // overlap to hide seam
    backgroundRectangle.centerY = arrowNode.centerY;
    highlight.center = backgroundRectangle.center;
    labelNode.centerX = backgroundRectangle.centerX;
    labelNode.top = backgroundRectangle.top + backgroundYMargin;
    numberDisplay.centerX = backgroundRectangle.centerX;
    numberDisplay.top = labelNode.bottom + backgroundYSpacing;

    pHProperty.link( pH => {

      // make the indicator look enabled or disabled
      const enabled = ( pH !== null );
      backgroundRectangle.fill = enabled ? BACKGROUND_ENABLED_FILL : BACKGROUND_DISABLED_FILL;
      arrowNode.visible = lineNode.visible = enabled;

      // Highlight the indicator when displayed pH === 7
      highlight.visible = ( Utils.toFixedNumber( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ) === 7 );
    } );
  }
}

export default MacroPHMeterNode;