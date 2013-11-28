// Copyright 2002-2013, University of Colorado Boulder

/**
 * OH- (hydroxide) molecule.
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

  function OHMoleculeNode( options ) {

    Node.call( this );

    // atoms
    var oxygen = new OxygenAtomNode();
    var hydrogen = new HydrogenAtomNode();

    // rendering order
    this.addChild( oxygen );
    this.addChild( hydrogen );

    // layout
    hydrogen.left = oxygen.right - ( 0.2 * oxygen.width );
    hydrogen.centerY = oxygen.centerY - ( 0.1 * oxygen.height );

    this.mutate( options );
  }

  return inherit( Node, OHMoleculeNode );
} );
