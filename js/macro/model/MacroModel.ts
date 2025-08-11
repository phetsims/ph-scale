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
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import ProbeJumpPositions from './ProbeJumpPositions.js';

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

    this.probeJumpPositions = new ProbeJumpPositions( this );

    // Instantiated to the last position, so that the first jump (via keyboard shortcut) wraps around
    // to the first position in the JumpToPositionListener.
    this.probeJumpPositionIndexProperty = new NumberProperty( this.probeJumpPositions.length - 1, {
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