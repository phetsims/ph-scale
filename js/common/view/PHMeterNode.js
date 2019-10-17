// Copyright 2014-2019, University of Colorado Boulder

/**
 * pH meter for the 'Micro' and 'My Solution' screens.
 * Origin is at top left.
 * The meter can be expanded and collapsed.
 * By default, the meter displays pH but does not allow you to change it.
 * pH can be optionally changed (using a picker) for custom solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Solute = require( 'PH_SCALE/common/model/Solute' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // strings
  const pHString = require( 'string!PH_SCALE/pH' );
  const stringNoValue = MathSymbols.NO_VALUE;

  // constants
  const X_MARGIN = 14;
  const Y_MARGIN = 10;
  const CORNER_RADIUS = 12;
  const SPINNER_DELTA = 0.01;
  const SPINNER_X_SPACING = 6;
  const SPINNER_Y_SPACING = 4;
  const SPINNER_TIMER_INTERVAL = 40; // ms
  const SPINNER_ARROW_COLOR = 'rgb(0,200,0)';

  /**
   * @param {Solution} solution
   * @param {number} probeYOffset distance from top of meter to tip of probe, in view coordinate frame
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function PHMeterNode( solution, probeYOffset, expandedProperty, options ) {

    options = merge( {
      isInteractive: false, // true: pH can be changed, false: pH is read-only
      attachProbe: 'center' // where to attach the probe: 'left'|'center'|'right'
    }, options );

    Node.call( this );

    // nodes
    const valueNode = new ValueNode( solution, expandedProperty, options.isInteractive );
    const probeNode = new ProbeNode( probeYOffset );

    // rendering order
    this.addChild( probeNode );
    this.addChild( valueNode );

    // layout
    if ( options.attachProbe === 'center' ) {
      probeNode.centerX = valueNode.centerX;
    }
    else if ( options.attachProbe === 'right' ) {
      probeNode.centerX = valueNode.left + ( 0.75 * valueNode.width );
    }
    else {
      probeNode.centerX = valueNode.left + ( 0.25 * valueNode.width );
    }
    probeNode.top = valueNode.top;

    expandedProperty.link( function( expanded ) {
      probeNode.visible = expanded;
    } );

    this.mutate( options );
  }

  phScale.register( 'PHMeterNode', PHMeterNode );

  inherit( Node, PHMeterNode );

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * This button also causes the ValueNode to show/hide the value.
   *
   * @param {Solution} solution
   * @param {Property.<boolean>} expandedProperty
   * @param {boolean} isInteractive
   * @constructor
   */
  function ValueNode( solution, expandedProperty, isInteractive ) {

    Node.call( this );

    // pH value
    const valueText = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      { fill: 'black', font: new PhetFont( 28 ) } );

    // rectangle that the value is displayed in
    const valueXMargin = 8;
    const valueYMargin = 5;
    const valueRectangle = new Rectangle( 0, 0, valueText.width + ( 2 * valueXMargin ), valueText.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS,
      { fill: 'white', stroke: 'darkGray' } );

    // layout
    valueText.right = valueRectangle.right - valueXMargin;
    valueText.centerY = valueRectangle.centerY;

    // parent for all components related to the value
    const valueNode = new Node( { children: [ valueRectangle, valueText ] } );

    // sync with pH value
    solution.pHProperty.link( function( pH ) {
      if ( pH === null ) {
        valueText.text = stringNoValue;
        valueText.centerX = valueRectangle.centerX; // center justified
      }
      else {
        valueText.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
        valueText.right = valueRectangle.right - valueXMargin; // right justified
      }
    } );

    // optional spinner arrows
    if ( isInteractive ) {

      // options common to both arrow buttons
      const arrowButtonOptions = { fireOnHoldInterval: SPINNER_TIMER_INTERVAL, enabledFill: SPINNER_ARROW_COLOR };

      // up arrow
      const upArrowNode = new ArrowButton( 'up',
        function() {
          pHValueProperty.set( Math.min( PHScaleConstants.PH_RANGE.max, solution.pHProperty.get() + SPINNER_DELTA ) );
        },
        merge( {
          left: valueRectangle.right + SPINNER_X_SPACING,
          bottom: valueRectangle.centerY - ( SPINNER_Y_SPACING / 2 )
        }, arrowButtonOptions )
      );
      valueNode.addChild( upArrowNode );

      // down arrow
      const downArrowNode = new ArrowButton( 'down',
        function() {
          pHValueProperty.set( Math.max( PHScaleConstants.PH_RANGE.min, solution.pHProperty.get() - SPINNER_DELTA ) );
        },
        merge( {
          left: upArrowNode.left,
          top: upArrowNode.bottom + SPINNER_Y_SPACING
        }, arrowButtonOptions )
      );
      valueNode.addChild( downArrowNode );

      // touch areas, expanded mostly to the right
      const xDilation = upArrowNode.width / 2;
      const yDilation = 6;
      upArrowNode.touchArea = upArrowNode.localBounds.dilatedXY( xDilation, yDilation ).shifted( xDilation, -yDilation );
      downArrowNode.touchArea = downArrowNode.localBounds.dilatedXY( xDilation, yDilation ).shifted( xDilation, yDilation );

      /*
       * solution.pHProperty is derived, so we can't change it directly.
       * So when pH changes, create a new custom solution with the desired pH.
       */
      const pHValueProperty = new NumberProperty( solution.pHProperty.get(), {
        reentrant: true
      } );
      solution.pHProperty.link( function( pH ) {
        pHValueProperty.set( pH );
      } );
      pHValueProperty.link( function( pH ) {
        if ( pH !== null && pH !== solution.pHProperty.get() ) {
          solution.soluteProperty.set( Solute.createCustom( pH ) );
        }
        upArrowNode.enabled = ( pH < PHScaleConstants.PH_RANGE.max );
        downArrowNode.enabled = ( pH > PHScaleConstants.PH_RANGE.min );
      } );
    }

    // expand/collapse button
    const expandCollapseButton = new ExpandCollapseButton( expandedProperty, { sideLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH } );
    expandCollapseButton.touchArea = Shape.bounds( expandCollapseButton.localBounds.dilatedXY( 10, 10 ) );

    // label above the value
    const labelNode = new Text( pHString, {
      fill: 'black',
      font: new PhetFont( { size: 28, weight: 'bold' } ),
      maxWidth: 50
    } );

    // expanded background
    const backgroundOptions = { fill: PHScaleColors.PANEL_FILL, stroke: 'black', lineWidth: 2 };
    const backgroundWidth = Math.max( expandCollapseButton.width + labelNode.width + 10, valueNode.width ) + ( 2 * X_MARGIN );
    const ySpacing = isInteractive ? 25 : 10;
    const expandedHeight = expandCollapseButton.height + valueNode.height + ( 2 * Y_MARGIN ) + ySpacing;
    const expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // collapsed background
    const collapsedHeight = expandCollapseButton.height + ( 2 * Y_MARGIN );
    const collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // rendering order
    this.addChild( collapsedRectangle );
    this.addChild( expandedRectangle );
    this.addChild( labelNode );
    this.addChild( expandCollapseButton );
    this.addChild( valueNode );

    // layout
    expandCollapseButton.right = expandedRectangle.right - X_MARGIN;
    expandCollapseButton.top = expandedRectangle.top + Y_MARGIN;
    labelNode.left = X_MARGIN;
    labelNode.centerY = expandCollapseButton.centerY;
    valueNode.centerX = expandedRectangle.centerX;
    valueNode.top = expandCollapseButton.bottom + ySpacing;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      expandedRectangle.visible = valueNode.visible = expanded;
      collapsedRectangle.visible = !expanded;
    } );
  }

  inherit( Node, ValueNode );

  /**
   * Probe that extends out the bottom of the meter.
   * @param probeHeight
   * @constructor
   */
  function ProbeNode( probeHeight ) {

    Node.call( this );

    const probeWidth = 20;
    const tipHeight = 50;
    const overlap = 10;

    const shaftNode = new Rectangle( 0, 0, 0.5 * probeWidth, probeHeight - tipHeight + overlap, { fill: 'rgb(140,140,140)' } );

    // clockwise from tip of probe
    const cornerRadius = 4;
    const tipNode = new Path( new Shape()
        .moveTo( probeWidth / 2, tipHeight )
        .lineTo( 0, 0.6 * tipHeight )
        .lineTo( 0, cornerRadius )
        .arc( cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI )
        .lineTo( cornerRadius, 0 )
        .lineTo( probeWidth - cornerRadius, 0 )
        .arc( probeWidth - cornerRadius, cornerRadius, cornerRadius, -0.5 * Math.PI, 0 )
        .lineTo( probeWidth, 0.6 * tipHeight )
        .close(),
      { fill: 'black' }
    );

    this.addChild( shaftNode );
    this.addChild( tipNode );

    tipNode.centerX = shaftNode.centerX;
    tipNode.top = shaftNode.bottom - overlap;
  }

  inherit( Node, ProbeNode );

  return PHMeterNode;
} );
