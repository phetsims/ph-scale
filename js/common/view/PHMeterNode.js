// Copyright 2002-2013, University of Colorado Boulder

/**
 * pH meter for the 'Solutions' and 'Custom' screens.
 * Origin is at top left.
 * The meter can be expanded and collapsed.
 * By default, the meter display pH but does not allow you to change it.
 * pH can be optionally changed (using a picker) for custom solutions.
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
  var Util = require( 'DOT/Util' );

  // strings
  var pHString = require( 'string!PH_SCALE/pH' );
  var stringNoValue = '-';

  // constants
  var X_MARGIN = 14;
  var Y_MARGIN = 10;
  var Y_SPACING = 10;
  var CORNER_RADIUS = 12;

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * This button also causes the ValueNode to show/hide the value.
   *
   * @param {Solution} solution
   * @param {Property<Boolean>} expandedProperty
   * @param {Boolean} isInteractive
   * @constructor
   */
  function ValueNode( solution, expandedProperty, isInteractive ) {

    var thisNode = this;
    Node.call( thisNode );

    var valueNode = new Node();
    if ( isInteractive ) {

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
      valueNode = new NumberPicker( pickerValueProperty, new Property( PHScaleConstants.PH_RANGE ), {
        intervalDelay: 40,
        color: new Color( 0, 200, 0 ),
        decimalPlaces: 2,
        font: new PhetFont( 30 ),
        upFunction: function() { return pickerValueProperty.get() + 0.01; },
        downFunction: function() { return pickerValueProperty.get() - 0.01; }
      } );
    }
    else {
      // pH value
      var valueText = new Text( Util.toFixed( PHScaleConstants.PH_RANGE.max, PHScaleConstants.PH_METER_DECIMAL_PLACES ),
        { fill: 'black', font: new PhetFont( 28 ) } );

      // rectangle that the value is displayed in
      var valueXMargin = 8;
      var valueYMargin = 5;
      var valueRectangle = new Rectangle( 0, 0, valueText.width + ( 2 * valueXMargin ), valueText.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS,
        { fill: 'white', stroke: 'darkGray' } );

      // rendering order
      valueNode.addChild( valueRectangle );
      valueNode.addChild( valueText );

      // layout
      valueText.right = valueRectangle.right - valueXMargin;
      valueText.centerY = valueRectangle.centerY;

      // sync with pH value
      solution.pHProperty.link( function( pH ) {
        if ( pH === null ) {
          valueText.text = stringNoValue;
          valueText.centerX = valueRectangle.centerX; // center justified
        }
        else {
          valueText.text = Util.toFixed( pH, PHScaleConstants.PH_METER_DECIMAL_PLACES );
          valueText.right = valueRectangle.right - valueXMargin; // right justified
        }
      } );
    }

    // label above the value
    var labelNode = new Text( pHString, { fill: 'black', font: new PhetFont( { size: 28, weight: 'bold' } ) } );

    // expanded background
    var backgroundOptions = { fill: PHScaleColors.PANEL_FILL, stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width, valueNode.width ) + ( 2 * X_MARGIN );
    var expandedHeight = labelNode.height + valueNode.height + ( 2 * Y_MARGIN ) + Y_SPACING;
    var expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // collapsed background
    var collapsedHeight = labelNode.height + ( 2 * Y_MARGIN );
    var collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH, expandedProperty );

    // rendering order
    thisNode.addChild( collapsedRectangle );
    thisNode.addChild( expandedRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
    thisNode.addChild( valueNode );

    // layout
    labelNode.top = expandedRectangle.top + Y_MARGIN;
    labelNode.left = X_MARGIN;
    valueNode.centerX = expandedRectangle.centerX;
    valueNode.top = labelNode.bottom + Y_MARGIN;
    expandCollapseButton.right = expandedRectangle.right - X_MARGIN;
    expandCollapseButton.centerY = labelNode.centerY;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      expandedRectangle.visible = valueNode.visible = expanded;
      collapsedRectangle.visible = !expanded;
    } );
  }

  inherit( Node, ValueNode );

  /**
   * @param {Solution} solution
   * @param {*} options
   * @constructor
   */
  function PHMeterNode( solution, options ) {

    options = _.extend( {
      expanded: true,
      isInteractive: false
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    var expandedProperty = new Property( options.expanded );

    // nodes
    var valueNode = new ValueNode( solution, expandedProperty, options.isInteractive );
    //TODO add probe

    // rendering order
    var meterNode = new Node( { children: [ valueNode ] } );
    thisNode.addChild( meterNode );
    //TODO thisNode.addChild( probeNode );

    // layout
    //TODO position probe

    expandedProperty.link( function( expanded ) {
      //TODO probeNode.visible = expanded;
    } );

    thisNode.mutate( options );
  }

  return inherit( Node, PHMeterNode );
} );
