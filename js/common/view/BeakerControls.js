// Copyright 2013-2018, University of Colorado Boulder

/**
 * Controls what you see in the beaker.
 * This includes the 'H3O+/OH- ratio' and 'Molecule count' representations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var phScale = require( 'PH_SCALE/phScale' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var moleculeCountString = require( 'string!PH_SCALE/moleculeCount' );
  var ratioString = require( 'string!PH_SCALE/ratio' );

  // constants
  var FONT = new PhetFont( 20 );

  /**
   * @param {Property.<boolean>} ratioVisibleProperty
   * @param {Property.<boolean>} moleculeCountVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  function BeakerControls( ratioVisibleProperty, moleculeCountVisibleProperty, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 10,
      lineWidth: 2,
      fill: PHScaleColors.PANEL_FILL
    }, options );

    // 'H3O+/OH- ratio' checkbox, with color-coded label, spacing tweaked visually
    var textH3O = new RichText( PHScaleConstants.H3O_FORMULA, { font: FONT, fill: PHScaleColors.H3O_MOLECULES } );
    var textSlash = new Text( '/', { font: FONT, left: textH3O.right + 2 } );
    var textOH = new RichText( PHScaleConstants.OH_FORMULA, {
      font: FONT,
      fill: PHScaleColors.OH_MOLECULES,
      left: textSlash.right + 4,
      supXSpacing: 2
    } );
    var textRatio = new Text( ratioString, { font: FONT, left: textOH.right + 4 } );
    var ratioLabel = new Node( { children: [ textH3O, textSlash, textOH, textRatio ] } );
    var ratioCheckbox = new Checkbox( ratioLabel, ratioVisibleProperty );
    ratioCheckbox.touchArea = Shape.bounds( ratioCheckbox.localBounds.dilatedXY( 10, 8 ) );

    // 'Molecule count' checkbox
    var moleculeCountLabel = new Text( moleculeCountString, { font: FONT } );
    var moleculeCountCheckbox = new Checkbox( moleculeCountLabel, moleculeCountVisibleProperty );
    moleculeCountCheckbox.touchArea = Shape.bounds( ratioCheckbox.localBounds.dilatedXY( 10, 8 ) );

    var separator = new Line( 0, 0, Math.max( moleculeCountCheckbox.width, ratioCheckbox.width ), 0, { stroke: 'gray' } );

    var content = new LayoutBox( {
      children: [ ratioCheckbox, separator, moleculeCountCheckbox ],
      orientation: 'vertical',
      align: 'left',
      spacing: 10
    } );

    Panel.call( this, content, options );
  }

  phScale.register( 'BeakerControls', BeakerControls );

  return inherit( Panel, BeakerControls );
} );
