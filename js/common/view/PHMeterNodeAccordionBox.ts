// Copyright 2014-2022, University of Colorado Boulder

/**
 * PHMeterNodeAccordionBox is the pH meter for the 'Micro' and 'My Solution' screens.
 * - Origin is at top left.
 * - The meter can be expanded and collapsed.
 * - By default, the meter displays pH but does not allow you to change it.
 * - pH can be optionally changed (using a spinner) for custom solutions.
 *
 * NOTE: This class has the somewhat-redundant name PHMeterNodeAccordionBox because we have 2 pH meters in this
 * sim (see MacroPHMeterNode for the Macro screen), and we want them both to be discoverable in Studio by searching
 * for 'pHMeterNode'. So their tandem names are 'pHMeterNodeAccordionBox' and 'pHMeterNode'. The downside of this is
 * that someone who is familiar with tandem naming conventions will not find 'pHMeterAccordionBox'.
 * See https://github.com/phetsims/ph-scale/issues/238.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, NodeOptions, NodeTranslationOptions, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';
import PHScaleColors from '../PHScaleColors.js';
import PHScaleConstants from '../PHScaleConstants.js';
import { PHValue } from '../model/PHModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

// constants
const Y_MARGIN = 10;
const CORNER_RADIUS = 8;

type SelfOptions = {

  // true makes the indicators interactive on the Logarithmic graph, allowing the user to change concentration
  // and quantity, thereby changing pH.
  isInteractive?: boolean;
};

export type PHMeterNodeAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

export default class PHMeterNodeAccordionBox extends AccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param [providedOptions]
   */
  public constructor( pHProperty: Property<PHValue>, probeYOffset: number, providedOptions: PHMeterNodeAccordionBoxOptions ) {

    const options = optionize<PHMeterNodeAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {

      // SelfOptions
      isInteractive: false,

      // AccordionBoxOptions
      fill: PHScaleColors.PANEL_FILL,
      lineWidth: 2,
      cornerRadius: CORNER_RADIUS,
      contentYSpacing: 10,
      titleAlignX: 'left',
      titleXMargin: 15,
      titleNode: new Text( phScaleStrings.pHStringProperty, {
        fill: 'black',
        font: new PhetFont( { size: 28, weight: 'bold' } ),
        maxWidth: 50
      } ),
      buttonAlign: 'right',
      buttonXMargin: 14,
      buttonYMargin: Y_MARGIN,
      expandCollapseButtonOptions: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS,
      contentYMargin: Y_MARGIN
    }, providedOptions );

    let contentNode = null;
    if ( options.isInteractive ) {

      // the meter is interactive, the pH value can be changed with a spinner
      // @ts-ignore TODO https://github.com/phetsims/ph-scale/issues/242 pHProperty is number | null
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
    probeNode.moveToBack();

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

  public override reset(): void {
    this.expandedProperty.reset();
    super.reset();
  }
}

/**
 * Spinner for pH value.
 */
type PHSpinnerNodeSelfOptions = EmptySelfOptions;
type PHSpinnerNodeOptions = PHSpinnerNodeSelfOptions & PickRequired<NumberSpinnerOptions, 'tandem'>;

class PHSpinnerNode extends NumberSpinner {

  public constructor( pHProperty: Property<number>, providedOptions: PHSpinnerNodeOptions ) {

    const pHDelta = 1 / Math.pow( 10, PHScaleConstants.PH_METER_DECIMAL_PLACES );

    // When using the spinner to change pH, constrain pHProperty to be exactly the value displayed by the spinner.
    // See https://github.com/phetsims/ph-scale/issues/143
    const incrementFunction = ( value: number ) => {
      value = Utils.toFixedNumber( value, PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return Utils.toFixedNumber( value + pHDelta, PHScaleConstants.PH_METER_DECIMAL_PLACES );
    };

    const decrementFunction = ( value: number ) => {
      value = Utils.toFixedNumber( value, PHScaleConstants.PH_METER_DECIMAL_PLACES );
      return Utils.toFixedNumber( value - pHDelta, PHScaleConstants.PH_METER_DECIMAL_PLACES );
    };

    const options = optionize<PHSpinnerNodeOptions, PHSpinnerNodeSelfOptions, NumberSpinnerOptions>()( {

      // NumberSpinnerOptions
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
      touchAreaYDilation: 2
    }, providedOptions );

    super( pHProperty, new Property( PHScaleConstants.PH_RANGE ), options );
  }
}

/**
 * Probe that extends out the bottom of the meter.
 */
type ProbeNodeSelfOptions = EmptySelfOptions;
type ProbeNodeOptions = ProbeNodeSelfOptions & NodeTranslationOptions;

class ProbeNode extends Node {

  public constructor( probeHeight: number, providedOptions?: ProbeNodeOptions ) {

    const options = optionize<ProbeNodeOptions, ProbeNodeSelfOptions, NodeOptions>()( {
      // Empty optionize is needed because we're setting children below.
    }, providedOptions );

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

    options.children = [ shaftNode, tipNode ];

    super( options );
  }
}

phScale.register( 'PHMeterNodeAccordionBox', PHMeterNodeAccordionBox );