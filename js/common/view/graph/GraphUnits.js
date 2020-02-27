// Copyright 2013-2020, University of Colorado Boulder

/**
 * Units used on the graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../../phet-core/js/Enumeration.js';
import phScale from '../../../phScale.js';

const GraphUnits = Enumeration.byKeys( [ 'MOLES_PER_LITER', 'MOLES' ] );

phScale.register( 'GraphUnits', GraphUnits );
export default GraphUnits;