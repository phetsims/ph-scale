// Copyright 2020, University of Colorado Boulder

/**
 * ZoomButtonGroup is the group of zoom button for the linear graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import ZoomButton from '../../../../../scenery-phet/js/buttons/ZoomButton.js';
import HBox from '../../../../../scenery/js/nodes/HBox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import phScale from '../../../phScale.js';

// constants
const MAGNIFYING_GLASS_RADIUS = 13;

class ZoomButtonGroup extends HBox {

  /**
   * @param {NumberProperty} exponentProperty - exponent for the linear graph
   * @param {Object} [options]
   */
  constructor( exponentProperty, options ) {
    assert && assert( exponentProperty.range, 'exponentProperty must have range' );

    options = merge( {
      spacing: 25,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const zoomOutButton = new ZoomButton( {
      in: false,
      radius: MAGNIFYING_GLASS_RADIUS,
      listener: () => exponentProperty.set( exponentProperty.get() + 1 ),
      enabledPropertyOptions: { phetioReadOnly: true },
      tandem: options.tandem.createTandem( 'zoomOutButton' ),
      phetioDocumentation: 'zoom out button for the linear scale',
      phetioComponentOptions: {
        visibleProperty: {
          phetioReadOnly: true
        }
      }
    } );

    const zoomInButton = new ZoomButton( {
      in: true,
      radius: MAGNIFYING_GLASS_RADIUS,
      listener: () => exponentProperty.set( exponentProperty.get() - 1 ),
      enabledPropertyOptions: { phetioReadOnly: true },
      tandem: options.tandem.createTandem( 'zoomInButton' ),
      phetioDocumentation: 'zoom in button for the linear scale',
      phetioComponentOptions: {
        visibleProperty: {
          phetioReadOnly: true
        }
      }
    } );

    // expand touch areas
    zoomOutButton.touchArea = zoomOutButton.localBounds.dilated( 5 );
    zoomInButton.touchArea = zoomOutButton.localBounds.dilated( 5 );

    assert && assert( !options.children, 'ZoomButtonGroup sets children' );
    options.children = [ zoomOutButton, zoomInButton ];

    super( options );

    // enable/disable buttons
    exponentProperty.link( exponent => {
      zoomInButton.enabled = ( exponent > exponentProperty.range.min );
      zoomOutButton.enabled = ( exponent < exponentProperty.range.max );
    } );
  }
}

phScale.register( 'ZoomButtonGroup', ZoomButtonGroup );
export default ZoomButtonGroup;