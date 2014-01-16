// Copyright 2002-2014, University of Colorado Boulder

/**
 * Graph with a linear scale, for displaying concentration (mol/L) and quantity (moles).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Solution} solution
   * @param {Property<GraphUnits>} graphUnitsProperty
   * @param {*} options
   * @constructor
   */
  function LinearGraph( solution, graphUnitsProperty, options ) {

    options = _.extend( {
      scaleHeight: 100,
      minScaleWidth: 80,
      scaleCornerRadius: 20,
      scaleStroke: 'black',
      scaleLineWidth: 2
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    //TODO placeholder, implement this graph
    thisNode.addChild( new Rectangle( 0, 0, options.minScaleWidth, options.scaleHeight, options.scaleCornerRadius, options.scaleCornerRadius, {
      stroke: options.scaleStroke,
      lineWidth: options.scaleLineWidth
    } ) );
  }

  return inherit( Node, LinearGraph );
} );
