// Copyright 2013-2022, University of Colorado Boulder

/**
 * Hydrogen atom.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import { NodeTranslationOptions } from '../../../../../scenery/js/nodes/Node.js';
import Color from '../../../../../scenery/js/util/Color.js';
import phScale from '../../../phScale.js';
import PHScaleColors from '../../PHScaleColors.js';

type SelfOptions = EmptySelfOptions;

type HydrogenNodeOptions = SelfOptions & NodeTranslationOptions;

export default class HydrogenNode extends ShadedSphereNode {

  public constructor( providedOptions?: HydrogenNodeOptions ) {

    const options = optionize<HydrogenNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      mainColor: PHScaleColors.HYDROGEN,
      highlightColor: new Color( 255, 255, 255 )
    }, providedOptions );

    super( 15, options );
  }
}

phScale.register( 'HydrogenNode', HydrogenNode );