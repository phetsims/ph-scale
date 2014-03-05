// Copyright 2002-2013, University of Colorado Boulder

/**
 * Controls what you see in the beaker.
 * This includes the 'H3O+/OH- ratio' and 'Molecule count' representations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var CheckBox = require( 'SUN/CheckBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var RatioNode = require( 'PH_SCALE/common/view/RatioNode' );
  var Shape = require( 'KITE/Shape' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
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

    // 'H3O+/OH- ratio' check box, with color-coded label, spacing tweaked visually
    var textH3O = new SubSupText( PHScaleConstants.H3O_FORMULA, { font: FONT, fill: PHScaleColors.H3O_MOLECULES } );
    var textSlash = new Text( '/', { font: FONT, left: textH3O.right + 2 } );
    var textOH = new SubSupText( PHScaleConstants.OH_FORMULA, { font: FONT, fill: PHScaleColors.OH_MOLECULES, left: textSlash.right + 4, supXSpacing: 2 } );
    var textRatio = new Text( ratioString, { font: FONT, left: textOH.right + 4 } );
    var ratioLabel = new Node( { children: [ textH3O, textSlash, textOH, textRatio ] } );
    var ratioCheckBox = new CheckBox( ratioLabel, ratioVisibleProperty );
    ratioCheckBox.touchArea = Shape.bounds( ratioCheckBox.localBounds.dilatedXY( 10, 8 ) );

    // 'Molecule count' check box
    var moleculeCountLabel = new Text( moleculeCountString, { font: FONT } );
    var moleculeCountCheckBox = new CheckBox( moleculeCountLabel, moleculeCountVisibleProperty );
    moleculeCountCheckBox.touchArea = Shape.bounds( ratioCheckBox.localBounds.dilatedXY( 10, 8 ) );

    var separator = new Line( 0, 0, Math.max( moleculeCountCheckBox.width, ratioCheckBox.width ), 0, { stroke: 'gray' } );

    var content = new VBox( {
      children: [ ratioCheckBox, separator, moleculeCountCheckBox ],
      align: 'left',
      spacing: 10
    } );

    //TODO 'ratio' feature is excluded from production version until we work out issues
    if ( !window.phetcommon.getQueryParameter( 'dev' ) ) {
      content.removeChild( separator );
      content.removeChild( ratioCheckBox );
    }

    Panel.call( this, content, {
      xMargin: 15,
      yMargin: 10,
      lineWidth: 2,
      fill: PHScaleColors.PANEL_FILL
    } );
  }

  return inherit( Panel, BeakerControls );
} );
