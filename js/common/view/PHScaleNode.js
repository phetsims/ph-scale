// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH scale used in meters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var acidicString = require( 'string!PH_SCALE/acidic' );
  var basicString = require( 'string!PH_SCALE/basic' );

  // constants
  var SCALE_LABEL_FONT = new PhetFont( { size: 30, weight: 'bold' } );
  var TICK_LENGTH = 15;
  var TICK_FONT = new PhetFont( 22 );
  var NEUTRAL_TICK_LENGTH = 40;
  var TICK_LABEL_X_SPACING = 5;

  /**
   * @param {*} options
   * @constructor
   */
  function PHScaleNode( options ) {

    options = _.extend( {
      size: new Dimension2( 75, 450 )
    }, options );

    var thisNode = this;
    Node.call( this );

    // gradient background
    this.backgroundStrokeWidth = 2;
    var backgroundNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      fill: new LinearGradient( 0, 0, 0, options.size.height )
        .addColorStop( 0, PHScaleColors.BASIC )
        .addColorStop( 0.5, PHScaleColors.NEUTRAL )
        .addColorStop( 1, PHScaleColors.ACIDIC ),
      stroke: 'black',
      lineWidth: this.backgroundStrokeWidth
    } );
    thisNode.addChild( backgroundNode );

    // 'Acidic' label
    var textOptions = { fill: 'white', font: SCALE_LABEL_FONT };
    var acidicNode = new Text( acidicString, textOptions );
    acidicNode.rotation = -Math.PI / 2;
    acidicNode.centerX = backgroundNode.centerX;
    acidicNode.centerY = 0.75 * backgroundNode.height;
    thisNode.addChild( acidicNode );

    // 'Basic' label
    var basicNode = new Text( basicString, textOptions );
    basicNode.rotation = -Math.PI / 2;
    basicNode.centerX = backgroundNode.centerX;
    basicNode.centerY = 0.25 * backgroundNode.height;
    thisNode.addChild( basicNode );

    // tick marks, labeled at 'even' values, skip 7 (neutral)
    var y = options.size.height;
    var dy = -options.size.height / PHScaleConstants.PH_RANGE.getLength();
    for ( var pH = PHScaleConstants.PH_RANGE.min; pH <= PHScaleConstants.PH_RANGE.max; pH++ ) {
      if ( pH !== 7 ) {
        // tick mark
        var lineNode = new Line( 0, 0, TICK_LENGTH, 0, { stroke: 'black', lineWidth: 1 } );
        lineNode.right = backgroundNode.left;
        lineNode.centerY = y;
        thisNode.addChild( lineNode );

        // tick label
        if ( pH % 2 === 0 ) {
          var tickLabelNode = new Text( pH, { font: TICK_FONT } );
          tickLabelNode.right = lineNode.left - TICK_LABEL_X_SPACING;
          tickLabelNode.centerY = lineNode.centerY;
          thisNode.addChild( tickLabelNode );
        }
      }
      y += dy;
    }

    // 'Neutral' tick mark
    var neutralLineNode = new Line( 0, 0, NEUTRAL_TICK_LENGTH, 0, { stroke: 'black', lineWidth: 3 } );
    neutralLineNode.right = backgroundNode.left;
    neutralLineNode.centerY = options.size.height / 2;
    thisNode.addChild( neutralLineNode );
    var neutralLabelNode = new Text( '7', { fill: PHScaleColors.NEUTRAL, font: new PhetFont( { family: 'Arial black', size: 28, weight: 'bold' } ) } );
    thisNode.addChild( neutralLabelNode );
    neutralLabelNode.right = neutralLineNode.left - TICK_LABEL_X_SPACING;
    neutralLabelNode.centerY = neutralLineNode.centerY;
  }

  return inherit( Node, PHScaleNode, {

    // needed for precise positioning of things that point to values on the scale
    getBackgroundStrokeWidth: function() {
      return this.backgroundStrokeWidth;
    }
  } );
} );
