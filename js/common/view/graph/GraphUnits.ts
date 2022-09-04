// Copyright 2013-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Units used on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../../phet-core/js/EnumerationDeprecated.js';
import phScale from '../../../phScale.js';

const GraphUnits = EnumerationDeprecated.byKeys( [ 'MOLES_PER_LITER', 'MOLES' ] );

phScale.register( 'GraphUnits', GraphUnits );
export default GraphUnits;