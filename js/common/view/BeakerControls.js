// Copyright 2013-2019, University of Colorado Boulder

/**
 * Controls what you see in the beaker.
 * This includes the 'H3O+/OH- ratio' and 'Molecule count' representations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const moleculeCountString = require( 'string!PH_SCALE/moleculeCount' );
  const ratioString = require( 'string!PH_SCALE/ratio' );

  // constants
  const FONT = new PhetFont( 20 );

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
    const textH3O = new RichText( PHScaleConstants.H3O_FORMULA, { font: FONT, fill: PHScaleColors.H3O_MOLECULES } );
    const textSlash = new Text( '/', { font: FONT, left: textH3O.right + 2 } );
    const textOH = new RichText( PHScaleConstants.OH_FORMULA, {
      font: FONT,
      fill: PHScaleColors.OH_MOLECULES,
      left: textSlash.right + 4,
      supXSpacing: 2
    } );
    const textRatio = new Text( ratioString, { font: FONT, left: textOH.right + 4 } );
    const ratioLabel = new Node( { children: [ textH3O, textSlash, textOH, textRatio ] } );
    const ratioCheckbox = new Checkbox( ratioLabel, ratioVisibleProperty );
    ratioCheckbox.touchArea = Shape.bounds( ratioCheckbox.localBounds.dilatedXY( 10, 8 ) );

    // 'Molecule count' checkbox
    const moleculeCountLabel = new Text( moleculeCountString, { font: FONT } );
    const moleculeCountCheckbox = new Checkbox( moleculeCountLabel, moleculeCountVisibleProperty );
    moleculeCountCheckbox.touchArea = Shape.bounds( ratioCheckbox.localBounds.dilatedXY( 10, 8 ) );

    const separator = new Line( 0, 0, Math.max( moleculeCountCheckbox.width, ratioCheckbox.width ), 0, { stroke: 'gray' } );

    const content = new LayoutBox( {
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
