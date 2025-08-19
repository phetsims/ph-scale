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
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import MacroModel from './MacroModel.js';


export default class ProbeJumpPositions extends Array<JumpPosition> {

  public constructor( model: MacroModel ) {
   super( // Inside the beaker, bottom center.
     new JumpPosition( {

       // TODO: Can these be made constants, instead of axon Property instances? see https://github.com/phetsims/ph-scale/issues/323
       positionProperty: new Vector2Property( model.beaker.position.plusXY( 0, -0.0001 ) ),
       accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.insideBeakerStringProperty
     } ),

     // Below the water faucet, close to the spigot, and above the max solution level in the beaker.
     new JumpPosition( {
       positionProperty: new Vector2Property( model.waterFaucet.position.plusXY( 0, 10 ) ),
       accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underWaterFaucetStringProperty
     } ),

     // Below the dropper, and above the max solution level in the beaker.
     new JumpPosition( {
       positionProperty: new Vector2Property( model.dropper.position.plusXY( 0, 10 ) ),
       accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underDropperStringProperty
     } ),

     // Below the drain faucet, close to the spigot.
     new JumpPosition( {
       positionProperty: new Vector2Property( model.drainFaucet.position.plusXY( 0, 10 ) ),
       accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.underDrainFaucetStringProperty
     } ),

     // Outside the beaker, where the probe is initially positioned.
     new JumpPosition( {
       positionProperty: new Vector2Property( model.pHMeter.probe.positionProperty.value ),
       accessibleObjectResponseStringProperty: PhScaleStrings.a11y.macroProbe.accessibleObjectResponses.outsideBeakerStringProperty
     } ) );
  }
}

phScale.register( 'ProbeJumpPositions', ProbeJumpPositions );