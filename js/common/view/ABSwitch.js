// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control for switching between 2 choices (A & B).
 * This is an adapter for OnOffProperty, the iOS-like on/off switch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OnOffSwitch = require( 'PH_SCALE/common/view/OnOffSwitch' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );

  //TODO support {Node} for labelA and labelB
  /**
   * @param {Property<*>} property
   * @param {*} objectA
   * @param {String} labelA label for 'A', to the left of the switch
   * @param {*} objectB
   * @param {String} labelB label for 'B', to the right of the switch
   * @param {*} options
   * @constructor
   */
  function ABSwitch( property, objectA, labelA, objectB, labelB, options ) {

    // default option values
    options = _.extend( {
      switchSize: new Dimension2( 60, 30 ),
      textFill: 'black',
      font: new PhetFont( 24 ),
      xSpacing: 8,
      cursor: 'pointer',
      centerOnButton: true
    }, options );
    options.trackFill = options.trackFill ||
                        new LinearGradient( 0, 0, 0, options.switchSize.height ).addColorStop( 0, 'rgb(40,40,40)' ).addColorStop( 1, 'rgb(200,200,200)' );
    options.thumbFill = options.thumbFill ||
                        new LinearGradient( 0, 0, 0, options.switchSize.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(200,200,200)' );

    var thisNode = this;
    Node.call( thisNode );

    // property for adapting to OnOffSwitch. 'true' is 'B', the object on the 'on' end of the OnOffSwitch.
    var onProperty = new Property( objectB === property.get() );

    var onOffSwitch = new OnOffSwitch( onProperty, {
      size: options.switchSize,
      cursor: options.cursor,
      thumbFill: options.thumbFill,
      trackOnFill: options.trackFill,
      trackOffFill: options.trackFill
    } );
    var labelANode = new MultiLineText( labelA, {
      fill: options.textFill,
      font: options.font
    } );
    var labelBNode = new MultiLineText( labelB, {
      fill: options.textFill,
      font: options.font
    } );

    // rendering order
    thisNode.addChild( onOffSwitch );
    thisNode.addChild( labelANode );
    thisNode.addChild( labelBNode );

    // layout: 'A' on the left, 'B' on the right
    labelANode.right = onOffSwitch.left - options.xSpacing;
    labelANode.centerY = onOffSwitch.centerY;
    labelBNode.left = onOffSwitch.right + options.xSpacing;
    labelBNode.centerY = onOffSwitch.centerY;

    // add a horizontal strut that will cause the 'centerX' of this node to be at the center of the button
    if ( options.centerOnButton ) {
      var additionalWidth = Math.abs( labelANode.width - labelBNode.width );
      var strut = new Line( 0, 0, thisNode.width + additionalWidth, 0 );
      thisNode.addChild( strut );
      strut.moveToBack();
      if ( labelANode.width < labelANode.width ) {
        strut.left = labelANode.left - ( additionalWidth / 2 );
      }
      else {
        strut.left = labelANode.left;
      }
    }

    // sync properties
    property.link( function( object ) {
      onProperty.set( objectB === object );
    } );
    onProperty.link( function( on ) {
      property.set( on ? objectB : objectA );
      //TODO if labelA and labelB support 'enabled', then change that property
    } );

    // click on labels to select
    labelANode.addInputListener( new ButtonListener( {
      fire: function() { onProperty.set( false ); }
    } ) );
    labelBNode.addInputListener( new ButtonListener( {
      fire: function() { onProperty.set( true ); }
    } ) );

    thisNode.mutate( options );
  }

  return inherit( Node, ABSwitch );
} );
