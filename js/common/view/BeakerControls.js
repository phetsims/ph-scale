// Copyright 2002-2013, University of Colorado Boulder

/**
 * Controls for the beaker.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var CheckBox = require( 'SUN/CheckBox' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var moleculeCountString = 'Molecule count'; //TODO i18n
  var ratioString = 'H<sub>3</sub>O<sup>+</sup>/OH<sup>-</sup> ratio';

  // constants
  var FONT = new PhetFont( 20 );

  /**
   * @param {Property<Boolean>} moleculeCountVisibleProperty
   * @param {Property<Boolean>} ratioVisibleProperty
   * @constructor
   */
  function BeakerControls( moleculeCountVisibleProperty, ratioVisibleProperty ) {

    var moleculeCountLabel = new Text( moleculeCountString, { font: FONT } );
    var moleculeCountCheckBox = new CheckBox( moleculeCountLabel, moleculeCountVisibleProperty );

    var ratioLabel = new HTMLText( ratioString, { font: FONT } );
    var ratioCheckBox = new CheckBox( ratioLabel, ratioVisibleProperty );

    var separator = new Line( 0, 0, Math.max( moleculeCountCheckBox.width, ratioCheckBox.width ), 0, { stroke: 'gray' } );

    var content = new VBox( {
      children: [ moleculeCountCheckBox, separator, ratioCheckBox ],
      align: 'left',
      spacing: 10
    } );

    Panel.call( this, content, {
      xMargin: 15,
      yMargin: 10,
      fill: 'rgb(240,240,240)'
    } );
  }

  return inherit( Panel, BeakerControls );
} );
