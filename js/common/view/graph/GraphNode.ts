// Copyright 2013-2025, University of Colorado Boulder

/**
 * Container for all components related to the graph feature.
 * It has an expand/collapse bar at the top and can switch between 'concentration' and 'quantity'.
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
import PHScaleConstants from '../../PHScaleConstants.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import ScientificNotationNode from '../../../../../scenery-phet/js/ScientificNotationNode.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';

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
    const logarithmicRangeMinPatternStringProperty = new PatternStringProperty( PhScaleStrings.a11y.graph.rangeListItem.baseToExponentPatternStringProperty, {
      exponent: PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.min
    } );
    const logarithmicRangeMaxPatternStringProperty = new PatternStringProperty( PhScaleStrings.a11y.graph.rangeListItem.baseToExponentPatternStringProperty, {
      exponent: PHScaleConstants.LOGARITHMIC_EXPONENT_RANGE.max
    } );

    const parentNode = new Node( {
      children: [ lineToPanel, logarithmicGraphNode ],
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
    let scaleTypeStringProperty: TReadOnlyProperty<string> = PhScaleStrings.a11y.graph.scaleListItem.logarithmicStringProperty;
    let scaleRangeMinStringProperty: TReadOnlyProperty<string> = logarithmicRangeMinPatternStringProperty;
    let scaleRangeMaxStringProperty: TReadOnlyProperty<string> = logarithmicRangeMaxPatternStringProperty;
    if ( options.hasLinearFeature ) {

      // scale (log, linear) of the graph
      graphScaleProperty = new EnumerationProperty( options.graphScale, {
        tandem: options.tandem.createTandem( 'graphScaleProperty' ),
        phetioFeatured: true
      } );
      scaleTypeStringProperty = new DerivedProperty( [ graphScaleProperty, PhScaleStrings.a11y.graph.scaleListItem.logarithmicStringProperty,
          PhScaleStrings.a11y.graph.scaleListItem.linearStringProperty ],
        ( graphScale, logarithmicString, linearString ) => graphScale === GraphScale.LOGARITHMIC ? logarithmicString : linearString );

      // linear graph
      linearGraphNode = new LinearGraphNode( derivedProperties, graphUnitsProperty, {
        scaleHeight: options.linearScaleHeight,
        y: logarithmicGraphNode.y, // y, not top
        centerX: logarithmicGraphNode.centerX,
        tandem: options.tandem.createTandem( 'linearGraphNode' )
      } );

      // Create the range string Properties, which depend on the graphScaleProperty and exponentProperty
      // The linear range is 0 and will always be zero even as we zoom in and out. So we will not use scientific notation for the min.
      const linearScaleRangeMinString = `${PHScaleConstants.LINEAR_MANTISSA_RANGE.min}`;
      const linearScaleRangeMaxStringProperty = new DerivedProperty( [ PhScaleStrings.a11y.scientificNotationPatternStringProperty, linearGraphNode.exponentProperty ],
        ( scientificNotationPattern, exponent ) => StringUtils.fillIn( scientificNotationPattern, {
          mantissa: PHScaleConstants.LINEAR_MANTISSA_RANGE.max,
          exponent: exponent
        } ) );

      // Redefine the scaleRange string Properties to use the logarithmic or linear range depending on the graphScaleProperty
      scaleRangeMinStringProperty = new DerivedProperty( [ graphScaleProperty, logarithmicRangeMinPatternStringProperty ],
        ( graphScale, logarithmicMinPatternString ) =>
          graphScale === GraphScale.LOGARITHMIC ? logarithmicMinPatternString : linearScaleRangeMinString );
      scaleRangeMaxStringProperty = new DerivedProperty( [ graphScaleProperty, logarithmicRangeMaxPatternStringProperty, linearScaleRangeMaxStringProperty ],
        ( graphScale, logarithmicMaxPatternString, linearMaxPatternString ) =>
          graphScale === GraphScale.LOGARITHMIC ? logarithmicMaxPatternString : linearMaxPatternString );

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

    // Description list for the graph
    const h3OConcentrationScientificNotationProperty = new DerivedProperty( [ derivedProperties.concentrationH3OProperty ],
      h3OConcentration => h3OConcentration !== null ? ScientificNotationNode.toScientificNotation( h3OConcentration ) :
        { mantissa: 'null', exponent: 'null' } );
    const h3OQuantityScientificNotationProperty = new DerivedProperty( [ derivedProperties.quantityH3OProperty ],
      h3OQuantity => h3OQuantity !== null ? ScientificNotationNode.toScientificNotation( h3OQuantity ) :
        { mantissa: 'null', exponent: 'null' } );
    const oHMinusConcentrationScientificNotationProperty = new DerivedProperty( [ derivedProperties.concentrationOHProperty ],
      oHMinusConcentration => oHMinusConcentration !== null ? ScientificNotationNode.toScientificNotation( oHMinusConcentration ) :
        { mantissa: 'null', exponent: 'null' } );
    const oHMinusQuantityScientificNotationProperty = new DerivedProperty( [ derivedProperties.quantityOHProperty ],
      oHMinusQuantity => oHMinusQuantity !== null ? ScientificNotationNode.toScientificNotation( oHMinusQuantity ) :
        { mantissa: 'null', exponent: 'null' } );
    const unitsStringProperty = new DerivedProperty( [ graphUnitsProperty, PhScaleStrings.a11y.graph.units.molesPerLiterStringProperty, PhScaleStrings.a11y.graph.units.molesStringProperty ],
      ( graphUnits, molesPerLiterString, molesString ) => graphUnits === GraphUnits.MOLES_PER_LITER ? molesPerLiterString : molesString );
    const beakerHasLiquidProperty = DerivedProperty.valueNotEqualsConstant( totalVolumeProperty, 0 );
    const graphDescriptionListNode = new AccessibleListNode( [
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.graph.scaleListItem.patternStringProperty, {
          type: scaleTypeStringProperty
        } )
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.graph.rangeListItem.patternStringProperty, {
          min: scaleRangeMinStringProperty,
          max: scaleRangeMaxStringProperty
        } )
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.graph.h3OListItemPatternStringProperty, {
          value: new PatternStringProperty( PhScaleStrings.a11y.scientificNotationPatternStringProperty, {
            mantissa: new DerivedProperty( [ h3OConcentrationScientificNotationProperty, h3OQuantityScientificNotationProperty, graphUnitsProperty ],
              ( concentrationH3O, quantityH3O, graphUnits ) => graphUnits === GraphUnits.MOLES_PER_LITER ?
                                                               concentrationH3O.mantissa : quantityH3O.mantissa ),
            exponent: new DerivedProperty( [ h3OConcentrationScientificNotationProperty, h3OQuantityScientificNotationProperty, graphUnitsProperty ],
              ( concentrationH3O, quantityH3O, graphUnits ) => graphUnits === GraphUnits.MOLES_PER_LITER ?
                                                               concentrationH3O.exponent : quantityH3O.exponent )
          } ),
          units: unitsStringProperty
        } ),
        visibleProperty: beakerHasLiquidProperty
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.graph.oHMinusListItemPatternStringProperty, {
          value: new PatternStringProperty( PhScaleStrings.a11y.scientificNotationPatternStringProperty, {
            mantissa: new DerivedProperty( [ oHMinusConcentrationScientificNotationProperty, oHMinusQuantityScientificNotationProperty, graphUnitsProperty ],
              ( concentrationOH, quantityOH, graphUnits ) => graphUnits === GraphUnits.MOLES_PER_LITER ?
                                                               concentrationOH.mantissa : quantityOH.mantissa ),
            exponent: new DerivedProperty( [ oHMinusConcentrationScientificNotationProperty, oHMinusQuantityScientificNotationProperty, graphUnitsProperty ],
              ( concentrationOH, quantityOH, graphUnits ) => graphUnits === GraphUnits.MOLES_PER_LITER ?
                                                               concentrationOH.exponent : quantityOH.exponent )
          } ),
          units: unitsStringProperty
        } ),
        visibleProperty: beakerHasLiquidProperty
      },
      {
        stringProperty: new PatternStringProperty( PhScaleStrings.a11y.graph.waterListItemPatternStringProperty, {
          value: new DerivedProperty( [ graphUnitsProperty, derivedProperties.concentrationH2OProperty,
              derivedProperties.quantityH2OProperty ],
            ( graphUnits, concentrationH2O, quantityH2O ) =>
              concentrationH2O === null || quantityH2O === null ? 'null' :
              graphUnits === GraphUnits.MOLES_PER_LITER ? toFixed( concentrationH2O, 0 ) : toFixed( quantityH2O, 0 ) ),
          units: unitsStringProperty
        } ),
        visibleProperty: beakerHasLiquidProperty
      }
    ] );
    parentNode.addChild( graphDescriptionListNode );
    pdomOrder.push( graphDescriptionListNode );
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