// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control for switching between 2 choices.
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
   * @param {Property<*>} choiceProperty
   * @param {*} leftChoice
   * @param {String} leftLabel
   * @param {*} rightChoice
   * @param {String} rightLabel
   * @param {*} options
   * @constructor
   */
  function ChoiceSwitch( choiceProperty, leftChoice, leftLabel, rightChoice, rightLabel, options ) {

    options = _.extend( {
      size: new Dimension2( 60, 30 ),
      textFill: 'black',
      textDisabledFill: 'rgb(160,160,160)',
      font: new PhetFont( 28 ),
      xSpacing: 8,
      cursor: 'pointer'
    }, options );

    // default gradients
    options.trackFill = options.trackFill || new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'rgb(40,40,40)' ).addColorStop( 1, 'rgb(200,200,200)' );
    options.thumbFill = options.thumbFill || new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(200,200,200)' );

    var thisNode = this;
    Node.call( thisNode );

    var onProperty = new Property( choiceProperty.get() === rightChoice );

    var onOffSwitch = new OnOffSwitch( onProperty, {
      size: options.size,
      cursor: options.cursor,
      thumbFill: options.thumbFill,
      trackOnFill: options.trackFill,
      trackOffFill: options.trackFill
    } );
    var leftChoiceNode = new Text( leftLabel, {
      fill: options.textFill,
      font: options.font
    } );
    var rightChoiceNode = new Text( rightLabel, {
      fill: options.textFill,
      font: options.font
    } );

    // rendering order
    thisNode.addChild( onOffSwitch );
    thisNode.addChild( leftChoiceNode );
    thisNode.addChild( rightChoiceNode );

    // layout
    leftChoiceNode.right = onOffSwitch.left - options.xSpacing;
    leftChoiceNode.centerY = onOffSwitch.centerY;
    rightChoiceNode.left = onOffSwitch.right + options.xSpacing;
    rightChoiceNode.centerY = onOffSwitch.centerY;

    // sync properties
    choiceProperty.link( function( choice ) {
      onProperty.set( choice === rightChoice );
    } );
    onProperty.link( function( on ) {
      choiceProperty.set( on ? rightChoice : leftChoice );
      leftChoiceNode.fill = on ? options.textDisabledFill : options.textFill;
      rightChoiceNode.fill = on ? options.textFill : options.textDisabledFill;
    } );

    // click on labels to select choices
    leftChoiceNode.addInputListener( new ButtonListener( {
      fire: function() { onProperty.set( false ); }
    } ) );
    rightChoiceNode.addInputListener( new ButtonListener( {
      fire: function() { onProperty.set( true ); }
    } ) );

    thisNode.mutate( options );
  }

  return inherit( Node, ChoiceSwitch );
} );
