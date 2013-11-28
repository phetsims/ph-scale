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
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Property<String>} onProperty
   * @param {*} options
   * @constructor
   */
  function OnOffSwitch( onProperty, options ) {

    options = _.extend( {
      size: new Dimension2( 60, 30 ), // if you want the thumb to be a circle, use width that is 2x height
      cursor: 'pointer',
      thumbFill: 'white',
      thumbStroke: 'black',
      trackOffFill: 'white', // track fill when onProperty is false
      trackOnFill: 'rgb(0,200,0)', // track fill when onProperty is true
      trackStroke: 'black'
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // track that the thumb slides in
    var cornerRadius = options.size.height / 2;
    var trackNode = new Rectangle( 0, 0, options.size.width, options.size.height, cornerRadius, cornerRadius, {
      fill: options.trackOffFill,
      stroke: options.trackStroke
    } );
    thisNode.addChild( trackNode );

    // thumb (aka knob)
    var thumbNode = new Rectangle( 0, 0, 0.5 * options.size.width, options.size.height, cornerRadius, cornerRadius, {
      fill: options.thumbFill,
      stroke: options.thumbStroke
    } );
    thisNode.addChild( thumbNode );
    var touchDelta = 0.25 * options.size.height;
    thumbNode.touchArea = Shape.roundRect( -touchDelta, -touchDelta, (0.5 * options.size.width) + (2 * touchDelta), options.size.height + (2 * touchDelta), cornerRadius, cornerRadius );

    // move thumb to on or off position
    var updateThumb = function( on ) {
      if ( on ) {
        thumbNode.right = options.size.width;
        trackNode.fill = options.trackOnFill;
      }
      else {
        thumbNode.left = 0;
        trackNode.fill = options.trackOffFill;
      }
    };

    // sync with onProperty
    onProperty.link( updateThumb.bind( thisNode ) );

    // thumb interactivity
    thumbNode.addInputListener( new SimpleDragHandler( {

      allowTouchSnag: true,

      translate: function( params ) {
        // move the thumb while it's being dragged, but don't change the onProperty value
        if ( thumbNode.left + params.delta.x < 0 ) {
          thumbNode.left = 0;
        }
        else if ( thumbNode.right + params.delta.x > options.size.width ) {
          thumbNode.right = options.size.width;
        }
        else {
          thumbNode.x = thumbNode.x + params.delta.x;
        }
        trackNode.fill = ( thumbNode.centerX > trackNode.centerX ) ? options.trackOnFill : options.trackOffFill;
      },

      end: function() {
        // snap to whichever end the thumb is closest to
        onProperty.set( thumbNode.centerX > trackNode.centerX );
        updateThumb( onProperty.get() );
      }
    } ) );

    // click in the track to toggle on/off
    trackNode.addInputListener( new ButtonListener( {
      fire: function() { onProperty.set( !onProperty.get() ); }
    } ) );

    thisNode.mutate( options );
  }

  return inherit( Node, OnOffSwitch );
} );
