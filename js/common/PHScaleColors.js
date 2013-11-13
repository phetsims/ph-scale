// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Color = require( 'SCENERY/util/Color' );

  return {

    SCREEN_BACKGROUND: new Color( 245, 245, 245 ),

    // H3O, OH, H2O colors (used for pH slider track & bars)
    H3O: new Color( 242, 102, 101 ),
    OH: new Color( 102, 132, 242 ),
    H2O: new Color( 193, 222, 227 ),

    // H3O and OH particle colors
    H3O_PARTICLES: new Color( 204, 0, 0 ),
    OH_PARTICLES: new Color( 0, 0, 255 )
  };
} );
