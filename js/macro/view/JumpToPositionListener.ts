// Copyright 2025, University of Colorado Boulder

/**
 * JumpToPositionListener is a keyboard listener specialized for the 'jump to useful position' shortcut.
 * This code has been duplicated from Beers Law Lab. See reasoning for that here: https://github.com/phetsims/ph-scale/issues/307#issuecomment-3074343507
 * See BLL implementation request details: https://github.com/phetsims/beers-law-lab/issues/35.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import phScale from '../../phScale.js';
import JumpPosition from '../model/JumpPosition.js';

export default class JumpToPositionListener extends KeyboardListener<OneKeyStroke[]> {

  public constructor( targetNode: Node,
                      hotkeyData: HotkeyData,
                      positionProperty: Property<Vector2>,
                      jumpPositions: JumpPosition[],
                      jumpPositionIndexProperty: Property<number> ) {
    super( {
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ hotkeyData ] ),
      fire: ( event, keysPressed ) => {
        if ( hotkeyData.hasKeyStroke( keysPressed ) ) {
          phet.log && phet.log( `hotkey J, jumpPositionIndex=${jumpPositionIndexProperty.value}` );

          if ( jumpPositionIndexProperty.value < jumpPositions.length - 1 ) {
            jumpPositionIndexProperty.value++;
          }
          else {
            jumpPositionIndexProperty.value = 0;
          }

          // Jump to the next position.
          positionProperty.value = jumpPositions[ jumpPositionIndexProperty.value ].positionProperty.value;

          // Add the accessible object response that is associated with the jump position.
          targetNode.addAccessibleObjectResponse( jumpPositions[ jumpPositionIndexProperty.value ].accessibleObjectResponseStringProperty );

          // Adjust the index into the jumpPositions array, with wrap around.
          if ( jumpPositionIndexProperty.value < jumpPositions.length - 1 ) {
            jumpPositionIndexProperty.value++;
          }
          else {
            jumpPositionIndexProperty.value = 0;
          }
        }
      }
    } );
  }
}

phScale.register( 'JumpToPositionListener', JumpToPositionListener );