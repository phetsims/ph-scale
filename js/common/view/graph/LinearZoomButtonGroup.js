// Copyright 2020, University of Colorado Boulder

// @ts-nocheck
/**
 * LinearZoomButtonGroup is the group of zoom button for the 'Linear' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import merge from '../../../../../phet-core/js/merge.js';
import MagnifyingGlassZoomButtonGroup from '../../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';

class LinearZoomButtonGroup extends MagnifyingGlassZoomButtonGroup {

  /**
   * @param {NumberProperty} exponentProperty - exponent for the linear graph
   * @param {Object} [options]
   */
  constructor( exponentProperty, options ) {

    assert && assert( exponentProperty instanceof NumberProperty, 'invalid exponentProperty' );
    assert && assert( exponentProperty.range, 'exponentProperty must have range' );

    options = merge( {
      layout: 'horizontal',
      spacing: 25,
      magnifyingGlassNodeOptions: {
        glassRadius: 13
      },

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // For exponent, a smaller value means 'more zoomed in'.
    // For MagnifyingGlassZoomButtonGroup and zoomLevelProperty, a smaller value means 'more zoomed out'.
    // So this is a two-way conversion between exponent and zoom level, accomplished by inverting the sign.
    // We can't use DynamicProperty here because MagnifyingGlassZoomButtonGroup require a NumberProperty.
    const zoomLevelProperty = new NumberProperty( -exponentProperty.value, {
      numberType: 'Integer',
      range: new Range( -exponentProperty.range.max, -exponentProperty.range.min )
    } );
    zoomLevelProperty.link( zoomLevel => { exponentProperty.value = -zoomLevel; } );
    exponentProperty.link( exponent => { zoomLevelProperty.value = -exponent; } );

    super( zoomLevelProperty, options );
  }
}

phScale.register( 'LinearZoomButtonGroup', LinearZoomButtonGroup );
export default LinearZoomButtonGroup;