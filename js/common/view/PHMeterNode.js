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

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';

// constants
const Y_MARGIN = 10;
const CORNER_RADIUS = 8;

class PHMeterNode extends AccordionBox {

  /**
   * @param {Property.<number>} pHProperty - pH of the solution
   * @param {number} probeYOffset distance from top of meter to tip of probe, in view coordinate frame
   * @param {Object} [options]
   */
  constructor( pHProperty, probeYOffset, options ) {

    options = merge( {
      isInteractive: false, // {boolean} true: pHProperty can be changed, false: pHProperty is read-only

      // AccordionBox options
      fill: PHScaleColors.PANEL_FILL,
      lineWidth: 2,
      cornerRadius: CORNER_RADIUS,
      contentYSpacing: 10,
      titleAlignX: 'left',
      titleXMargin: 15,
      titleNode: new Text( phScaleStrings.pH, {
        fill: 'black',
        font: new PhetFont( { size: 28, weight: 'bold' } ),
        maxWidth: 50
      } ),
      buttonAlign: 'right',
      buttonXMargin: 14,
      buttonYMargin: Y_MARGIN,
      expandCollapseButtonOptions: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS,
      contentYMargin: Y_MARGIN,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    let contentNode = null;
    if ( options.isInteractive ) {

      // the meter is interactive, the pH value can be changed with a spinner
      contentNode = new PHSpinnerNode( pHProperty, {
        tandem: options.tandem.createTandem( 'spinner' )
      } );
    }
    else {

      // the meter is not interactive, just display the pH value
      contentNode = new NumberDisplay( pHProperty, PHScaleConstants.PH_RANGE, {
        decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
        cornerRadius: CORNER_RADIUS,
        textOptions: {
          font: new PhetFont( 28 ),
          textPropertyOptions: { phetioHighFrequency: true }
        },
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

    // Create a link to pHProperty, so it's easier to find in Studio.
    // This is not necessary for the interactive probe, since its NumberSpinner links to the Property.
    if ( !options.isInteractive ) {
      this.addLinkedElement( pHProperty, {
        tandem: options.tandem.createTandem( 'pHProperty' )
      } );
    }
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
   * @param {Property.<number>} pHProperty
   * @param {Object} [options]
   */
  constructor( pHProperty, options ) {

    const pHDelta = 1 / Math.pow( 10, PHScaleConstants.PH_METER_DECIMAL_PLACES );

    // When using the spinner to change pH, constrain pHProperty to be exactly the value displayed by the spinner.
    // See https://github.com/phetsims/ph-scale/issues/143
    const incrementFunction = value => {
      value = Utils.toFixedNumber( value, PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return Utils.toFixedNumber( value + pHDelta, PHScaleConstants.PH_METER_DECIMAL_PLACES );
    };

    const decrementFunction = value => {
      value = Utils.toFixedNumber( value, PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return Utils.toFixedNumber( value - pHDelta, PHScaleConstants.PH_METER_DECIMAL_PLACES );
    };

    options = merge( {

      // NumberSpinner options
      incrementFunction: incrementFunction,
      decrementFunction: decrementFunction,
      numberDisplayOptions: {
        decimalPlaces: PHScaleConstants.PH_METER_DECIMAL_PLACES,
        xMargin: 10,
        yMargin: 4,
        cornerRadius: CORNER_RADIUS,
        backgroundStroke: 'darkGray',
        textOptions: {
          font: new PhetFont( 28 ),
          textPropertyOptions: { phetioHighFrequency: true }
        }
      },
      arrowsScale: 1.5,
      xSpacing: 6,
      ySpacing: 4,
      touchAreaXDilation: 15,
      touchAreaYDilation: 2,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( pHProperty, new Property( PHScaleConstants.PH_RANGE ), options );
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
    const TIP_CORNER_RADIUS = 4;
    const OVERLAP = 10;

    const shaftWidth = 0.5 * PROBE_WIDTH;
    const shaftHeight = probeHeight - TIP_HEIGHT + OVERLAP;
    const shaftNode = new Rectangle( 0, 0, shaftWidth, shaftHeight, {
      fill: new LinearGradient( 0, 0, shaftWidth, 0 )
        .addColorStop( 0, 'rgb( 150, 150, 150 )' )
        .addColorStop( 0.35, 'rgb( 220, 220, 220 )' )
        .addColorStop( 1, 'rgb( 120, 120, 120 )' )
    } );

    // clockwise from tip of probe
    const tipNode = new Path( new Shape()
      .moveTo( PROBE_WIDTH / 2, TIP_HEIGHT )
      .lineTo( 0, 0.6 * TIP_HEIGHT )
      .lineTo( 0, TIP_CORNER_RADIUS )
      .arc( TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, Math.PI, 1.5 * Math.PI )
      .lineTo( TIP_CORNER_RADIUS, 0 )
      .lineTo( PROBE_WIDTH - TIP_CORNER_RADIUS, 0 )
      .arc( PROBE_WIDTH - TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, TIP_CORNER_RADIUS, -0.5 * Math.PI, 0 )
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

export default PHMeterNode;