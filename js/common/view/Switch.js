// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control for switching between 2 choices. Similar to UISwitch in iOS 'Settings' app.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HighlightListener = require( 'SCENERY_PHET/input/HighlightListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Property<String>} choiceProperty
   * @param {String} leftChoice
   * @param {String} rightChoice
   * @param {*} options
   * @constructor
   */
  function Switch( choiceProperty, leftChoice, rightChoice, options ) {

    options = _.extend( {
      size: new Dimension2( 60, 30 ),
      cornerRadius: 22,
      textFill: 'black',
      textDisabledFill: 'gray',
      font: new PhetFont( 28 ),
      xSpacing: 6,
      cursor: 'pointer'
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var backgroundNode = new Rectangle( 0, 0, options.size.width, options.size.height, options.cornerRadius, options.cornerRadius, {
      fill: new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'rgb(40,40,40)' ).addColorStop( 1, 'rgb(200,200,200)' ),
      stroke: 'black'
    } );
    var sliderFill = new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(200,200,200)' );
    var sliderHighlightFill = new LinearGradient( 0, 0, 0, options.size.height ).addColorStop( 0, 'white' ).addColorStop( 1, 'rgb(230,230,230)' );
    var sliderNode = new Rectangle( 0, 0, 0.5 * options.size.width, options.size.height, options.cornerRadius, options.cornerRadius, {
      fill: sliderFill,
      stroke: 'black'
    } );
    var leftChoiceNode = new Text( leftChoice, {
      fill: options.textFill,
      font: options.font
    } );
    var rightChoiceNode = new Text( rightChoice, {
      fill: options.textFill,
      font: options.font
    } );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( sliderNode );
    thisNode.addChild( leftChoiceNode );
    thisNode.addChild( rightChoiceNode );

    // layout
    sliderNode.centerY = backgroundNode.centerY;
    leftChoiceNode.right = backgroundNode.left - options.xSpacing;
    leftChoiceNode.centerY = backgroundNode.centerY;
    rightChoiceNode.left = backgroundNode.right + options.xSpacing;
    rightChoiceNode.centerY = backgroundNode.centerY;

    var updateSliderPosition = function( choice ) {
      if ( choice === leftChoice ) {
        sliderNode.left = 0;
      }
      else if ( choice === rightChoice ) {
        sliderNode.right = options.size.width;
      }
      else {
        throw new Error( 'unsupported choice: ' + choice );
      }
    };

    // sync with property
    choiceProperty.link( updateSliderPosition.bind( thisNode ) );

    // slide the slider
    sliderNode.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      translate: function( params ) {
        if ( sliderNode.left + params.delta.x < 0 ) {
          sliderNode.left = 0;
        }
        else if ( sliderNode.right + params.delta.x > options.size.width ) {
           sliderNode.right = options.size.width;
         }
        else {
          sliderNode.x = sliderNode.x + params.delta.x;
        }
      },
      end: function() {
        // move to whichever end the slider is closest to
        if ( sliderNode.centerX <= backgroundNode.centerX ) {
          choiceProperty.set( leftChoice );
        }
        else {
          choiceProperty.set( rightChoice );
        }
        updateSliderPosition( choiceProperty.get() );
      }
    } ) );

    // highlight the slider on pointer over
    sliderNode.addInputListener( new HighlightListener( function( target, highlighted ) {
      sliderNode.fill = highlighted ? sliderHighlightFill : sliderFill;
    }));

    // toggle when background is clicked
    backgroundNode.addInputListener( new ButtonListener( {
      fire: function() {
        if ( choiceProperty.get() === leftChoice ) {
          choiceProperty.set( rightChoice );
        }
        else {
          choiceProperty.set( leftChoice );
        }
      }
    } ) );

    // click on labels to select choices
    leftChoiceNode.addInputListener( new ButtonListener( {
      fire: function() { choiceProperty.set( leftChoice ); }
    } ) );
    rightChoiceNode.addInputListener( new ButtonListener( {
      fire: function() { choiceProperty.set( rightChoice ); }
    } ) );

    thisNode.mutate( options );
  }

  return inherit( Node, Switch );
} );
