// Copyright 2016-2026, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const PHScaleQueryParameters = QueryStringMachine.getAll( {

  // Whether to automatically fill the beaker each time the solute changes.
  autofill: {
    type: 'boolean',
    defaultValue: true,
    public: true
  },

  // Shows the ratio (red/blue particle counts) in the bottom of the beaker for the 'ratio' view.
  // For internal use only.
  showRatio: {
    type: 'flag'
  }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `PHScaleQueryParameters: ${JSON.stringify( PHScaleQueryParameters, null, 2 )}` );

export default PHScaleQueryParameters;
