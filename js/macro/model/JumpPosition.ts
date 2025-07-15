// Copyright 2025, University of Colorado Boulder

/**
 * JumpPosition is the information about a position that be quickly set using the 'J' (for jump) keyboard shortcut.
 * This has been duplicated from Beers Law Lab. See reasoning for that here: https://github.com/phetsims/ph-scale/issues/307#issuecomment-3074343507
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import phScale from '../../phScale.js';

type SelfOptions = {

  // The position to jump to, possibly dynamic.
  positionProperty: TReadOnlyProperty<Vector2>;

  // The accessibleObjectResponse that is added when the keyboard shortcut is used to jump to this position.
  accessibleObjectResponseStringProperty: TReadOnlyProperty<string>;
};

type JumpPositionOptions = SelfOptions;

export default class JumpPosition {

  public readonly positionProperty: TReadOnlyProperty<Vector2>;
  public readonly accessibleObjectResponseStringProperty: TReadOnlyProperty<string>;

  public constructor( providedOptions: JumpPositionOptions ) {

    this.positionProperty = providedOptions.positionProperty;
    this.accessibleObjectResponseStringProperty = providedOptions.accessibleObjectResponseStringProperty;
  }
}

phScale.register( 'JumpPosition', JumpPosition );