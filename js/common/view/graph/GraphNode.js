// Copyright 2013-2020, University of Colorado Boulder

//TODO #92 which subcomponents need to be instrumented?
//TODO #92 instrument thin vertical lines?
/**
 * Container for all components related to the graph feature.
 * It has an expand/collapse bar at the top of it, and can switch between 'concentration' and 'quantity'.
 * Logarithmic graph is the standard scale. Interactivity and a linear scale are optional.
 * Origin is at top-left of the expand/collapse bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ExpandCollapseBar = require( 'SUN/ExpandCollapseBar' );
  const GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  const GraphScaleSwitch = require( 'PH_SCALE/common/view/graph/GraphScaleSwitch' );
  const GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGraphNode = require( 'PH_SCALE/common/view/graph/LinearGraphNode' );
  const LogarithmicGraphNode = require( 'PH_SCALE/common/view/graph/LogarithmicGraphNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const concentrationString = require( 'string!PH_SCALE/concentration' );
  const quantityString = require( 'string!PH_SCALE/quantity' );
  const unitsMolesPerLiterString = require( 'string!PH_SCALE/units.molesPerLiter' );
  const unitsMolesString = require( 'string!PH_SCALE/units.moles' );

  // constants
  const AB_SWITCH_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  class GraphNode extends Node {

    /**
     * @param {Solution} solution
     * @param {Property.<boolean>} expandedProperty
     * @param {Object} [options]
     */
    constructor( solution, expandedProperty, options ) {

      options = merge( {
        isInteractive: false, // only the Log scale can be interactive
        logScaleHeight: 500,
        linearScaleHeight: 500,
        units: GraphUnits.MOLES_PER_LITER, // initial state of the units switch
        hasLinearFeature: false, // add the linear graph feature?
        graphScale: GraphScale.LOGARITHMIC, // initial state of the scale switch, meaningful only if hasLinearFeature === true

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      super();

      // @private units
      this.graphUnitsProperty = new EnumerationProperty( GraphUnits, options.units, {
        tandem: options.tandem.createTandem( 'graphUnitsProperty' )
      } );

      // @private scale (log, linear) of the graph
      this.graphScaleProperty = new EnumerationProperty( GraphScale, options.graphScale, {
        tandem: options.tandem.createTandem( 'graphScaleProperty' )
      } );

      // expand/collapse bar
      const expandCollapseBar = new ExpandCollapseBar(
        new Text( '' ),
        expandedProperty, {
          minWidth: 350,
          minHeight: 55,
          barFill: PHScaleColors.PANEL_FILL,
          barLineWidth: 2,
          buttonLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH,
          tandem: options.tandem.createTandem( 'expandCollapseBar' )
        } );

      // units switch (Concentration vs Quantity)
      const concentrationLabel = new RichText( concentrationString + '<br>(' + unitsMolesPerLiterString + ')', {
        align: 'center',
        font: AB_SWITCH_FONT,
        maxWidth: 125
      } );
      const quantityLabel = new RichText( quantityString + '<br>(' + unitsMolesString + ')', {
        align: 'center',
        font: AB_SWITCH_FONT,
        maxWidth: 85
      } );
      const graphUnitsSwitch = new ABSwitch( this.graphUnitsProperty,
        GraphUnits.MOLES_PER_LITER, concentrationLabel,
        GraphUnits.MOLES, quantityLabel, {
          size: new Dimension2( 50, 25 ),
          centerOnButton: true,
          center: expandCollapseBar.center,
          tandem: options.tandem.createTandem( 'graphUnitsSwitch' ),
          phetioDocumentation: 'A/B switch for switching units'
        } );

      // logarithmic graph
      const logarithmicGraphNode = new LogarithmicGraphNode( solution, this.graphUnitsProperty, {
        scaleHeight: options.logScaleHeight,
        isInteractive: options.isInteractive,
        tandem: options.tandem.createTandem( 'logarithmicGraphNode' )
      } );

      // vertical line that connects bottom of expand/collapse bar to top of graph
      const lineToBarNode = new Line( 0, 0, 0, 75, { stroke: 'black' } );

      // rendering order
      this.addChild( expandCollapseBar );
      this.addChild( graphUnitsSwitch );
      const graphNode = new Node();
      this.addChild( graphNode );
      graphNode.addChild( lineToBarNode );
      graphNode.addChild( logarithmicGraphNode );

      // layout
      logarithmicGraphNode.centerX = lineToBarNode.centerX;
      logarithmicGraphNode.y = 30; // y, not top
      graphNode.centerX = expandCollapseBar.centerX;
      graphNode.y = expandCollapseBar.bottom; // y, not top

      // expand/collapse the graph
      expandedProperty.link( expanded => {
        graphNode.visible = expanded;
      } );

      // @private {LinearGraphNode|null} optional linear graph
      this.linearGraphNode = null;
      if ( options.hasLinearFeature ) {

        // linear graph
        this.linearGraphNode = new LinearGraphNode( solution, this.graphUnitsProperty, {
          scaleHeight: options.linearScaleHeight,
          tandem: options.tandem.createTandem( 'linearGraphNode' )
        } );

        // scale switch (Logarithmic vs Linear)
        const graphScaleSwitch = new GraphScaleSwitch( this.graphScaleProperty, {
          tandem: options.tandem.createTandem( 'graphScaleSwitch' )
        } );

        // vertical line that connects bottom of graph to top of scale switch
        const lineToSwitchNode = new Line( 0, 0, 0, 200, {
          stroke: 'black'
        } );

        // rendering order
        graphNode.addChild( lineToSwitchNode );
        lineToSwitchNode.moveToBack();
        graphNode.addChild( this.linearGraphNode );
        graphNode.addChild( graphScaleSwitch );

        // layout
        const ySpacing = 15;
        this.linearGraphNode.centerX = logarithmicGraphNode.centerX;
        this.linearGraphNode.y = logarithmicGraphNode.y; // y, not top
        graphScaleSwitch.centerX = lineToSwitchNode.centerX;
        graphScaleSwitch.top = this.linearGraphNode.bottom + ySpacing;
        lineToSwitchNode.centerX = lineToBarNode.centerX;
        lineToSwitchNode.bottom = graphScaleSwitch.top + 1;

        // handle scale changes
        this.graphScaleProperty.link( graphScale => {
          logarithmicGraphNode.visible = ( graphScale === GraphScale.LOGARITHMIC );
          this.linearGraphNode.visible = ( graphScale === GraphScale.LINEAR );
        } );
      }

      this.mutate( options );
    }

    /**
     * @public
     */
    reset() {
      this.graphUnitsProperty.reset();
      this.graphScaleProperty.reset();
      this.linearGraphNode && this.linearGraphNode.reset();
    }
  }

  return phScale.register( 'GraphNode', GraphNode );
} );
