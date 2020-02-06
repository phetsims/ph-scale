// Copyright 2013-2020, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const ProbeNode = require( 'SCENERY_PHET/ProbeNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  // strings
  const acidicString = require( 'string!PH_SCALE/acidic' );
  const basicString = require( 'string!PH_SCALE/basic' );
  const pHString = require( 'string!PH_SCALE/pH' );
  const stringNoValue = MathSymbols.NO_VALUE;

  // constants
  const BACKGROUND_ENABLED_FILL = 'rgb( 31, 113, 2 )';
  const BACKGROUND_DISABLED_FILL = 'rgb( 178, 178, 178 )';
  const SCALE_SIZE = new Dimension2( 55, 450 );
  const SCALE_LABEL_FONT = new PhetFont( { size: 30, weight: 'bold' } );
  const TICK_LENGTH = 15;
  const TICK_FONT = new PhetFont( 22 );
  const NEUTRAL_TICK_LENGTH = 40;
  const TICK_LABEL_X_SPACING = 5;

  class MacroPHMeterNode extends Node {

    /**
     * @param {PHMeter} meter
     * @param {Solution} solution
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
      const pHIndicatorNode = new PHIndicatorNode( meter.valueProperty, SCALE_SIZE.width, {
        tandem: options.tandem.createTandem( 'pHIndicatorNode' )
      } );
      pHIndicatorNode.left = scaleNode.x;

      // interactive probe
      const probeNode = new PHProbeNode( meter.probe, modelViewTransform, solutionNode, dropperFluidNode,
        waterFluidNode, drainFluidNode, {
          tandem: options.tandem.createTandem( 'probeNode' )
        } );

      // wire that connects the probe to the meter
      const wireNode = new WireNode( meter.probe, scaleNode, probeNode );

      // rendering order
      this.addChild( wireNode );
      this.addChild( probeNode );
      this.addChild( scaleNode );
      this.addChild( pHIndicatorNode );

      // vertical position of the indicator
      meter.valueProperty.link( value => {
        pHIndicatorNode.centerY = scaleNode.y + Utils.linear( PHScaleConstants.PH_RANGE.min, PHScaleConstants.PH_RANGE.max, SCALE_SIZE.height, 0, value || 7 );
      } );

      const updateValue = () => {
        let value;
        if ( probeNode.isInSolution() || probeNode.isInDrainFluid() ) {
          value = solution.pHProperty.get();
        }
        else if ( probeNode.isInWater() ) {
          value = Water.pH;
        }
        else if ( probeNode.isInDropperSolution() ) {
          value = dropper.soluteProperty.get().pH;
        }
        else {
          value = null;
        }
        meter.valueProperty.set( value );
      };
      meter.probe.positionProperty.link( updateValue );
      solution.soluteProperty.link( updateValue );
      solution.pHProperty.link( updateValue );
      solutionNode.on( 'bounds', updateValue );
      dropperFluidNode.on( 'bounds', updateValue );
      waterFluidNode.on( 'bounds', updateValue );
      drainFluidNode.on( 'bounds', updateValue );
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
      const acidicNode = new Text( acidicString, textOptions );
      acidicNode.rotation = -Math.PI / 2;
      acidicNode.centerX = backgroundNode.centerX;
      acidicNode.centerY = 0.75 * backgroundNode.height;
      this.addChild( acidicNode );

      // 'Basic' label
      const basicNode = new Text( basicString, textOptions );
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

  //TODO #96 use NumberDisplay, HBox, and Panel here
  /**
   * Displays pH value inside of a rounded rectangle, which is then placed inside of yet-another rounded rectangle.
   * It highlights when pH is 7. This is the thing that you see sliding up and down the pH Scale.
   */
  class ValueNode extends Node {

    /**
     * @param {Property.<number>} pHProperty
     * @param {Property.<boolean>} enabledProperty
     */
    constructor( pHProperty, enabledProperty ) {

      super();

      // pH value
      const valueNode = new Text( Utils.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
        { fill: 'black', font: new PhetFont( 28 ) } );

      // rectangle that the value is displayed in
      const valueXMargin = 8;
      const valueYMargin = 5;
      const cornerRadius = 12;
      const valueRectangle = new Rectangle( 0, 0, valueNode.width + ( 2 * valueXMargin ), valueNode.height + ( 2 * valueYMargin ), cornerRadius, cornerRadius,
        { fill: 'white' } );

      // label above the value
      const labelNode = new Text( pHString, {
        fill: 'white',
        font: new PhetFont( { size: 28, weight: 'bold' } ),
        maxWidth: 100
      } );

      // background
      const backgroundXMargin = 14;
      const backgroundYMargin = 10;
      const backgroundYSpacing = 6;
      const backgroundWidth = Math.max( labelNode.width, valueRectangle.width ) + ( 2 * backgroundXMargin );
      const backgroundHeight = labelNode.height + valueRectangle.height + backgroundYSpacing + ( 2 * backgroundYMargin );
      const backgroundRectangle = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
        { fill: BACKGROUND_ENABLED_FILL } );

      // highlight around the background
      const highlightLineWidth = 3;
      const outerHighlight = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, cornerRadius, cornerRadius,
        { stroke: 'black', lineWidth: highlightLineWidth } );
      const innerHighlight = new Rectangle( highlightLineWidth, highlightLineWidth, backgroundWidth - ( 2 * highlightLineWidth ), backgroundHeight - ( 2 * highlightLineWidth ), cornerRadius, cornerRadius,
        { stroke: 'white', lineWidth: highlightLineWidth } );
      const highlight = new Node( { children: [ innerHighlight, outerHighlight ], visible: false } );

      // rendering order
      this.addChild( backgroundRectangle );
      this.addChild( highlight );
      this.addChild( valueRectangle );
      this.addChild( labelNode );
      this.addChild( valueNode );

      // layout
      labelNode.centerX = backgroundRectangle.centerX;
      labelNode.top = backgroundRectangle.top + backgroundYMargin;
      valueRectangle.centerX = backgroundRectangle.centerX;
      valueRectangle.top = labelNode.bottom + backgroundYSpacing;
      valueNode.right = valueRectangle.right - valueXMargin; // right justified
      valueNode.centerY = valueRectangle.centerY;

      // pH value
      pHProperty.link( pH => {
        if ( pH === null ) {
          valueNode.text = stringNoValue;
          valueNode.centerX = valueRectangle.centerX; // center justified
          highlight.visible = false;
        }
        else {
          valueNode.text = Utils.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
          valueNode.right = valueRectangle.right - valueXMargin; // right justified
          highlight.visible = ( parseFloat( valueNode.text ) === 7 );
        }
      } );

      if ( enabledProperty ) {
        enabledProperty.link( enabled => {
          backgroundRectangle.fill = enabled ? BACKGROUND_ENABLED_FILL : BACKGROUND_DISABLED_FILL;
        } );
      }
    }
  }

  /**
   * Meter probe, origin at center of crosshairs.
   */
  class PHProbeNode extends ProbeNode {

    /**
     * @param {Movable} probe
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Node} solutionNode
     * @param {Node} dropperFluidNode
     * @param {Node} waterFluidNode
     * @param {Node} drainFluidNode
     * @param {Object} [options]
     */
    constructor( probe, modelViewTransform, solutionNode, dropperFluidNode, waterFluidNode, drainFluidNode, options ) {

      options = merge(  {
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
        tandem: Tandem.REQUIRED
      } , options );

      super( options );

      // probe position
      probe.positionProperty.link( position => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );

      // touch area
      this.touchArea = this.localBounds.dilated( 20, 20 );

      // drag handler
      this.addInputListener( new MovableDragHandler( probe.positionProperty, {
        dragBounds: probe.dragBounds,
        modelViewTransform: modelViewTransform,
        tandem: options.tandem.createTandem( 'dragHandler' )
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
     * @param {Movable} probe
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

      // value
      const valueEnabled = new BooleanProperty( true );
      const valueNode = new ValueNode( pHProperty, valueEnabled );

      // arrow head pointing at the scale
      const arrowSize = new Dimension2( 21, 28 );
      const arrowNode = new Path( new Shape()
          .moveTo( 0, 0 )
          .lineTo( arrowSize.width, -arrowSize.height / 2 )
          .lineTo( arrowSize.width, arrowSize.height / 2 )
          .close(),
        { fill: 'black' } );

      // rendering order
      this.addChild( arrowNode );
      this.addChild( valueNode );
      this.addChild( lineNode );

      // layout, origin at arrow tip
      lineNode.left = 0;
      lineNode.centerY = 0;
      arrowNode.left = lineNode.right;
      arrowNode.centerY = lineNode.centerY;
      valueNode.left = arrowNode.right - 1; // overlap to hide seam
      valueNode.centerY = arrowNode.centerY;

      // make the indicator look enabled or disabled
      pHProperty.link( pH => {
        const enabled = ( pH !== null );
        valueEnabled.set( enabled );
        arrowNode.visible = lineNode.visible = enabled;
      } );
    }
  }

  return MacroPHMeterNode;
} );
