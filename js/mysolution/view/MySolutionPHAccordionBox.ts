// Copyright 2022-2023, University of Colorado Boulder

/**
 * MySolutionPHAccordionBox is the pH accordion box (aka meter) for the 'My Solution' screen.
 * It allows the user to change the pH via a spinner.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PHAccordionBox from '../../common/view/PHAccordionBox.js';
import phScale from '../../phScale.js';
import { PHSpinnerNode } from './PHSpinnerNode.js';

export default class MySolutionPHAccordionBox extends PHAccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param tandem
   */
  public constructor( pHProperty: Property<number>, probeYOffset: number, tandem: Tandem ) {

    const spinner = new PHSpinnerNode( pHProperty, {
      tandem: tandem.createTandem( 'spinner' )
    } );

    super( spinner, probeYOffset, tandem );

    this.accordionBox.addLinkedElement( pHProperty );
  }
}

phScale.register( 'MySolutionPHAccordionBox', MySolutionPHAccordionBox );