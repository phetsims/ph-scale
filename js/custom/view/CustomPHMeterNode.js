// Copyright 2002-2014, University of Colorado Boulder

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
  var X_SPACING = 14;
  var Y_SPACING = 10;
  var CORNER_RADIUS = 12;

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
      intervalDelay: 40,
      color: new Color( 0, 200, 0 ),
      decimalPlaces: 2,
      font: new PhetFont( 30 ),
      upFunction: function() { return pickerValueProperty.get() + 0.01; },
      downFunction: function() { return pickerValueProperty.get() - 0.01; }
    } );

    // label above the picker
    var labelNode = new Text( pHString, { fill: 'black', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // expanded background
    var backgroundOptions = { fill: PHScaleColors.PANEL_FILL, stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width + expandCollapseButton.width + X_SPACING, picker.width ) + ( 2 * X_SPACING );
    var backgroundHeight = labelNode.height + picker.height + ( 3 * Y_SPACING );
    var backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // rendering order
    thisNode.addChild( backgroundNode );
    thisNode.addChild( picker );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );

    // layout
    labelNode.top = backgroundNode.top + Y_SPACING;
    picker.centerX = backgroundNode.centerX;
    labelNode.left = backgroundNode.left + X_SPACING;
    picker.top = labelNode.bottom + Y_SPACING;
    expandCollapseButton.centerY = labelNode.centerY;
    expandCollapseButton.right = backgroundNode.right - X_SPACING;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      picker.visible = expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, CustomPHMeterNode );
} );
