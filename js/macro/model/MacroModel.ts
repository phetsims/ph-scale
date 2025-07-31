// Copyright 2022-2025, University of Colorado Boulder

/**
 * MacroModel is the model for the 'Micro' screen.  It extends the PHModel, substituting a different solution
 * model, and omitting the pH meter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PHModel from '../../common/model/PHModel.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import phScale from '../../phScale.js';
import MacroPHMeter from './MacroPHMeter.js';
import MacroSolution from './MacroSolution.js';
import JumpPosition from './JumpPosition.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

export default class MacroModel extends PHModel<MacroSolution> {

  public readonly pHMeter: MacroPHMeter;

  // Useful positions for the probe to jump to. Cycle through these positions via a keyboard shortcut.
  // Uses the same implementation as Beer's Law Lab, see: https://github.com/phetsims/ph-scale/issues/307#issuecomment-3074343507
  public readonly probeJumpPositions: JumpPosition[];
  public readonly probeJumpPositionIndexProperty: Property<number>;

  public constructor( tandem: Tandem ) {

    super( {
      createSolution: ( solutionProperty, maxVolume, tandem ) => new MacroSolution( solutionProperty, {
        maxVolume: maxVolume,
        tandem: tandem
      } ),
      tandem: tandem
    } );

    // to the left of the drain faucet
    const pHMeterPosition = new Vector2( this.drainFaucet.position.x - 300, 75 );
    this.pHMeter = new MacroPHMeter(
      pHMeterPosition,
      new Vector2( pHMeterPosition.x + 150, this.beaker.position.y ),
      PHScaleConstants.SCREEN_VIEW_OPTIONS.layoutBounds, {
        tandem: tandem.createTandem( 'pHMeter' )
      } );

    this.probeJumpPositions = [

      // Inside the beaker, bottom center.
      new JumpPosition( {
        positionProperty: new Vector2Property( this.beaker.position.plusXY( 0, -0.0001 ) ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.insideBeakerStringProperty
      } ),

      // Below the water faucet, close to the spigot, and above the max solution level in the beaker.
      new JumpPosition( {
        positionProperty: new Vector2Property( this.waterFaucet.position.plusXY( 0, 10 ) ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underWaterFaucetStringProperty
      } ),

      // Below the dropper, and above the max solution level in the beaker.
      new JumpPosition( {
        positionProperty: new Vector2Property( this.dropper.position.plusXY( 0, 10 ) ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underDropperStringProperty
      } ),

      // Below the drain faucet, close to the spigot.
      new JumpPosition( {
        positionProperty: new Vector2Property( this.drainFaucet.position.plusXY( 0, 10 ) ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underDrainFaucetStringProperty
      } ),

      // Outside the beaker, where the probe is initially positioned.
      new JumpPosition( {
        positionProperty: new Vector2Property( this.pHMeter.probe.positionProperty.value ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.outsideBeakerStringProperty
      } )
    ];

    this.probeJumpPositionIndexProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, this.probeJumpPositions.length - 1 )
    } );

  }

  public override reset(): void {
    super.reset();
    this.pHMeter.reset();
    this.probeJumpPositionIndexProperty.reset();
  }
}

phScale.register( 'MacroModel', MacroModel );