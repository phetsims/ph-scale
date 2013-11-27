// Copyright 2002-2013, University of Colorado Boulder

/**
 * On/off switch, similar to iOS' UISwitch, used in 'Settings' app.
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
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Property<String>} onProperty
   * @param {*} options
   * @constructor
   */
  function OnOffSwitch( onProperty, options ) {

    options = _.extend( {
      size: new Dimension2( 60, 30 ),
      cursor: 'pointer',
      backgroundFill: 'white',
      sliderOnFill: 'rgb(0,255,0)',
      sliderOffFill: 'white'
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var cornerRadius = options.size.height / 2;
    var backgroundNode = new Rectangle( 0, 0, options.size.width, options.size.height, cornerRadius, cornerRadius, {
      fill: options.backgroundFill,
      stroke: 'black'
    } );
    thisNode.addChild( backgroundNode );

    var sliderNode = new Rectangle( 0, 0, 0.5 * options.size.width, options.size.height, cornerRadius, cornerRadius, {
      fill: options.sliderOffFill,
      stroke: 'black'
    } );
    thisNode.addChild( sliderNode );

    // move slider to on or off position
    var updateSlider = function( on ) {
      if ( on ) {
        sliderNode.right = options.size.width;
        sliderNode.fill = options.sliderOnFill;
      }
      else {
        sliderNode.left = 0;
        sliderNode.fill = options.sliderOffFill;
      }
    };

    // sync with onProperty
    onProperty.link( updateSlider.bind( thisNode ) );

    // slide the slider
    sliderNode.addInputListener( new SimpleDragHandler( {

      allowTouchSnag: true,

      translate: function( params ) {
        // move the slider while it's being dragged, but don't change the onProperty value
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
        // snap to whichever end the slider is closest to
        onProperty.set( sliderNode.centerX > backgroundNode.centerX );
        updateSlider( onProperty.get() );
      }
    } ) );

    // toggle when background is clicked
    backgroundNode.addInputListener( new ButtonListener( {
      fire: function() { onProperty.set( !onProperty.get() ); }
    } ) );

    thisNode.mutate( options );
  }

  return inherit( Node, OnOffSwitch );
} );
