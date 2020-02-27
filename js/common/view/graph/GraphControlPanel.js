// Copyright 2020, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import ExpandCollapseButton from '../../../../../sun/js/ExpandCollapseButton.js';
import Panel from '../../../../../sun/js/Panel.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import PHScaleColors from '../../PHScaleColors.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphUnitsSwitch from './GraphUnitsSwitch.js';

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
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'control panel that appears above the graph'
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

phScale.register( 'GraphControlPanel', GraphControlPanel );
export default GraphControlPanel;