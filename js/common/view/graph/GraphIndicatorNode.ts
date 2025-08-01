// Copyright 2013-2025, University of Colorado Boulder

/**
 * GraphIndicatorNode points to a value on a graph's vertical scale.
 * Origin is at the indicator's pointer, and the pointer can be attached to any corner of the indicator (see options.pointerPosition).
 * Interactive indicators are decorated with a double-headed arrow, indicating the direction of dragging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Matrix3 from '../../../../../dot/js/Matrix3.js';
import Shape from '../../../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ScientificNotationNode from '../../../../../scenery-phet/js/ScientificNotationNode.js';
import InteractiveHighlighting from '../../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import TColor from '../../../../../scenery/js/util/TColor.js';
import phScale from '../../../phScale.js';
import PHScaleColors from '../../PHScaleColors.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import H2ONode from '../particles/H2ONode.js';
import H3ONode from '../particles/H3ONode.js';
import OHNode from '../particles/OHNode.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import PhScaleStrings from '../../../PhScaleStrings.js';
import WithRequired from '../../../../../phet-core/js/types/WithRequired.js';

// constants
const POINTER_WIDTH_PERCENTAGE = 0.15; // used to compute width of the pointy part of the indicator
const POINTER_HEIGHT_PERCENTAGE = 0.5; // used to compute height of the pointy part of the indicator
const INDICATOR_TEXT_FILL = 'black'; // color of the value text

type PointerPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

type SelfOptions = {
  pointerPosition?: PointerPosition;
  backgroundFill?: TColor;
  backgroundStroke?: TColor;
  backgroundWidth?: number;
  backgroundHeight?: number;
  backgroundCornerRadius?: number;
  backgroundLineWidth?: number;
  backgroundXMargin?: number;
  backgroundYMargin?: number;
  valueXMargin?: number;
  valueYMargin?: number;
  xSpacing?: number;
  ySpacing?: number;
  mantissaDecimalPlaces?: number;
  exponent?: number | null; // null causes exponent to be computed
  isInteractive?: boolean;
  arrowFill?: TColor;
  arrowXSpacing?: number;
};

type GraphIndicatorNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class GraphIndicatorNode extends InteractiveHighlighting( Node ) {

  public constructor( valueProperty: TReadOnlyProperty<number | null>,
                      particleNode: Node,
                      formulaNode: Node,
                      providedOptions: GraphIndicatorNodeOptions ) {

    const options = optionize<GraphIndicatorNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      pointerPosition: 'topRight',
      backgroundFill: 'white',
      backgroundStroke: 'black',
      backgroundWidth: 160,
      backgroundHeight: 80,
      backgroundCornerRadius: 10,
      backgroundLineWidth: 2,
      backgroundXMargin: 10,
      backgroundYMargin: 8,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 8,
      ySpacing: 4,
      mantissaDecimalPlaces: PHScaleConstants.LOGARITHMIC_MANTISSA_DECIMAL_PLACES,
      exponent: null,
      isInteractive: false,
      arrowFill: 'rgb( 0, 200, 0 )',
      arrowXSpacing: 5,

      // NodeOptions
      scale: 0.75, // specified by design team
      tagName: 'div',
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    // Instrument interactiveProperty for interactive indicators.
    if ( options.isInteractive ) {
      options.focusable = true;
      options.phetioInputEnabledPropertyInstrumented = true;
    }

    super();

    // Transform shapes to support various orientations of pointer.
    let shapeMatrix;
    if ( options.pointerPosition === 'topRight' ) {
      shapeMatrix = Matrix3.identity(); // background shape will be drawn with pointer at top-right
    }
    else if ( options.pointerPosition === 'topLeft' ) {
      shapeMatrix = Matrix3.scaling( -1, 1 );
    }
    else if ( options.pointerPosition === 'bottomRight' ) {
      shapeMatrix = Matrix3.scaling( 1, -1 );
    }
    else if ( options.pointerPosition === 'bottomLeft' ) {
      shapeMatrix = Matrix3.scaling( -1, -1 );
    }
    else {
      throw new Error( `unsupported options.pointerPosition: ${options.pointerPosition}` );
    }

    // Background with the pointer at top-right. Proceed clockwise from the tip of the pointer.
    const backgroundShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth, ( POINTER_HEIGHT_PERCENTAGE * options.backgroundHeight ) - options.backgroundCornerRadius )
      .arc( ( -POINTER_WIDTH_PERCENTAGE * options.backgroundWidth ) - options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, 0, Math.PI / 2, false )
      .lineTo( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundHeight - options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( -options.backgroundWidth, options.backgroundCornerRadius )
      .arc( -options.backgroundWidth + options.backgroundCornerRadius, options.backgroundCornerRadius, options.backgroundCornerRadius, Math.PI, 1.5 * Math.PI, false )
      .close()
      .transformed( shapeMatrix );
    const backgroundNode = new Path( backgroundShape, {
      lineWidth: options.backgroundLineWidth,
      stroke: options.backgroundStroke,
      fill: options.backgroundFill
    } );

    // Cutout where the value is displayed.
    const valueBackgroundNode = new Rectangle( 0, 0,
      ( ( 1 - POINTER_WIDTH_PERCENTAGE ) * options.backgroundWidth ) - ( 2 * options.backgroundXMargin ),
      0.5 * options.backgroundHeight - options.backgroundYMargin - ( options.ySpacing / 2 ),
      0.5 * options.backgroundCornerRadius, 0.5 * options.backgroundCornerRadius, {
        fill: 'white',
        stroke: 'gray'
      } );

    // Value, scaled to fit background height
    const valueNode = new ScientificNotationNode( valueProperty, {
      font: new PhetFont( 28 ),
      fill: 'black',
      mantissaDecimalPlaces: options.mantissaDecimalPlaces,
      exponent: options.exponent
    } );
    valueNode.setScaleMagnitude( 0.7 );

    // particle and formula, scaled to fit available height
    const particleAndFormula = new HBox( {
      children: [ formulaNode, particleNode ],
      spacing: options.xSpacing
    } );
    particleAndFormula.setScaleMagnitude( 0.7 );

    // rendering order
    this.addChild( backgroundNode );
    this.addChild( valueBackgroundNode );
    this.addChild( valueNode );
    this.addChild( particleAndFormula );

    // layout, relative to backgroundNode
    if ( options.pointerPosition === 'topRight' || options.pointerPosition === 'bottomRight' ) {
      valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    }
    else {
      valueBackgroundNode.right = backgroundNode.right - options.backgroundXMargin;
    }
    valueNode.centerY = valueBackgroundNode.centerY;
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    particleAndFormula.centerX = valueBackgroundNode.centerX;
    particleAndFormula.top = valueBackgroundNode.bottom + options.ySpacing;

    if ( options.isInteractive ) {

      // add double-headed arrow
      const arrowNode = new ArrowNode( 0, 0, 0, 0.75 * options.backgroundHeight, {
        doubleHead: true,
        tailWidth: 10,
        headWidth: 28,
        headHeight: 22,
        fill: options.arrowFill,
        stroke: 'black',
        lineWidth: 2
      } );
      this.addChild( arrowNode );

      // put the arrow on opposite side of the indicator's pointer
      if ( options.pointerPosition === 'topRight' || options.pointerPosition === 'bottomRight' ) {
        arrowNode.right = backgroundNode.left - options.arrowXSpacing;
      }
      else {
        arrowNode.left = backgroundNode.right + options.arrowXSpacing;
      }
      arrowNode.centerY = backgroundNode.centerY;

      // make the entire bounds interactive, so there's no dead space between background and arrows
      this.mouseArea = this.touchArea = this.localBounds;

      // set pickable false for nodes that don't need to be interactive, to improve performance.
      valueNode.pickable = false;
      valueBackgroundNode.pickable = false;
      particleAndFormula.pickable = false;

      // Hide the arrow if the indicator is not pickable.
      // See https://github.com/phetsims/ph-scale/issues/126
      this.pickableProperty.lazyLink( () => {
        arrowNode.visible = ( this.pickable !== false ); // pickable may be true, false, or null
      } );

      // Hide the arrow when input is enabled.
      this.inputEnabledProperty.link( inputEnabled => {
        arrowNode.visible = inputEnabled;
      } );
    }
    else {

      // The interactive highlight should only activate for "interactive" components
      this.interactiveHighlightEnabled = false;
    }

    // center value on the background
    valueNode.boundsProperty.link( () => {
      valueNode.center = valueBackgroundNode.center;
    } );

    this.mutate( options );
  }

  /**
   * Creates an indicator for H2O.
   */
  public static createH2OIndicator( valueProperty: TReadOnlyProperty<number | null>,
                                    options: GraphIndicatorNodeOptions ): GraphIndicatorNode {
    return new GraphIndicatorNode( valueProperty,
      new H2ONode(),
      new RichText( PHScaleConstants.H2O_FORMULA, { font: new PhetFont( 28 ), fill: INDICATOR_TEXT_FILL } ),
      combineOptions<GraphIndicatorNodeOptions>( {
        backgroundFill: PHScaleColors.h2OBackgroundColorProperty,
        pointerPosition: 'bottomLeft',
        mantissaDecimalPlaces: 0,
        exponent: 0
      }, options ) );
  }

  /**
   * Creates an indicator for H3O+.
   */
  public static createH3OIndicator( valueProperty: TReadOnlyProperty<number | null>,
                                    options: GraphIndicatorNodeOptions ): GraphIndicatorNode {
    return new GraphIndicatorNode( valueProperty,
      new H3ONode(),
      new RichText( PHScaleConstants.H3O_FORMULA, { font: new PhetFont( 28 ), fill: INDICATOR_TEXT_FILL } ),
      combineOptions<GraphIndicatorNodeOptions>( {
        backgroundFill: PHScaleColors.acidicColorProperty,
        pointerPosition: 'topRight',
        accessibleName: options.isInteractive ? PhScaleStrings.a11y.graph.h3OIndicator.accessibleNameStringProperty : null,
        accessibleHelpText: options.isInteractive ? PhScaleStrings.a11y.graph.h3OIndicator.accessibleHelpTextStringProperty : null
      }, options ) );
  }

  /**
   * Creates an indicator for OH-.
   */
  public static createOHIndicator( valueProperty: TReadOnlyProperty<number | null>,
                                   options: GraphIndicatorNodeOptions ): GraphIndicatorNode {
    return new GraphIndicatorNode( valueProperty,
      new OHNode(),
      new RichText( PHScaleConstants.OH_FORMULA, { font: new PhetFont( 28 ), fill: INDICATOR_TEXT_FILL } ),
      combineOptions<GraphIndicatorNodeOptions>( {
        backgroundFill: PHScaleColors.basicColorProperty,
        pointerPosition: 'topLeft',
        accessibleName: options.isInteractive ? PhScaleStrings.a11y.graph.oHIndicator.accessibleNameStringProperty : null,
        accessibleHelpText: options.isInteractive ? PhScaleStrings.a11y.graph.oHIndicator.accessibleHelpTextStringProperty : null
      }, options ) );
  }
}

phScale.register( 'GraphIndicatorNode', GraphIndicatorNode );