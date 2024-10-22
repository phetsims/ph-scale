// Copyright 2024, University of Colorado Boulder

/**
 * Maps the locale to a set of descriptions for this simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import combineConcreteTypesToPropertyType from './combineConcreteTypesToPropertyType.js';
import PHScaleDescriptionStringsEN from './PHScaleDescriptionStringsEN.js';
import PHScaleDescriptionStringsARKW from './PHScaleDescriptionStringsARKW.js';
import PHScaleDescriptionStringsES from './PHScaleDescriptionStringsES.js';

const PHScaleDescriptionStrings = combineConcreteTypesToPropertyType<typeof PHScaleDescriptionStringsEN>( new Map( [
  [ 'en', PHScaleDescriptionStringsEN ],
  [ 'es', PHScaleDescriptionStringsES ],
  [ 'ar-kw', PHScaleDescriptionStringsARKW ]
] ) );

export default PHScaleDescriptionStrings;