// Copyright 2002-2013, University of Colorado Boulder

/**
 * Faucet that dispenses water (the solvent).
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
   * @param {Water} water
   * @param {Faucet} faucet
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function WaterFaucetNode( water, faucet, mvt ) {

    PHFaucetNode.call( this, faucet, mvt );

    // decorate the faucet with the name of the water
    var labelNode = new Text( water.name, { font: new PhetFont( 40 ) } );
    this.addChild( labelNode );
    labelNode.right = -130;
    labelNode.bottom = -170;
  }

  return inherit( PHFaucetNode, WaterFaucetNode );
} );
