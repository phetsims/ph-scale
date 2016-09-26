// Copyright 2013-2015, University of Colorado Boulder

/**
 * Container for all components related to the graph feature.
 * It has an expand/collapse bar at the top of it, and can switch between 'concentration' and 'quantity'.
 * Logarithmic graph is the standard scale. Interactivity and a linear scale are optional.
 * Origin is at top-left of the expand/collapse bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ABSwitch = require( 'SUN/ABSwitch' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseBar = require( 'SUN/ExpandCollapseBar' );
  var GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  var GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGraph = require( 'PH_SCALE/common/view/graph/LinearGraph' );
  var LogarithmicGraph = require( 'PH_SCALE/common/view/graph/LogarithmicGraph' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var phScale = require( 'PH_SCALE/phScale' );
  var PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  var PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  // strings
  var concentrationString = require( 'string!PH_SCALE/concentration' );
  var linearString = require( 'string!PH_SCALE/linear' );
  var logarithmicString = require( 'string!PH_SCALE/logarithmic' );
  var unitsMolesString = require( 'string!PH_SCALE/units.moles' );
  var unitsMolesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  var quantityString = require( 'string!PH_SCALE/quantity' );

  // constants
  var AB_SWITCH_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  /**
   * @param {Solution} solution
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function GraphNode( solution, expandedProperty, options ) {

    options = _.extend( {
      isInteractive: false, // only the Log scale can be interactive
      logScaleHeight: 500,
      linearScaleHeight: 500,
      units: GraphUnits.MOLES_PER_LITER, // initial state of the units switch
      hasLinearFeature: false, // add the linear graph feature?
      graphScale: GraphScale.LOGARITHMIC // initial state of the scale switch, meaningful only if hasLinearFeature === true
    }, options );

    Node.call( this );

    var mantissaRange = PHScaleConstants.LINEAR_MANTISSA_RANGE;
    var exponentRange = PHScaleConstants.LINEAR_EXPONENT_RANGE;

    // @private Properties specific to GraphNode
    this.graphUnitsProperty = new Property( options.units );
    this.exponentProperty = new Property( exponentRange.max ); // {number} exponent on the linear graph
    this.graphScaleProperty = new Property( options.graphScale ); // {number} scale on the linear graph

    // expand/collapse bar
    var expandCollapseBar = new ExpandCollapseBar(
      new Text( '' ),
      expandedProperty, {
        minWidth: 350,
        minHeight: 55,
        barFill: PHScaleColors.PANEL_FILL,
        barLineWidth: 2,
        buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH
      } );

    // units switch (Concentration vs Quantity)
    var graphUnitsSwitch = new ABSwitch( this.graphUnitsProperty,
      GraphUnits.MOLES_PER_LITER, new MultiLineText( concentrationString + '\n(' + unitsMolesPerLiterString + ')', {
        font: AB_SWITCH_FONT,
        maxWidth: 125
      } ),
      GraphUnits.MOLES, new MultiLineText( quantityString + '\n(' + unitsMolesString + ')', {
        font: AB_SWITCH_FONT,
        maxWidth: 85
      } ), {
        size: new Dimension2( 50, 25 ),
        centerOnButton: true,
        center: expandCollapseBar.center
      } );

    // logarithmic graph
    var logarithmicGraph = new LogarithmicGraph( solution, this.graphUnitsProperty, {
      scaleHeight: options.logScaleHeight,
      isInteractive: options.isInteractive
    } );

    // vertical line that connects bottom of expand/collapse bar to top of graph
    var lineToBarNode = new Line( 0, 0, 0, 75, { stroke: 'black' } );

    // rendering order
    this.addChild( expandCollapseBar );
    this.addChild( graphUnitsSwitch );
    var graphNode = new Node();
    this.addChild( graphNode );
    graphNode.addChild( lineToBarNode );
    graphNode.addChild( logarithmicGraph );

    // layout
    logarithmicGraph.centerX = lineToBarNode.centerX;
    logarithmicGraph.y = 30; // y, not top
    graphNode.centerX = expandCollapseBar.centerX;
    graphNode.y = expandCollapseBar.bottom; // y, not top

    // expand/collapse the graph
    expandedProperty.link( function( expanded ) {
      graphNode.visible = expanded;
    } );

    // optional linear graph
    this.hasLinearFeature = options.hasLinearFeature; // @private
    if ( this.hasLinearFeature ) {

      // linear graph
      var linearGraph = new LinearGraph( solution, this.graphUnitsProperty, mantissaRange, this.exponentProperty, {
        scaleHeight: options.linearScaleHeight
      } );

      // zoom buttons for the linear graph
      var magnifyingGlassRadius = 13;
      var zoomOutButton = new ZoomButton( { in: false, radius: magnifyingGlassRadius } );
      var zoomInButton = new ZoomButton( { in: true, radius: magnifyingGlassRadius } );
      var zoomButtons = new Node( { children: [ zoomOutButton, zoomInButton ] } );
      zoomInButton.left = zoomOutButton.right + 25;
      zoomInButton.centerY = zoomOutButton.centerY;
      // expand touch area
      zoomOutButton.touchArea = zoomOutButton.localBounds.dilated( 5, 5 );
      zoomInButton.touchArea = zoomOutButton.localBounds.dilated( 5, 5 );

      // scale switch (Logarithmic vs Linear)
      var textOptions = {
        font: AB_SWITCH_FONT,
        maxWidth: 125
      };
      var graphScaleSwitch = new ABSwitch( this.graphScaleProperty,
        GraphScale.LOGARITHMIC, new Text( logarithmicString, textOptions ),
        GraphScale.LINEAR, new Text( linearString, textOptions ),
        { size: new Dimension2( 50, 25 ), centerOnButton: true } );

      // vertical line that connects bottom of graph to top of scale switch
      var lineToSwitchNode = new Line( 0, 0, 0, 200, { stroke: 'black ' } );

      // rendering order
      graphNode.addChild( lineToSwitchNode );
      lineToSwitchNode.moveToBack();
      graphNode.addChild( linearGraph );
      graphNode.addChild( zoomButtons );
      graphNode.addChild( graphScaleSwitch );

      // layout
      var ySpacing = 15;
      linearGraph.centerX = logarithmicGraph.centerX;
      linearGraph.y = logarithmicGraph.y; // y, not top
      zoomButtons.centerX = logarithmicGraph.centerX;
      zoomButtons.top = linearGraph.y + options.linearScaleHeight + ( 3 * ySpacing );
      graphScaleSwitch.centerX = lineToSwitchNode.centerX;
      graphScaleSwitch.top = zoomButtons.bottom + ySpacing;
      lineToSwitchNode.centerX = lineToBarNode.centerX;
      lineToSwitchNode.bottom = graphScaleSwitch.top + 1;

      // handle scale changes
      this.graphScaleProperty.link( function( graphScale ) {
        logarithmicGraph.visible = ( graphScale === GraphScale.LOGARITHMIC );
        linearGraph.visible = zoomButtons.visible = ( graphScale === GraphScale.LINEAR );
      } );

      // enable/disable zoom buttons
      this.exponentProperty.link( function( exponent ) {
        assert && assert( exponentRange.contains( exponent ) );
        zoomInButton.enabled = ( exponent > exponentRange.min );
        zoomOutButton.enabled = ( exponent < exponentRange.max );
      } );

      // handle zoom of linear graph
      var self = this;
      zoomInButton.addListener( function() {
        self.exponentProperty.set( self.exponentProperty.get() - 1 );
      } );
      zoomOutButton.addListener( function() {
        self.exponentProperty.set( self.exponentProperty.get() + 1 );
      } );
    }
  }

  phScale.register( 'GraphNode', GraphNode );

  return inherit( Node, GraphNode, {

    // @public
    reset: function() {
      this.graphUnitsProperty.reset();
      this.exponentProperty.reset();
      this.graphScaleProperty.reset();
    }
  } );
} );
