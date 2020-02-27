// Copyright 2016-2020, University of Colorado Boulder

/**
 * View-specific Properties for the 'My Solution' and 'Micro' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import phScale from '../../phScale.js';

class PHScaleViewProperties {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public
    this.ratioVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'ratioVisibleProperty' ),
      phetioDocumentation: 'controls visibility of the H3O+/OH- Ratio view'
    } );

    // @public
    this.moleculeCountVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'moleculeCountVisibleProperty' ),
      phetioDocumentation: 'controls visibility of the Molecule Count view'
    } );
  }

  /**
   * @public
   */
  reset() {
    this.ratioVisibleProperty.reset();
    this.moleculeCountVisibleProperty.reset();
  }
}

phScale.register( 'PHScaleViewProperties', PHScaleViewProperties );
export default PHScaleViewProperties;