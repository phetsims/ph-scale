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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OnOffSwitch = require( 'PH_SCALE/common/view/OnOffSwitch' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );

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
      size: new Dimension2( 60, 30 ),
      textFill: 'black',
      textDisabledFill: 'rgb(160,160,160)',
      font: new PhetFont( 28 ),
      xSpacing: 8,
      cursor: 'pointer'
    }, options );
    options.trackFill = options.trackFill ||
                        new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'rgb(40,40,40)' ).addColorStop( 1, 'rgb(200,200,200)' );
    options.thumbFill = options.thumbFill ||
                        new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(200,200,200)' );

    var thisNode = this;
    Node.call( thisNode );

    // property for adapting to OnOffSwitch. 'true' is 'B', the object on the 'on' end of the OnOffSwitch.
    var onProperty = new Property( objectB === property.get() );

    var onOffSwitch = new OnOffSwitch( onProperty, {
      size: options.size,
      cursor: options.cursor,
      thumbFill: options.thumbFill,
      trackOnFill: options.trackFill,
      trackOffFill: options.trackFill
    } );
    var labelANode = new Text( labelA, {
      fill: options.textFill,
      font: options.font
    } );
    var labelBNode = new Text( labelB, {
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

    // sync properties
    property.link( function( object ) {
      onProperty.set( objectB === object );
    } );
    onProperty.link( function( on ) {
      property.set( on ? objectB : objectA );
      labelANode.fill = on ? options.textDisabledFill : options.textFill;
      labelBNode.fill = on ? options.textFill : options.textDisabledFill;
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
