// Copyright 2020-2021, University of Colorado Boulder

/**
 * GraphControlPanel is the control panel that appears above the graph.  It contains controls to collapse the graph,
 * and change units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import { Node } from '../../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../../scenery/js/imports.js';
import ExpandCollapseButton from '../../../../../sun/js/ExpandCollapseButton.js';
import Panel from '../../../../../sun/js/Panel.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';
import PHScaleColors from '../../PHScaleColors.js';
import PHScaleConstants from '../../PHScaleConstants.js';
import GraphUnitsSwitch from './GraphUnitsSwitch.js';

class GraphControlPanel extends Panel {

  /**
   * @param {EnumerationDeprecatedProperty.<GraphUnits>} graphUnitsProperty
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
      minWidth: 330,
      minHeight: 50,
      align: 'right',

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'control panel that appears above the graph'
    }, options );

    // Invisible rectangle, for layout of switch and button.
    const rectangle = new Rectangle( 0, 0, options.minWidth, options.minHeight );

    const graphUnitsSwitch = new GraphUnitsSwitch( graphUnitsProperty, {
      center: rectangle.center,
      tandem: options.tandem.createTandem( 'graphUnitsSwitch' )
    } );

    const expandCollapseButton = new ExpandCollapseButton( expandedProperty,
      merge( {}, PHScaleConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS, {
        right: rectangle.right,
        top: rectangle.top,
        tandem: options.tandem.createTandem( 'expandCollapseButton' )
      } ) );

    const content = new Node( {
      children: [ rectangle, graphUnitsSwitch, expandCollapseButton ]
    } );

    super( content, options );
  }
}

phScale.register( 'GraphControlPanel', GraphControlPanel );
export default GraphControlPanel;