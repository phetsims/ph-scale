// Copyright 2002-2013, University of Colorado Boulder

/**
 * H2O (water) molecule.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var HydrogenAtomNode = require( 'PH_SCALE/common/view/HydrogenAtomNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OxygenAtomNode = require( 'PH_SCALE/common/view/OxygenAtomNode' );
  var Node = require( 'SCENERY/nodes/Node' );

  function H2OMoleculeNode( options ) {

    Node.call( this );

    // atoms
    var oxygen = new OxygenAtomNode();
    var hydrogen1 = new HydrogenAtomNode();
    var hydrogen2 = new HydrogenAtomNode();

    // rendering order
    this.addChild( hydrogen2 );
    this.addChild( oxygen );
    this.addChild( hydrogen1 );

    // layout
    hydrogen1.left = oxygen.right - ( 0.2 * oxygen.width );
    hydrogen1.centerY = oxygen.centerY - ( 0.1 * oxygen.height );
    hydrogen2.centerX = oxygen.centerX + ( 0.1 * oxygen.width );
    hydrogen2.centerY = oxygen.bottom;

    this.mutate( options );
  }

  return inherit( Node, H2OMoleculeNode );
} );
