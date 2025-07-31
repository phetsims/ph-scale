// Copyright 2013-2025, University of Colorado Boulder

/**
 * Container for all components related to the graph feature.
 * It has an expand/collapse bar at the top of it, and can switch between 'concentration' and 'quantity'.
 * Logarithmic graph is the standard scale. Interactivity and a linear scale are optional.
 * Origin is at top-left of the expand/collapse bar.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import phScale from '../../../phScale.js';
import SolutionDerivedProperties from '../../model/SolutionDerivedProperties.js';
import GraphControlPanel from './GraphControlPanel.js';
import GraphScale from './GraphScale.js';
import GraphScaleSwitch from './GraphScaleSwitch.js';
import GraphUnits from './GraphUnits.js';
import LinearGraphNode from './LinearGraphNode.js';
import LogarithmicGraphNode, { LogarithmicGraphNodeOptions } from './LogarithmicGraphNode.js';
import PhScaleStrings from '../../../PhScaleStrings.js';
import AccessibleListNode from '../../../../../scenery-phet/js/accessibility/AccessibleListNode.js';
import PatternStringProperty from '../../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  logScaleHeight?: number;
  linearScaleHeight?: number;
  units?: GraphUnits; // initial state of the units switch
  hasLinearFeature?: boolean; // add the linear graph feature?
  graphScale?: GraphScale; // initial state of the scale switch, meaningful only if hasLinearFeature === true
} & PickRequired<LogarithmicGraphNodeOptions, 'pHProperty'>;

type GraphNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class GraphNode extends Node {

  private readonly resetGraphNode: () => void;

  // For pdom order, these nodes should be part of the control area.
  public readonly controlNodes: Node[] = [];

  public constructor( totalVolumeProperty: TReadOnlyProperty<number>,
                      derivedProperties: SolutionDerivedProperties,
                      providedOptions: GraphNodeOptions ) {

    const options = optionize<GraphNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      logScaleHeight: 500,
      linearScaleHeight: 500,
      units: GraphUnits.MOLES_PER_LITER,
      hasLinearFeature: false,
      graphScale: GraphScale.LOGARITHMIC,

      // NodeOptions
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      accessibleHeading: PhScaleStrings.a11y.graph.accessibleHeadingStringProperty
    }, providedOptions );

    super();

    const pdomOrder = [];

    // whether the graph is expanded or collapsed
    const expandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'expandedProperty' ),
      phetioFeatured: true
    } );

    // units used for the graph
    const graphUnitsProperty = new EnumerationProperty( options.units, {
      tandem: options.tandem.createTandem( 'graphUnitsProperty' ),
      phetioFeatured: true
    } );

    // control panel above the graph
    const graphControlPanel = new GraphControlPanel( graphUnitsProperty, expandedProperty, {
      tandem: options.tandem.createTandem( 'graphControlPanel' )
    } );
    this.addChild( graphControlPanel );
    pdomOrder.push( graphControlPanel );

    // vertical line that connects bottom of graphControlPanel to top of graph
    const lineToPanel = new Line( 0, 0, 0, 75, { stroke: 'black' } );
    graphControlPanel.visibleProperty.lazyLink( () => {
      lineToPanel.visible = graphControlPanel.visible;
    } );

    // logarithmic graph
    const logarithmicGraphNode = new LogarithmicGraphNode( totalVolumeProperty, derivedProperties, graphUnitsProperty, {
      pHProperty: options.pHProperty,
      scaleHeight: options.logScaleHeight,
      centerX: lineToPanel.centerX,
      y: 30, // y, not top
      tandem: options.tandem.createTandem( 'logarithmicGraphNode' )
    } );

    // parent for things whose visibility will be controlled by expandProperty
    const parentNode = new Node( {
      children: [ lineToPanel, logarithmicGraphNode, new AccessibleListNode( [
        {
          stringProperty: new PatternStringProperty( PhScaleStrings.a11y.graph.waterListItemPatternStringProperty, {
            value: new DerivedProperty( [ graphUnitsProperty, derivedProperties.concentrationH2OProperty,
                derivedProperties.quantityH2OProperty, PhScaleStrings.a11y.unknownStringProperty ],
              ( graphUnits, concentrationH2O, quantityH2O, unknownString ) =>
                concentrationH2O === null || quantityH2O === null ? unknownString :
                graphUnits === GraphUnits.MOLES_PER_LITER ? concentrationH2O : quantityH2O ),
            units: new DerivedProperty( [ graphUnitsProperty, PhScaleStrings.a11y.graph.units.molesPerLiterStringProperty, PhScaleStrings.a11y.graph.units.molesStringProperty ],
              ( graphUnits, molesPerLiterString, molesString ) => graphUnits === GraphUnits.MOLES_PER_LITER ? molesPerLiterString : molesString )
          } )
        }
      ] ) ],
      centerX: graphControlPanel.centerX,
      y: graphControlPanel.bottom // y, not top
    } );
    this.addChild( parentNode );

    // controls the visibility of parentNode
    expandedProperty.link( expanded => {
      parentNode.visible = expanded;
    } );

    // optional linear graph
    let linearGraphNode: LinearGraphNode;
    let graphScaleProperty: EnumerationProperty<GraphScale>;
    if ( options.hasLinearFeature ) {

      // scale (log, linear) of the graph
      graphScaleProperty = new EnumerationProperty( options.graphScale, {
        tandem: options.tandem.createTandem( 'graphScaleProperty' ),
        phetioFeatured: true
      } );

      // linear graph
      linearGraphNode = new LinearGraphNode( derivedProperties, graphUnitsProperty, {
        scaleHeight: options.linearScaleHeight,
        y: logarithmicGraphNode.y, // y, not top
        centerX: logarithmicGraphNode.centerX,
        tandem: options.tandem.createTandem( 'linearGraphNode' )
      } );

      // scale switch (Logarithmic vs Linear)
      const graphScaleSwitch = new GraphScaleSwitch( graphScaleProperty, {
        tandem: options.tandem.createTandem( 'graphScaleSwitch' )
      } );
      graphScaleSwitch.boundsProperty.link( bounds => {
        graphScaleSwitch.centerX = lineToPanel.centerX;
        graphScaleSwitch.top = linearGraphNode.bottom + 15;
      } );
      pdomOrder.push( linearGraphNode );

      // vertical line that connects bottom of graph to top of scale switch
      const lineToSwitchNode = new Line( 0, 0, 0, 200, {
        stroke: 'black',
        centerX: lineToPanel.centerX,
        bottom: graphScaleSwitch.top + 1
      } );

      graphScaleSwitch.visibleProperty.lazyLink( () => {
        lineToSwitchNode.visible = graphScaleSwitch.visible;
      } );

      // add everything to parentNode, since their visibility is controlled by expandedProperty
      parentNode.addChild( lineToSwitchNode );
      lineToSwitchNode.moveToBack();
      parentNode.addChild( linearGraphNode );
      parentNode.addChild( graphScaleSwitch );

      // handle scale changes
      graphScaleProperty.link( graphScale => {
        logarithmicGraphNode.visible = ( graphScale === GraphScale.LOGARITHMIC );
        linearGraphNode.visible = ( graphScale === GraphScale.LINEAR );
      } );

      this.controlNodes.push( graphScaleSwitch, linearGraphNode.zoomButtonGroup );
    }
    pdomOrder.push( logarithmicGraphNode );

    this.mutate( options );

    this.resetGraphNode = () => {
      expandedProperty.reset();
      graphUnitsProperty.reset();
      graphScaleProperty && graphScaleProperty.reset();
      linearGraphNode && linearGraphNode.reset();
    };

    // Link to concentration Properties, see https://github.com/phetsims/ph-scale/issues/125
    this.addLinkedElement( derivedProperties.concentrationH2OProperty, {
      tandemName: 'concentrationH2OProperty'
    } );
    this.addLinkedElement( derivedProperties.concentrationH3OProperty, {
      tandemName: 'concentrationH3OProperty'
    } );
    this.addLinkedElement( derivedProperties.concentrationOHProperty, {
      tandemName: 'concentrationOHProperty'
    } );

    // Link to quantity Properties, see https://github.com/phetsims/ph-scale/issues/125
    this.addLinkedElement( derivedProperties.quantityH2OProperty, {
      tandemName: 'quantityH2OProperty'
    } );
    this.addLinkedElement( derivedProperties.quantityH3OProperty, {
      tandemName: 'quantityH3OProperty'
    } );
    this.addLinkedElement( derivedProperties.quantityOHProperty, {
      tandemName: 'quantityOHProperty'
    } );

    // keyboard traversal order, see https://github.com/phetsims/ph-scale/issues/249
    this.pdomOrder = pdomOrder;
  }

  public reset(): void {
    this.resetGraphNode();
  }
}

phScale.register( 'GraphNode', GraphNode );