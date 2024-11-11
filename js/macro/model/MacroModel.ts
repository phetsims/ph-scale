// Copyright 2022-2024, University of Colorado Boulder

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

export default class MacroModel extends PHModel<MacroSolution> {

  public readonly pHMeter: MacroPHMeter;

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
  }

  public override reset(): void {
    super.reset();
    this.pHMeter.reset();
  }
}

phScale.register( 'MacroModel', MacroModel );