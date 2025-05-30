// Copyright 2013-2025, University of Colorado Boulder

/**
 * Indicator that the solution is neutral.
 * This consists of 'Neutral' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PHModel, { PHValue } from '../../common/model/PHModel.js';
import phScale from '../../phScale.js';
import PhScaleStrings from '../../PhScaleStrings.js';

type SelfOptions = EmptySelfOptions;

type NeutralIndicatorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class NeutralIndicatorNode extends Node {

  public constructor( pHProperty: TReadOnlyProperty<PHValue>, providedOptions: NeutralIndicatorNodeOptions ) {

    const options = optionize<NeutralIndicatorNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioDocumentation: 'becomes visible when the solution has neutral pH',
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    super( options );

    const labelText = new Text( PhScaleStrings.neutralStringProperty, {
      font: new PhetFont( { size: 30, weight: 'bold' } ),
      maxWidth: 300
    } );

    // translucent light-gray background, so this shows up on all solution colors
    const background = new Rectangle( 0, 0, 1, 1, {
      cornerRadius: 8,
      fill: 'rgba( 240, 240, 240, 0.6 )'
    } );

    // Size the background to fit the label, center the label.
    labelText.boundsProperty.link( bounds => {
      background.setRect( 0, 0, 1.4 * bounds.width, 1.2 * bounds.height );
      labelText.center = background.center;
    } );

    // Wrap things in a parentNode, so that this feature can be permanently disabled via PhET-iO via
    // this.visibleProperty. See https://github.com/phetsims/ph-scale/issues/102
    const parentNode = new Node( {
      children: [ background, labelText ]
    } );
    this.addChild( parentNode );

    // Make parentNode visible when the solution has neutral pH.
    pHProperty.link( pH => {
      parentNode.visible = PHModel.isEquivalentToWater( pH );
    } );
  }
}

phScale.register( 'NeutralIndicatorNode', NeutralIndicatorNode );