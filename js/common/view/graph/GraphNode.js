// Copyright 2013-2020, University of Colorado Boulder

//TODO #92 which subcomponents need to be instrumented?
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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'PH_SCALE/common/view/graph/GraphControlPanel' );
  const GraphScale = require( 'PH_SCALE/common/view/graph/GraphScale' );
  const GraphScaleSwitch = require( 'PH_SCALE/common/view/graph/GraphScaleSwitch' );
  const GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearGraphNode = require( 'PH_SCALE/common/view/graph/LinearGraphNode' );
  const LogarithmicGraphNode = require( 'PH_SCALE/common/view/graph/LogarithmicGraphNode' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const phScale = require( 'PH_SCALE/phScale' );
  const Tandem = require( 'TANDEM/Tandem' );

  class GraphNode extends Node {

    /**
     * @param {Solution} solution
     * @param {Object} [options]
     */
    constructor( solution, options ) {

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

      // @private
      this.expandedProperty = new BooleanProperty( true, {
        tandem: options.tandem.createTandem( 'expandedProperty' )
      } );

      // @private units
      this.graphUnitsProperty = new EnumerationProperty( GraphUnits, options.units, {
        tandem: options.tandem.createTandem( 'graphUnitsProperty' )
      } );

      // @private scale (log, linear) of the graph
      this.graphScaleProperty = new EnumerationProperty( GraphScale, options.graphScale, {
        tandem: options.tandem.createTandem( 'graphScaleProperty' )
      } );

      // control panel above the graph
      const graphControlPanel = new GraphControlPanel( this.graphUnitsProperty, this.expandedProperty, {
        tandem: options.tandem.createTandem( 'graphControlPanel' )
      } );
      this.addChild( graphControlPanel );

      // vertical line that connects bottom of graphControlPanel to top of graph
      const lineToPanel = new Line( 0, 0, 0, 75, { stroke: 'black' } );
      graphControlPanel.on( 'visibility', () => {
        lineToPanel.visible = graphControlPanel.visible;
      } );

      // logarithmic graph
      const logarithmicGraphNode = new LogarithmicGraphNode( solution, this.graphUnitsProperty, {
        scaleHeight: options.logScaleHeight,
        isInteractive: options.isInteractive,
        centerX: lineToPanel.centerX,
        y: 30, // y, not top
        tandem: options.tandem.createTandem( 'logarithmicGraphNode' )
      } );

      // parent for things whose visibility will be controlled by expandProperty
      const parentNode = new Node( {
        children: [ lineToPanel, logarithmicGraphNode ],
        centerX: graphControlPanel.centerX,
        y: graphControlPanel.bottom // y, not top
      } );
      this.addChild( parentNode );

      // controls the visibility of parentNode
      this.expandedProperty.link( expanded => {
        parentNode.visible = expanded;
      } );

      // @private {LinearGraphNode|null} optional linear graph
      this.linearGraphNode = null;
      if ( options.hasLinearFeature ) {

        // linear graph
        this.linearGraphNode = new LinearGraphNode( solution, this.graphUnitsProperty, {
          scaleHeight: options.linearScaleHeight,
          y: logarithmicGraphNode.y, // y, not top
          centerX: logarithmicGraphNode.centerX,
          tandem: options.tandem.createTandem( 'linearGraphNode' )
        } );

        // scale switch (Logarithmic vs Linear)
        const graphScaleSwitch = new GraphScaleSwitch( this.graphScaleProperty, {
          centerX: lineToPanel.centerX,
          top: this.linearGraphNode.bottom + 15,
          tandem: options.tandem.createTandem( 'graphScaleSwitch' )
        } );

        // vertical line that connects bottom of graph to top of scale switch
        const lineToSwitchNode = new Line( 0, 0, 0, 200, {
          stroke: 'black',
          centerX: lineToPanel.centerX,
          bottom: graphScaleSwitch.top + 1
        } );

        graphScaleSwitch.on( 'visibility', () => {
          lineToSwitchNode.visible = graphScaleSwitch.visible;
        } );

        // add everything to parentNode, since their visibility is controlled by expandedProperty
        parentNode.addChild( lineToSwitchNode );
        lineToSwitchNode.moveToBack();
        parentNode.addChild( this.linearGraphNode );
        parentNode.addChild( graphScaleSwitch );

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
      this.expandedProperty.reset();
      this.graphUnitsProperty.reset();
      this.graphScaleProperty.reset();
      this.linearGraphNode && this.linearGraphNode.reset();
    }
  }

  return phScale.register( 'GraphNode', GraphNode );
} );
