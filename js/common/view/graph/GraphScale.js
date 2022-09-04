// Copyright 2013-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * Type of graph (log or linear).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../../phet-core/js/EnumerationDeprecated.js';
import phScale from '../../../phScale.js';

const GraphScale = EnumerationDeprecated.byKeys( [ 'LOGARITHMIC', 'LINEAR' ] );

phScale.register( 'GraphScale', GraphScale );
export default GraphScale;