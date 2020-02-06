// Copyright 2014-2020, University of Colorado Boulder

/**
 * pH meter for the 'Micro' and 'My Solution' screens.
 * Origin is at top left.
 * The meter can be expanded and collapsed.
 * By default, the meter displays pH but does not allow you to change it.
 * pH can be optionally changed (using a spinner) for custom solutions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Solute = require( 'PH_SCALE/common/model/Solute' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );

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
  const SPINNER_ARROW_COLOR = 'rgb( 0, 200, 0 )';

  class PHMeterNode extends AccordionBox {

    /**
     * @param {Solution} solution
     * @param {number} probeYOffset distance from top of meter to tip of probe, in view coordinate frame
     * @param {Object} [options]
     */
    constructor( solution, probeYOffset, options ) {

      options = merge( {
        isInteractive: false, // {boolean} true: pH can be changed, false: pH is read-only

        // AccordionBox options
        fill: PHScaleColors.PANEL_FILL,
        lineWidth: 2,
        cornerRadius: CORNER_RADIUS,
        titleAlignX: 'left',
        contentYSpacing: 10,
        titleNode: new Text( pHString, {
          fill: 'black',
          font: new PhetFont( { size: 28, weight: 'bold' } ),
          maxWidth: 50
        } ),
        buttonAlign: 'right',
        buttonXMargin: X_MARGIN,
        buttonYMargin: Y_MARGIN,
        expandCollapseButtonOptions: {
          sideLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH,
          touchAreaXDilation: 10,
          touchAreaYDilation: 10
        },
        contentYMargin: Y_MARGIN,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      let contentNode = null;
      if ( options.isInteractive ) {

        // the meter is interactive, the pH value can be changed with a spinner
        contentNode = new PHSpinnerNode( solution, {
          tandem: options.tandem.createTandem( 'valueNode' )
        } );
      }
      else {

        // the meter is not interactive, just display the pH value
        contentNode = new NumberDisplay( solution.pHProperty, PHScaleConstants.PH_RANGE, {
          decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
          cornerRadius: CORNER_RADIUS,
          font: new PhetFont( 28 ),
          backgroundFill: 'white',
          backgroundStroke: 'darkGray',
          xMargin: 8,
          yMargin: 5,
          tandem: options.tandem.createTandem( 'numberDisplay' )
        } );
      }

      super( contentNode, options );

      // Decorate the AccordionBox with a probe, which is hidden when the AccordionBox is collapsed.
      const probeNode = new ProbeNode( probeYOffset, {
        centerX: this.left + ( 0.75 * this.width ),
        top: this.top
      } );
      this.addChild( probeNode );
      probeNode.moveToBack( probeNode );

      this.expandedProperty.link( expanded => {
        probeNode.visible = expanded;
      } );
    }

    /**
     * @public
     */
    reset() {
      this.expandedProperty.reset();
    }
  }

  phScale.register( 'PHMeterNode', PHMeterNode );

  //TOD #95 use NumberSpinner here, and maybe DynamicProperty
  /**
   * Spinner for pH value.
   */
  class PHSpinnerNode extends Node {

    /**
     * @param {Solution} solution
     * @param {Object} [options]
     */
    constructor( solution, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      // pH value
      const pH = Utils.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES );
      const pHText = new Text( pH, {
        fill: 'black',
        font: new PhetFont( 28 )
      } );

      // rectangle that the value is displayed in
      const valueXMargin = 8;
      const valueYMargin = 5;
      const valueRectangle = new Rectangle( 0, 0, pHText.width + ( 2 * valueXMargin ), pHText.height + ( 2 * valueYMargin ), {
        cornerRadius: CORNER_RADIUS,
        fill: 'white',
        stroke: 'darkGray'
      } );

      // layout
      pHText.right = valueRectangle.right - valueXMargin;
      pHText.centerY = valueRectangle.centerY;

      // parent for all components related to the value
      const valueNode = new Node( {
        children: [ valueRectangle, pHText ]
      } );

      // sync with pH value
      solution.pHProperty.link( pH => {
        if ( pH === null ) {
          pHText.text = stringNoValue;
          pHText.centerX = valueRectangle.centerX; // center justified
        }
        else {
          pHText.text = Utils.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
          pHText.right = valueRectangle.right - valueXMargin; // right justified
        }
      } );

      // options common to both arrow buttons
      const arrowButtonOptions = { fireOnHoldInterval: SPINNER_TIMER_INTERVAL, enabledFill: SPINNER_ARROW_COLOR };

      // button to increment value
      const incrementButton = new ArrowButton( 'up',
        () => {
          pHValueProperty.set( Math.min( PHScaleConstants.PH_RANGE.max, solution.pHProperty.get() + SPINNER_DELTA ) );
        },
        merge( {
          left: valueRectangle.right + SPINNER_X_SPACING,
          bottom: valueRectangle.centerY - ( SPINNER_Y_SPACING / 2 ),
          tandem: options.tandem.createTandem( 'incrementButton' )
        }, arrowButtonOptions )
      );
      valueNode.addChild( incrementButton );

      // button to decrement value
      const decrementButton = new ArrowButton( 'down',
        () => {
          pHValueProperty.set( Math.max( PHScaleConstants.PH_RANGE.min, solution.pHProperty.get() - SPINNER_DELTA ) );
        },
        merge( {
          left: incrementButton.left,
          top: incrementButton.bottom + SPINNER_Y_SPACING,
          tandem: options.tandem.createTandem( 'decrementButton' )
        }, arrowButtonOptions )
      );
      valueNode.addChild( decrementButton );

      // touch areas, expanded mostly to the right
      const xDilation = incrementButton.width / 2;
      const yDilation = 6;
      incrementButton.touchArea = incrementButton.localBounds.dilatedXY( xDilation, yDilation ).shifted( xDilation, -yDilation );
      decrementButton.touchArea = decrementButton.localBounds.dilatedXY( xDilation, yDilation ).shifted( xDilation, yDilation );

      /*
       * solution.pHProperty is derived, so we can't change it directly.
       * So when pH changes, create a new custom solution with the desired pH.
       */
      const pHValueProperty = new NumberProperty( solution.pHProperty.get(), {
        reentrant: true
      } );
      solution.pHProperty.link( pH => {
        pHValueProperty.set( pH );
      } );
      pHValueProperty.link( pH => {
        if ( pH !== null && pH !== solution.pHProperty.get() ) {
          solution.soluteProperty.set( Solute.createCustom( pH ) ); //TODO #92 a new solute is created for every pH change
        }
        incrementButton.enabled = ( pH < PHScaleConstants.PH_RANGE.max );
        decrementButton.enabled = ( pH > PHScaleConstants.PH_RANGE.min );
      } );

      // rendering order
      this.addChild( valueNode );
    }
  }

  /**
   * Probe that extends out the bottom of the meter.
   */
  class ProbeNode extends Node {

    /**
     * @param {number} probeHeight
     * @param {Object} [options]
     */
    constructor( probeHeight, options ) {

      options = options || {};

      const PROBE_WIDTH = 20;
      const TIP_HEIGHT = 50;
      const OVERLAP = 10;

      const shaftNode = new Rectangle( 0, 0, 0.5 * PROBE_WIDTH, probeHeight - TIP_HEIGHT + OVERLAP, {
        fill: 'rgb( 140, 140, 140 )'
      } );

      // clockwise from tip of probe
      const cornerRadius = 4;
      const tipNode = new Path( new Shape()
        .moveTo( PROBE_WIDTH / 2, TIP_HEIGHT )
        .lineTo( 0, 0.6 * TIP_HEIGHT )
        .lineTo( 0, cornerRadius )
        .arc( cornerRadius, cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI )
        .lineTo( cornerRadius, 0 )
        .lineTo( PROBE_WIDTH - cornerRadius, 0 )
        .arc( PROBE_WIDTH - cornerRadius, cornerRadius, cornerRadius, -0.5 * Math.PI, 0 )
        .lineTo( PROBE_WIDTH, 0.6 * TIP_HEIGHT )
        .close(), {
        fill: 'black',
        centerX: shaftNode.centerX,
        top: shaftNode.bottom - OVERLAP
      } );

      assert && assert( !options.children, 'ProbeNode sets children' );
      options.children = [ shaftNode, tipNode ];

      super( options );
    }
  }

  return PHMeterNode;
} );
