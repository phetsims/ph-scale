// Copyright 2013-2022, University of Colorado Boulder

/**
 * Indicator that the solution is neutral.
 * This consists of 'Neutral' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';
import phScaleStrings from '../../phScaleStrings.js';

class NeutralIndicatorNode extends Node {

  /**
   * @param {MacroSolution|MicroSolution|MySolution} solution
   * @param {Object} [options]
   */
  constructor( solution, options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'becomes visible when the solution has neutral pH'
    }, options );

    super( options );

    const labelText = new Text( phScaleStrings.neutralStringProperty, {
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
    // this.visibleProperty.set( false ). See https://github.com/phetsims/ph-scale/issues/102
    const parentNode = new Node( {
      children: [ background, labelText ]
    } );
    this.addChild( parentNode );

    // Make parentNode node visible when the solution has neutral pH.
    solution.pHProperty.link( pH => {
      parentNode.setVisible( solution.isEquivalentToWater() );
    } );
  }
}

phScale.register( 'NeutralIndicatorNode', NeutralIndicatorNode );
export default NeutralIndicatorNode;