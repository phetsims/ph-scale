// Copyright 2013-2019, University of Colorado Boulder

/**
 * Indicator that the solution is neutral.
 * This consists of 'Neutral' on a translucent background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Water = require( 'PH_SCALE/common/model/Water' );

  // strings
  const neutralString = require( 'string!PH_SCALE/neutral' );

  /**
   * @param {Solution} solution
   * @constructor
   */
  function NeutralIndicator( solution ) {

    Node.call( this );

    var label = new Text( neutralString, { font: new PhetFont( { size: 30, weight: 'bold' } ), maxWidth: 300 } );

    // translucent light-gray background, so this shows up on all solution colors
    var background = new Rectangle( 0, 0, 1.4 * label.width, 1.2 * label.height, 8, 8,
      { fill: 'rgba( 240, 240, 240, 0.6 )' } );

    // rendering order
    this.addChild( background );
    this.addChild( label );

    // layout
    label.centerX = background.centerX;
    label.centerY = background.centerY;

    // make this node visible when the solution has neutral pH
    var self = this;
    solution.pHProperty.link( function( pH ) {
      self.setVisible( pH === Water.pH );
    } );
  }

  phScale.register( 'NeutralIndicator', NeutralIndicator );

  return inherit( Node, NeutralIndicator );
} );