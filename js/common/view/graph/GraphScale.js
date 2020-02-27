// Copyright 2013-2020, University of Colorado Boulder

/**
 * Type of graph (log or linear).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../../phet-core/js/Enumeration.js';
import phScale from '../../../phScale.js';

const GraphScale = Enumeration.byKeys( [ 'LOGARITHMIC', 'LINEAR' ] );

phScale.register( 'GraphScale', GraphScale );
export default GraphScale;