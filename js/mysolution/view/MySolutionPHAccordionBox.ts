// Copyright 2022-2025, University of Colorado Boulder

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
import PhScaleStrings from '../../PhScaleStrings.js';
import ValueChangeUtterance from '../../../../utterance-queue/js/ValueChangeUtterance.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import PHScaleConstants from '../../common/PHScaleConstants.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';

export default class MySolutionPHAccordionBox extends PHAccordionBox {

  /**
   * @param pHProperty - pH of the solution
   * @param probeYOffset - distance from top of meter to tip of probe, in view coordinate frame
   * @param tandem
   */
  public constructor( pHProperty: Property<number>, probeYOffset: number, tandem: Tandem ) {

    const responseUtterance = new ValueChangeUtterance( {
      alert: new PatternStringProperty( PhScaleStrings.a11y.pHValuePatternStringProperty, {
        pHValue: PHScaleConstants.CREATE_PH_VALUE_FIXED_PROPERTY( pHProperty )
      } )
    } );
    const spinner = new PHSpinnerNode( pHProperty, {
      pdomMapPDOMValue: value => toFixedNumber( value, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
      tandem: tandem.createTandem( 'spinner' )
    } );

    super( spinner, probeYOffset, {
      probeCenterX: 0.5, // center the probe in the accordion box
      accordionBoxOptions: {
        tandem: tandem
      }
    } );

    Multilink.multilink( [ pHProperty, this.accordionBox.expandedProperty ], ( pHValue, expanded ) => {
      expanded && spinner.addAccessibleContextResponse( responseUtterance );
    } );

    this.accordionBox.addLinkedElement( pHProperty );
  }
}

phScale.register( 'MySolutionPHAccordionBox', MySolutionPHAccordionBox );