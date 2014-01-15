// Copyright 2002-2014, University of Colorado Boulder

/**
 * Drag handler for the interactive graph indicators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Function} yToValue function that takes a {Number} y coordinate and converts it to a {Number} value
   * @param {Function} setValue takes a {Number} value, returns nothing
   * @constructor
   */
  function GraphIndicatorDragHandler( yToValue, setValue ) {
    var clickYOffset; // y-offset between initial click and indicator's origin
    SimpleDragHandler.call( this, {
      allowTouchSnag: true,
      start: function( event ) {
        clickYOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
      },
      drag: function( event ) {
        var y = event.currentTarget.globalToParentPoint( event.pointer.point ).y - clickYOffset;
        setValue( yToValue( y ) );
      }
    } );
  }

  return inherit( SimpleDragHandler, GraphIndicatorDragHandler );
} );
