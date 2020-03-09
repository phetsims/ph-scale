// Copyright 2013-2020, University of Colorado Boulder

/**
 * Indicator that the solution is neutral.
 * This consists of 'Neutral' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Water from '../../common/model/Water.js';
import phScaleStrings from '../../ph-scale-strings.js';
import phScale from '../../phScale.js';

const neutralString = phScaleStrings.neutral;

class NeutralIndicatorNode extends Node {

  /**
   * @param {Solution} solution
   * @param {Object} [options]
   */
  constructor( solution, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'becomes visible when the solution has neutral pH'
    }, options );

    super( options );

    const label = new Text( neutralString, { font: new PhetFont( { size: 30, weight: 'bold' } ), maxWidth: 300 } );

    // translucent light-gray background, so this shows up on all solution colors
    const background = new Rectangle( 0, 0, 1.4 * label.width, 1.2 * label.height, {
      cornerRadius: 8,
      fill: 'rgba( 240, 240, 240, 0.6 )'
    } );

    // Center the label
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // Wrap things in a parentNode, so that this feature can be permanently disabled via PhET-iO by setting
    // this.visibleProperty.get() = false. See https://github.com/phetsims/ph-scale/issues/102
    const parentNode = new Node( {
      children: [ background, label ]
    } );
    this.addChild( parentNode );

    // Make parentNode node visible when the solution has neutral pH.
    solution.pHProperty.link( pH => {
      parentNode.setVisible( pH === Water.pH );
    } );
  }
}

phScale.register( 'NeutralIndicatorNode', NeutralIndicatorNode );
export default NeutralIndicatorNode;