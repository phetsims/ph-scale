// Copyright 2013-2022, University of Colorado Boulder

/**
 * GraphIndicatorNode points to a value on a graph's vertical scale.
 * Origin is at the indicator's pointer, and the pointer can be attached to any corner of the indicator (see options.pointerPosition).
 * Interactive indicators are decorated with a double-headed arrow, indicating the direction of dragging.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Matrix3 from '../../../../../dot/js/Matrix3.js';
import { Shape } from '../../../../../kite/js/imports.js';
import merge from '../../../../../phet-core/js/merge.js';
import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import ScientificNotationNode from '../../../../../scenery-phet/js/ScientificNotationNode.js';
import { Node } from '../../../../../scenery/js/imports.js';
import { Path } from '../../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../../scenery/js/imports.js';
import { RichText } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import PHScaleColors from '../../PHScaleColors.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import H2ONode from '../molecules/H2ONode.js';
import H3ONode from '../molecules/H3ONode.js';
import OHNode from '../molecules/OHNode.js';

// constants
const POINTER_WIDTH_PERCENTAGE = 0.15; // used to compute width of the pointy part of the indicator
const POINTER_HEIGHT_PERCENTAGE = 0.5; // used to compute height of the pointy part of the indicator

class GraphIndicatorNode extends Node {

  /**
   * @param {Property.<number>} valueProperty
   * @param {Node} moleculeNode
   * @param {Node} formulaNode
   * @param {Object} [options]
   */
  constructor( valueProperty, moleculeNode, formulaNode, options ) {

    options = merge( {
      scale: 0.75, // specified by design team
      pointerPosition: 'topRight', // values: topLeft, topRight, bottomLeft, bottomRight
      backgroundFill: 'white',
      backgroundWidth: 160,
      backgroundHeight: 80,
      backgroundCornerRadius: 10,
      backgroundStroke: 'black',
      backgroundLineWidth: 2,
      backgroundXMargin: 10,
      backgroundYMargin: 8,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 8,
      ySpacing: 4,
      mantissaDecimalPlaces: PHScaleConstants.LOGARITHMIC_MANTISSA_DECIMAL_PLACES,
      exponent: null, // use this to request a specific exponent, otherwise the exponent is computed
      isInteractive: false,
      arrowFill: 'rgb( 0, 200, 0 )',
      arrowXSpacing: 5,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Instrument interactiveProperty for interactive indicators.
    assert && assert( options.phetioInputEnabledPropertyInstrumented === undefined,
      'GraphIndicatorNode sets phetioInputEnabledPropertyInstrumented' );
    if ( options.isInteractive ) {
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

    // molecule and formula, scaled to fit available height
    const moleculeAndFormula = new Node();
    moleculeAndFormula.addChild( moleculeNode );
    moleculeAndFormula.addChild( formulaNode );
    formulaNode.left = moleculeNode.right + options.xSpacing;
    formulaNode.centerY = moleculeNode.centerY;
    moleculeAndFormula.setScaleMagnitude( 0.7 );

    // rendering order
    this.addChild( backgroundNode );
    this.addChild( valueBackgroundNode );
    this.addChild( valueNode );
    this.addChild( moleculeAndFormula );

    // layout, relative to backgroundNode
    if ( options.pointerPosition === 'topRight' || options.pointerPosition === 'bottomRight' ) {
      valueBackgroundNode.left = backgroundNode.left + options.backgroundXMargin;
    }
    else {
      valueBackgroundNode.right = backgroundNode.right - options.backgroundXMargin;
    }
    valueNode.centerY = valueBackgroundNode.centerY;
    valueBackgroundNode.top = backgroundNode.top + options.backgroundYMargin;
    moleculeAndFormula.centerX = valueBackgroundNode.centerX;
    moleculeAndFormula.top = valueBackgroundNode.bottom + options.ySpacing;

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
      moleculeAndFormula.pickable = false;

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

    // sync with value
    valueProperty.link( value => {

      // center on the background
      valueNode.center = valueBackgroundNode.center;
    } );

    this.mutate( options );
  }

  /**
   * Creates an indicator for H2O.
   * @param {Property.<number>} valueProperty
   * @param {Object} [options] see GraphIndicatorNode constructor
   * @public
   */
  static createH2OIndicator( valueProperty, options ) {
    return new GraphIndicatorNode( valueProperty,
      new H2ONode(),
      new RichText( PHScaleConstants.H2O_FORMULA, { font: new PhetFont( 28 ), fill: 'white' } ),
      merge( {
        backgroundFill: PHScaleColors.H2O_BACKGROUND,
        pointerPosition: 'bottomLeft',
        mantissaDecimalPlaces: 0,
        exponent: 0
      }, options ) );
  }

  /**
   * Creates an indicator for H3O+.
   * @param {Property.<number>} valueProperty
   * @param {Object} [options] see GraphIndicatorNode constructor
   * @public
   */
  static createH3OIndicator( valueProperty, options ) {
    return new GraphIndicatorNode( valueProperty,
      new H3ONode(),
      new RichText( PHScaleConstants.H3O_FORMULA, { font: new PhetFont( 28 ), fill: 'white' } ),
      merge( {
        backgroundFill: PHScaleColors.ACIDIC,
        pointerPosition: 'topRight'
      }, options ) );
  }

  /**
   * Creates an indicator for OH-.
   * @param {Property.<number>} valueProperty
   * @param {Object} [options] see GraphIndicatorNode constructor
   * @public
   */
  static createOHIndicator( valueProperty, options ) {
    return new GraphIndicatorNode( valueProperty,
      new OHNode(),
      new RichText( PHScaleConstants.OH_FORMULA, { font: new PhetFont( 28 ), fill: 'white' } ),
      merge( {
        backgroundFill: PHScaleColors.BASIC,
        pointerPosition: 'topLeft'
      }, options ) );
  }
}

phScale.register( 'GraphIndicatorNode', GraphIndicatorNode );
export default GraphIndicatorNode;