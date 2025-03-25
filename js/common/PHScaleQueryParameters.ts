// Copyright 2016-2024, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import phScale from '../phScale.js';

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
  },

  //TODO https://github.com/phetsims/ph-scale/issues/292
  // Enables grab-drag interaction for the pH Probe in the Macro screen. For exploring the accessibility 1-step and
  // 2-step drag patterns in interviews. One of those patterns should eventually be selected, the other deleted,
  // and this query parameter should be deleted.
  grabDragProbe: {
    type: 'flag'
  }
} );

phScale.register( 'PHScaleQueryParameters', PHScaleQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.phScale.PHScaleQueryParameters' );

export default PHScaleQueryParameters;