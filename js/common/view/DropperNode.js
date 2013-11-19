// Copyright 2002-2013, University of Colorado Boulder

/**
 * Dropper that contains a solute in solution form.
 * Origin is at the center of the hole where solution comes out of the dropper (bottom center).
 * Optionally displays the pH value on the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'PH_SCALE/common/view/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToggleButton = require( 'PH_SCALE/common/view/ToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // images
  var dropperForegroundImage = require( 'image!PH_SCALE/dropper_foreground.png' );
  var dropperBackgroundImage = require( 'image!PH_SCALE/dropper_background.png' );
  var buttonPressedImage = require( 'image!PH_SCALE/red_button_pressed.png' );
  var buttonUnpressedImage = require( 'image!PH_SCALE/red_button_unpressed.png' );
  var buttonDisabledImage = require( 'image!PH_SCALE/red_button_disabled.png' );

  // strings
  var pattern_ph_0value = require( 'string!PH_SCALE/pattern.ph.0value' );

  // constants
  var DEBUG_ORIGIN = false;
  var BUTTON_Y_OFFSET = 13; // y-offset of button location in dropper image file
  var LABEL_Y_OFFSET = 130; // y-offset of the label's center in dropper image file

  // constants specific to the image file
  var TIP_WIDTH = 15;
  var TIP_HEIGHT = 5;
  var GLASS_WIDTH = 46;
  var GLASS_HEIGHT = 150;
  var GLASS_Y_OFFSET = TIP_HEIGHT + 14;

  /**
   * @param {Dropper} dropper
   * @param {ModelViewTransform2} mvt
   * @param {*} options
   * @constructor
   */
  function DropperNode( dropper, mvt, options ) {

    options = _.extend( {
      showPH: false
    }, options );

    var thisNode = this;

    Node.call( thisNode, {
      cursor: 'pointer'
    } );

    // fluid fills the glass portion of the dropper, shape is specific to the dropper image file
    var fluidShape = new Shape()
      .moveTo( -TIP_WIDTH / 2, 0 )
      .lineTo( -TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( -GLASS_WIDTH / 2, -GLASS_Y_OFFSET )
      .lineTo( -GLASS_WIDTH / 2, -GLASS_HEIGHT )
      .lineTo( GLASS_WIDTH / 2, -GLASS_HEIGHT )
      .lineTo( GLASS_WIDTH / 2, -GLASS_Y_OFFSET )
      .lineTo( TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( TIP_WIDTH / 2, 0 )
      .close();
    var fluidNode = new Path( fluidShape );

    // images, origin moved to bottom center
    var foreground = new Image( dropperForegroundImage );
    var background = new Image( dropperBackgroundImage );
    foreground.x = -foreground.width / 2;
    foreground.y = -foreground.height;
    background.x = -background.width / 2;
    background.y = -background.height;

    // translucent background, so the value shows up on all solution colors
    var valueBackground = new Rectangle( 0, 0, 0.75 * fluidNode.width, 0.6 * fluidNode.height, 5, 5, { fill: 'rgba( 240, 240, 240, 0.6 )', lineWidth: 0 } );
    valueBackground.centerX = fluidNode.centerX;
    valueBackground.centerY = foreground.top + LABEL_Y_OFFSET;

    // pH value, rotated and scaled to fit
    var valueNode = new Text( createPHString( PHScaleConstants.PH_RANGE.max ), { font: new PhetFont( { size: 18, weight: 'bold' } ), fill: 'black' } );
    valueNode.setRotation( -Math.PI / 2 );
    valueNode.setScaleMagnitude( Math.min( ( 0.9 * valueBackground.width ) / valueNode.width, ( 0.9 * valueBackground.height ) / valueNode.height ) );

    // button, centered in the dropper's bulb
    var button = new ToggleButton( buttonUnpressedImage, buttonPressedImage, buttonDisabledImage,
      dropper.onProperty, dropper.enabledProperty, { onWhilePressed: true } );
    button.touchArea = Shape.circle( button.width / 2, button.height / 2, ( button.width / 2 ) + 30 );
    button.setScaleMagnitude( 0.3 );
    button.x = foreground.centerX - ( button.width / 2 );
    button.y = foreground.top + BUTTON_Y_OFFSET;

    // rendering order
    thisNode.addChild( fluidNode );
    thisNode.addChild( background );
    thisNode.addChild( foreground );
    if ( options.showPH ) {
      thisNode.addChild( valueBackground );
      thisNode.addChild( valueNode );
    }
    thisNode.addChild( button );
    if ( DEBUG_ORIGIN ) {
      thisNode.addChild( new Circle( { radius: 3, fill: 'red' } ) );
    }

    // Update location
    dropper.locationProperty.link( function( location ) {
      thisNode.translation = mvt.modelToViewPosition( location );
    } );

    // Visibility
    dropper.visibleProperty.link( function( visible ) {
      thisNode.setVisible( visible );
      if ( !visible ) {
        dropper.flowRateProperty.set( 0 );
      }
    } );

    // Make the background visible only when the dropper is empty
    dropper.emptyProperty.link( function( empty ) {
      fluidNode.setVisible( !empty );
      background.setVisible( empty );
    } );

    // updates the pH value
    var pHObserver = function( pH ) {
      // pH value
      valueNode.text = createPHString( pH );
      // center the label in its translucent background
      valueNode.centerX = valueBackground.centerX;
      valueNode.centerY = valueBackground.centerY;
    };

    // Change the label and color when the soluteProperty changes.
    dropper.soluteProperty.link( function( solute, oldSolute ) {

      // rewire the pH observer
      if ( oldSolute ) { solute.pHProperty.unlink( pHObserver ); }
      solute.pHProperty.link( pHObserver );

      // fluid color
      fluidNode.fill = solute.color;
    } );

    // touch area
    var dx = 0.25 * foreground.width;
    var dy = 0.1 * foreground.height;
    thisNode.touchArea = Shape.rectangle( -( ( foreground.width / 2 ) + dx ), -( foreground.height + dy ), foreground.width + dx + dx, foreground.height + dy + dy );

    // drag handler
    thisNode.addInputListener( new MovableDragHandler( dropper, mvt ) );
  }

  // Formats a pH values for labeling the dropper, eg 'pH 11.00'
  var createPHString = function( pH ) {
    return StringUtils.format( pattern_ph_0value, Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES ) );
  };

  inherit( Node, DropperNode, {
    getTipWidth: function() {
      return TIP_WIDTH;
    }
  } );

  return DropperNode;
} );
