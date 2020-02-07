// Copyright 2014-2020, University of Colorado Boulder

//TODO #92 visibility of this should be controlled via GraphNode.graphScaleProperty
//TODO #92 instrument subcomponents?
/**
 * Graph with a linear scale, for displaying concentration (mol/L) and quantity (moles).
 * Some of the code related to indicators (initialization and updateIndicators) is similar
 * to LogarithmicGraph. But it was difficult to identify a natural pattern for factoring
 * this out, so I chose to leave it as is. See issue #16.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const GraphIndicatorNode = require( 'PH_SCALE/common/view/graph/GraphIndicatorNode' );
  const GraphUnits = require( 'PH_SCALE/common/view/graph/GraphUnits' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  const Shape = require( 'KITE/Shape' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const ZoomButtonGroup = require( 'PH_SCALE/common/view/graph/ZoomButtonGroup' );

  // strings
  const offScaleString = require( 'string!PH_SCALE/offScale' );

  // constants
  const MANTISSA_RANGE = PHScaleConstants.LINEAR_MANTISSA_RANGE;

  class LinearGraphNode extends Node {

    /**
     * @param {Solution} solution
     * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
     * @param {Object} [options]
     */
    constructor( solution, graphUnitsProperty, options ) {

      options = merge( {

        // scale
        scaleHeight: 100,
        minScaleWidth: 100,
        scaleFill: 'rgb( 230, 230, 230 )',
        scaleStroke: 'black',
        scaleLineWidth: 2,
        scaleYMargin: 30,

        // arrow at top of scale
        arrowHeight: 75,

        // major ticks
        majorTickFont: new PhetFont( 18 ),
        majorTickLength: 10,
        majorTickStroke: 'black',
        majorTickLineWidth: 1,
        majorTickXSpacing: 5,

        // phet-io
        tandem: Tandem.REQUIRED,
        phetioComponentOptions: {
          visibleProperty: {
            phetioReadOnly: true
          }
        }
      }, options );

      super();

      // @private
      this.exponentProperty = new NumberProperty( PHScaleConstants.LINEAR_EXPONENT_RANGE.max, {
        numberType: 'Integer',
        tandem: options.tandem.createTandem( 'exponentProperty' ),
        range: PHScaleConstants.LINEAR_EXPONENT_RANGE,
        phetioReadOnly: true,
        phetioDocumentation: 'exponent on the linear scale'
      } );

      const scaleWidth = options.minScaleWidth;
      const scaleHeight = options.scaleHeight;
      const arrowWidth = 1.5 * scaleWidth;
      const arrowHeight = options.arrowHeight;
      const arrowHeadHeight = 0.85 * arrowHeight;
      const arrowGap = -10; // this controls the vertical gap between the arrow and the scale

      // arrow above scale, starting from arrow tip and moving clockwise
      const arrowNode = new Path( new Shape()
          .moveTo( 0, 0 )
          .lineTo( arrowWidth / 2, arrowHeadHeight )
          .lineTo( scaleWidth / 2, arrowHeadHeight )
          .lineTo( scaleWidth / 2, arrowHeight )
          .cubicCurveTo( -scaleWidth / 4, 0.75 * arrowHeight, scaleWidth / 4, 1.25 * arrowHeight, -scaleWidth / 2, arrowHeight )
          .lineTo( -scaleWidth / 2, arrowHeadHeight )
          .lineTo( -arrowWidth / 2, arrowHeadHeight )
          .close(),
        { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth, top: arrowGap }
      );
      this.addChild( arrowNode );

      // scale below the arrow
      const scaleNode = new Path( new Shape()
          .moveTo( -scaleWidth / 2, arrowHeight )
          .cubicCurveTo( scaleWidth / 4, 1.25 * arrowHeight, -scaleWidth / 4, 0.75 * arrowHeight, scaleWidth / 2, arrowHeight )
          .lineTo( scaleWidth / 2, scaleHeight )
          .lineTo( -scaleWidth / 2, scaleHeight )
          .close(),
        { fill: options.scaleFill, stroke: options.scaleStroke, lineWidth: options.scaleLineWidth }
      );
      this.addChild( scaleNode );

      // 'off scale' label, positioned inside arrow
      const offScaleNode = new Text( offScaleString, {
        font: new PhetFont( 18 ),
        fill: 'black',
        maxWidth: 0.5 * arrowWidth
      } );
      this.addChild( offScaleNode );
      offScaleNode.centerX = arrowNode.centerX;
      offScaleNode.y = arrowNode.top + ( 0.85 * arrowHeadHeight );

      // Create the tick marks. Correct labels will be assigned later.
      const tickLabels = [];
      const numberOfTicks = MANTISSA_RANGE.getLength() + 1;
      const ySpacing = ( scaleHeight - arrowHeight - ( 2 * options.scaleYMargin ) ) / ( numberOfTicks - 1 ); // vertical space between ticks
      let tickLabel;
      let tickLineLeft;
      let tickLineRight;
      for ( let i = 0; i < numberOfTicks; i++ ) {

        // major lines and label
        tickLineLeft = new Line( 0, 0, options.majorTickLength, 0, {
          stroke: options.majorTickStroke,
          lineWidth: options.majorTickLineWidth
        } );
        tickLineRight = new Line( 0, 0, options.majorTickLength, 0, {
          stroke: options.majorTickStroke,
          lineWidth: options.majorTickLineWidth
        } );
        tickLabel = new ScientificNotationNode( new NumberProperty( i ), {
          font: options.majorTickFont,
          fill: 'black',
          mantissaDecimalPlaces: 0,
          showIntegersAsMantissaOnly: true
        } );

        // rendering order
        this.addChild( tickLineLeft );
        this.addChild( tickLineRight );
        this.addChild( tickLabel );

        // layout
        tickLineLeft.left = scaleNode.left;
        tickLineLeft.centerY = scaleNode.bottom - options.scaleYMargin - ( i * ySpacing );
        tickLineRight.right = scaleNode.right;
        tickLineRight.centerY = tickLineLeft.centerY;
        tickLabel.centerX = scaleNode.centerX;
        tickLabel.centerY = tickLineLeft.centerY;

        // save label so we can update it layer
        tickLabels.push( tickLabel );
      }

      // indicators & associated properties
      const valueH2OProperty = new NumberProperty( 0 );
      const valueH3OProperty = new NumberProperty( 0 );
      const valueOHProperty = new NumberProperty( 0 );
      const indicatorH2ONode = GraphIndicatorNode.createH2OIndicator( valueH2OProperty, {
        x: scaleNode.right - options.majorTickLength,
        tandem: options.tandem.createTandem( 'indicatorH2ONode' )
      } );
      const indicatorH3ONode = GraphIndicatorNode.createH3OIndicator( valueH3OProperty, {
        x: scaleNode.left + options.majorTickLength,
        isInteractive: options.isInteractive,
        tandem: options.tandem.createTandem( 'indicatorH3ONode' )
      } );
      const indicatorOHNode = GraphIndicatorNode.createOHIndicator( valueOHProperty, {
        x: scaleNode.right - options.majorTickLength,
        isInteractive: options.isInteractive,
        tandem: options.tandem.createTandem( 'indicatorOHNode' )
      } );
      this.addChild( indicatorH2ONode );
      this.addChild( indicatorH3ONode );
      this.addChild( indicatorOHNode );

      /*
       * Given a value, compute it's y position relative to the top of the scale.
       * @param {number} value in model coordinates
       * @param {number} offScaleYOffset optional y-offset added to the position if the value is off the scale
       * @returns {number} y position in view coordinates
       */
      const valueToY = ( value, offScaleYOffset ) => {
        const topTickValue = MANTISSA_RANGE.max * Math.pow( 10, this.exponentProperty.get() );
        if ( value > topTickValue ) {
          // values out of range are placed in the arrow
          return arrowNode.top + ( 0.8 * arrowHeadHeight ) + ( offScaleYOffset || 0 );
        }
        else {
          return Utils.linear( 0, topTickValue, tickLabels[ 0 ].centerY, tickLabels[ tickLabels.length - 1 ].centerY, value );
        }
      };

      // Update the indicators
      const updateIndicators = () => {

        let valueH2O;
        let valueH3O;
        let valueOH;
        if ( graphUnitsProperty.get() === GraphUnits.MOLES_PER_LITER ) {
          // concentration
          valueH2O = solution.getConcentrationH2O();
          valueH3O = solution.getConcentrationH3O();
          valueOH = solution.getConcentrationOH();
        }
        else {
          // quantity
          valueH2O = solution.getMolesH2O();
          valueH3O = solution.getMolesH3O();
          valueOH = solution.getMolesOH();
        }

        // move indicators
        indicatorH2ONode.y = valueToY( valueH2O, -4 ); // offset the H2O indicator when off scale, so it doesn't butt up again OH indicator
        indicatorH3ONode.y = valueToY( valueH3O );
        indicatorOHNode.y = valueToY( valueOH );

        // update indicator values
        valueH2OProperty.set( valueH2O );
        valueH3OProperty.set( valueH3O );
        valueOHProperty.set( valueOH );
      };

      // Move the indicators when any of these change.
      solution.pHProperty.link( updateIndicators.bind( this ) );
      solution.volumeProperty.link( updateIndicators.bind( this ) );
      graphUnitsProperty.link( updateIndicators.bind( this ) );
      this.exponentProperty.link( updateIndicators.bind( this ) );

      // updates the tick labels to match the exponent
      const updateTickLabels = exponent => {
        const tickOptions = ( exponent >= 0 ) ? { exponent: 0 } : { exponent: exponent }; // show positive exponents as integers
        for ( let i = 0; i < tickLabels.length; i++ ) {
          tickLabels[ i ].valueProperty.set( i * Math.pow( 10, exponent ), tickOptions );
          tickLabels[ i ].centerX = scaleNode.centerX;
        }
      };

      // When the exponent changes, relabel the tick marks
      this.exponentProperty.link( exponent => updateTickLabels( exponent ) );

      // zoom buttons
      const zoomButtonGroup = new ZoomButtonGroup( this.exponentProperty, {
        centerX: scaleNode.centerX,
        top: scaleNode.bottom + 44,
        tandem: options.tandem.createTandem( 'zoomButtonGroup' )
      } );
      this.addChild( zoomButtonGroup );

      this.mutate( options );
    }

    /**
     * @public
     */
    reset() {
      this.exponentProperty.reset();
    }
  }

  return phScale.register( 'LinearGraphNode', LinearGraphNode );
} );
