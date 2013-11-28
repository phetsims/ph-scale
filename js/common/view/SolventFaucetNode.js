// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that dispenses the solvent (water).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PHFaucetNode = require( 'PH_SCALE/common/view/PHFaucetNode' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Solvent} solvent
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function SolventFaucetNode( solvent, faucet, mvt ) {

    PHFaucetNode.call( this, faucet, mvt );

    // decorate the faucet with the name of the solvent
    var solventLabelNode = new Text( solvent.name, { font: new PhetFont( 40 ) } );
    this.addChild( solventLabelNode );
    solventLabelNode.right = -130;
    solventLabelNode.bottom = -170;
  }

  return inherit( PHFaucetNode, SolventFaucetNode );
} );
