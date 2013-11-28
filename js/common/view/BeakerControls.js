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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
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

    // label for ratio check box is color-coded
    var stringH3O = '<span style="color:' + PHScaleColors.ACIDIC.toCSS() + '">H<sub>3</sub>O<sup>+</sup></span>';
    var stringOH = '<span style="color:' + PHScaleColors.BASIC.toCSS() + '">OH<sup>-</sup></span>';
    var ratioLabel = new HTMLText( StringUtils.format( ratioString, stringH3O, stringOH ), { font: FONT } );
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
