// Copyright 2002-2014, University of Colorado Boulder

//TODO add spinners
/**
 * Component for displaying and changing the pH value of a 'custom' solution.
 * The meter can be expanded and collapsed (to show/hide the value), and the pH value can be changed using spinners.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Solute = require( 'PH_SCALE/common/model/Solute' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );

  // constants
  var DISPLAY_X_SPACING = 14;
  var DISPLAY_Y_SPACING = 10;
  var DISPLAY_CORNER_RADIUS = 12;
  var PH_LABEL_FONT = new PhetFont( { size: 28, weight: 'bold' } );

  /**
   * @param {Solution} solution
   * @param {Property<Boolean>} expandedProperty optional
   * @constructor
   */
  function CustomPHMeterNode( solution, options ) {

    options = _.extend( { expanded: true }, options );

    var thisNode = this;
    Node.call( thisNode );

    // expand/collapse button
    var expandedProperty = new Property( options.expanded );
    var expandCollapseButton = new ExpandCollapseButton( PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH, expandedProperty );

    /*
     * Value displayed by the pH picker. Keep this synchronized with the solution's pH.
     * Create a new custom solute whenever the pH picker's value changes.
     * When the solution's volume is zero, it's pH will be null, so do not create a new solute.
     */
    var pickerValueProperty = new Property( solution.pHProperty.get() );
    solution.pHProperty.link( function( pH ) {
      pickerValueProperty.set( pH );
    } );
    pickerValueProperty.link( function( pH ) {
      if ( pH !== null ) { solution.soluteProperty.set( Solute.createCustom( pH ) ); }
    } );

    // pH picker,
    var picker = new NumberPicker( pickerValueProperty, new Property( PHScaleConstants.PH_RANGE ), {
      color: new Color( 0, 200, 0 ),
      decimalPlaces: 2,
      font: new PhetFont( 30 ),
      upFunction: function() { return pickerValueProperty.get() + 0.01; },
      downFunction: function() { return pickerValueProperty.get() - 0.01; }
    } );


    // label above the picker
    var labelNode = new Text( pHString, { fill: 'black', font: PH_LABEL_FONT } );

    // expanded background
    var cornerRadius = 12;
    var backgroundOptions = { fill: PHScaleColors.PANEL_FILL, stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width + expandCollapseButton.width + DISPLAY_X_SPACING, picker.width ) + ( 2 * DISPLAY_X_SPACING );
    var expandedHeight = labelNode.height + picker.height + ( 3 * DISPLAY_Y_SPACING );
    var expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, cornerRadius, cornerRadius, backgroundOptions );

    // collapsed background
    var collapsedHeight = labelNode.height + ( 2 * DISPLAY_Y_SPACING );
    var collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, DISPLAY_CORNER_RADIUS, DISPLAY_CORNER_RADIUS, backgroundOptions );

    // rendering order
    thisNode.addChild( collapsedRectangle );
    thisNode.addChild( expandedRectangle );
    thisNode.addChild( picker );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );

    // layout
    labelNode.top = expandedRectangle.top + DISPLAY_Y_SPACING;
    picker.centerX = expandedRectangle.centerX;
    labelNode.left = expandedRectangle.left + DISPLAY_X_SPACING;
    picker.top = labelNode.bottom + DISPLAY_Y_SPACING;
    expandCollapseButton.centerY = labelNode.centerY;
    expandCollapseButton.right = expandedRectangle.right - DISPLAY_X_SPACING;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      expandedRectangle.visible = picker.visible = expanded;
      collapsedRectangle.visible = !expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, CustomPHMeterNode );
} );
