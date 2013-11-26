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
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var moleculeCountString = require( 'string!PH_SCALE/moleculeCount' );
  var ratioString = require( 'string!PH_SCALE/ratio' );

  // constants
  var FONT = new PhetFont( 20 );

  /**
   * @param {Property<Boolean>} ratioVisibleProperty
   * @param {Property<Boolean>} moleculeCountVisibleProperty
   * @constructor
   */
  function BeakerControls( ratioVisibleProperty, moleculeCountVisibleProperty ) {

    //TODO the ordering of this label is not localized
    // Label with color-coded formulas
    var textH3O = new HTMLText( 'H<sub>3</sub>O<sup>+</sup>', { font: FONT, fill: PHScaleColors.ACIDIC } );
    var textSlash = new HTMLText( '/', { font: FONT } );
    var textOH = new HTMLText( 'OH<sup>-</sup>', { font: FONT, fill: PHScaleColors.BASIC } );
    var textRatio = new HTMLText( ratioString, { font: FONT } );
    var ratioLabel = new Node();
    ratioLabel.addChild( textH3O );
    ratioLabel.addChild( textSlash );
    ratioLabel.addChild( textOH );
    ratioLabel.addChild( textRatio );
    textSlash.left = textH3O.right + 1;
    textOH.left = textSlash.right + 1;
    textRatio.left = textOH.right + 6;
    //TODO how to align baselines of Text and HTMLText?
    textH3O.y = textH3O.y - 4;
    textOH.y = textOH.y - 4;

    var ratioCheckBox = new CheckBox( ratioLabel, ratioVisibleProperty );

    var moleculeCountLabel = new Text( moleculeCountString, { font: FONT } );
    var moleculeCountCheckBox = new CheckBox( moleculeCountLabel, moleculeCountVisibleProperty );

    var separator = new Line( 0, 0, Math.max( moleculeCountCheckBox.width, ratioCheckBox.width ), 0, { stroke: 'gray' } );

    var content = new VBox( {
      children: [ ratioCheckBox, separator, moleculeCountCheckBox ],
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
