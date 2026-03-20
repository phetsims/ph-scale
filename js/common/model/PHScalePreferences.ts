// Copyright 2025-2026, University of Colorado Boulder

/**
 * PHScalePreferencesModel is the preferences model for the pH Scale sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import PHScaleQueryParameters from '../PHScaleQueryParameters.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

const PHScalePreferences = {
  autoFillEnabledProperty: new BooleanProperty( PHScaleQueryParameters.autofill, {
    tandem: Tandem.PREFERENCES.createTandem( 'autoFillEnabledProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'whether solute is automatically added to the beaker when the solute is changed'
  } )
};

export default PHScalePreferences;
