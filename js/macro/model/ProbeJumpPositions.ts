// Copyright 2025, University of Colorado Boulder
/**
 * ProbeJumpPositions is the set of jump positions for the macro probe, used by the 'J' shortcut.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import JumpPosition from './JumpPosition.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import phScale from '../../phScale.js';
import MacroModel from './MacroModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';


export default class ProbeJumpPositions extends Array<JumpPosition> {

  public constructor( model: MacroModel ) {
    super( // Inside the beaker, bottom center.
      new JumpPosition( {
        position: new Vector2( model.beaker.position.x, model.beaker.position.y - 0.0001 ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.insideBeakerStringProperty
      } ),

      // Below the water faucet, close to the spigot, and above the max solution level in the beaker.
      new JumpPosition( {
        position: new Vector2( model.waterFaucet.position.x, model.waterFaucet.position.y + 10 ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underWaterFaucetStringProperty
      } ),

      // Below the dropper, and above the max solution level in the beaker.
      new JumpPosition( {
        position: new Vector2( model.dropper.position.x, model.dropper.position.y + 10 ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underDropperStringProperty
      } ),

      // Below the drain faucet, close to the spigot.
      new JumpPosition( {
        position: new Vector2( model.drainFaucet.position.x, model.drainFaucet.position.y + 10 ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underDrainFaucetStringProperty
      } ),

      // Outside the beaker, where the probe is initially positioned.
      new JumpPosition( {
        position: new Vector2( model.pHMeter.probe.positionProperty.value.x, model.pHMeter.probe.positionProperty.value.y ),
        accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.outsideBeakerStringProperty
      } ) );
  }
}

phScale.register( 'ProbeJumpPositions', ProbeJumpPositions );