// Copyright 2013-2020, University of Colorado Boulder

//TODO #92 how to totally disable this feature from PhET-iO? query parameter? {Boolean} featureEnabledProperty?
/**
 * Indicator that the solution is neutral.
 * This consists of 'Neutral' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  // strings
  const neutralString = require( 'string!PH_SCALE/neutral' );

  class NeutralIndicatorNode extends Node {

    /**
     * @param {Solution} solution
     * @param {Object} [options]
     */
    constructor( solution, options ) {

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super( options );

      const label = new Text( neutralString, { font: new PhetFont( { size: 30, weight: 'bold' } ), maxWidth: 300 } );

      // translucent light-gray background, so this shows up on all solution colors
      const background = new Rectangle( 0, 0, 1.4 * label.width, 1.2 * label.height, {
        cornerRadius: 8,
        fill: 'rgba( 240, 240, 240, 0.6 )'
      } );

      // rendering order
      this.addChild( background );
      this.addChild( label );

      // layout
      label.centerX = background.centerX;
      label.centerY = background.centerY;

      // make this node visible when the solution has neutral pH
      solution.pHProperty.link( pH => {
        this.setVisible( pH === Water.pH );
      } );
    }
  }

  return phScale.register( 'NeutralIndicatorNode', NeutralIndicatorNode );
} );