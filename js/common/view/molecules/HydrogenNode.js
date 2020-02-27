// Copyright 2013-2020, University of Colorado Boulder

/**
 * Hydrogen atom.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ShadedSphereNode from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import Color from '../../../../../scenery/js/util/Color.js';
import phScale from '../../../phScale.js';
import PHScaleColors from '../../PHScaleColors.js';

class HydrogenNode extends ShadedSphereNode {

  constructor() {
    super( 15, {
      mainColor: PHScaleColors.HYDROGEN,
      highlightColor: new Color( 255, 255, 255 )
    } );
  }
}

phScale.register( 'HydrogenNode', HydrogenNode );
export default HydrogenNode;