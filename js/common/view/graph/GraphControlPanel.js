// Copyright 2020, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const GraphUnitsSwitch = require( 'PH_SCALE/common/view/graph/GraphUnitsSwitch' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const phScale = require( 'PH_SCALE/phScale' );
  const PHScaleColors = require( 'PH_SCALE/common/PHScaleColors' );
  const PHScaleConstants = require( 'PH_SCALE/common/PHScaleConstants' );
  const Tandem = require( 'TANDEM/Tandem' );

  class GraphControlPanel extends Panel {

    /**
     * @param {EnumerationProperty.<GraphUnits>} graphUnitsProperty
     * @param {Property.<boolean>} expandedProperty
     * @param {Object} [options]
     */
    constructor( graphUnitsProperty, expandedProperty, options ) {

      options = merge( {

        // Panel options
        fill: PHScaleColors.PANEL_FILL,
        lineWidth: 2,
        cornerRadius: 6,
        xMargin: 8,
        yMargin: 8,
        minWidth: 350,
        minHeight: 55,
        align: 'right',

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const graphUnitsSwitch = new GraphUnitsSwitch( graphUnitsProperty, {
        tandem: options.tandem.createTandem( 'graphUnitsSwitch' )
      } );

      const expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
        sideLength: PHScaleConstants.EXPAND_COLLAPSE_BUTTON_LENGTH,
        tandem: options.tandem.createTandem( 'expandCollapseButton' )
      } );
      expandCollapseButton.touchArea = expandCollapseButton.localBounds.dilatedXY( 10, 10 );

      const content = new HBox( {
        spacing: 24,
        children: [ graphUnitsSwitch, expandCollapseButton ]
      } );

      super( content, options );
    }
  }

  return phScale.register( 'GraphControlPanel', GraphControlPanel );
} );