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
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Solute = require( 'PH_SCALE/common/model/Solute' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const pHString = require( 'string!PH_SCALE/pH' );

  // constants
  const Y_MARGIN = 10;
  const CORNER_RADIUS = 12;

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
        contentYSpacing: 10,
        titleAlignX: 'left',
        titleXMargin: 15,
        titleNode: new Text( pHString, {
          fill: 'black',
          font: new PhetFont( { size: 28, weight: 'bold' } ),
          maxWidth: 50
        } ),
        buttonAlign: 'right',
        buttonXMargin: 14,
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

  /**
   * Spinner for pH value.
   */
  class PHSpinnerNode extends NumberSpinner {

    /**
     * @param {Solution} solution
     * @param {Object} [options]
     */
    constructor( solution, options ) {

      options = merge( {

        // NumberSpinner options
        valueAlign: 'right',
        decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
        deltaValue: 0.01,
        cornerRadius: CORNER_RADIUS,
        arrowsScale: 1.5,
        xMargin: 10,
        yMargin: 4,
        xSpacing: 6,
        ySpacing: 4,
        touchAreaXDilation: 15,
        touchAreaYDilation: 2,
        backgroundStroke: 'darkGray',

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      /**
       * solution.pHProperty is a DerivedProperty, so we can't change it directly. Associate this adapter Property
       * with the spinner.  When it's changed by the spinner, create a new custom solute with the desired pH, and
       * put it in the solution.
       */
      const spinnerProperty = new NumberProperty( solution.pHProperty.get(), {
        reentrant: true //TODO see https://github.com/phetsims/ph-scale/issues/72
      } );
      spinnerProperty.link( pH => {
        if ( pH !== solution.pHProperty.get() ) {
          solution.soluteProperty.set( Solute.createCustom( pH ) );
        }
      } );
      solution.pHProperty.link( pH => {
        spinnerProperty.set( pH );
      } );

      super( spinnerProperty, new Property( PHScaleConstants.PH_RANGE ), options );
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
