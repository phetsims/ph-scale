// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Util = require( 'DOT/Util' );

  /*
   * Converts a number to scientific-notation format, like 1.23 x 10^25.
   * @param {Number} value the number to be formatted
   * @param {Number} decimalPlaces how many digits after the decimal point
   * @param {*} options
   * @return {String} HTML fragment
   */
  var toScientificNotation = function( value, decimalPlaces, options ) {

    options = _.extend( {
      // if provided, use this exponent, otherwise determine the exponent dynamically with 1 digit to the left of the mantissa's decimal place
      exponent: null,
      // size of the exponent superscript, relative to the '10', expressed as a percentage (100 is 'same size'), will be rounded to an integer
      superscriptScale: 85,
      // if true, zero will be '0' and not converted to times-ten format
      zeroIsInteger: true
    }, options );

    if ( value === 0 && options.zeroIsInteger ) {
      return '0';
    }
    else {
      // Convert to a string in exponential notation (eg 2e+2).
      // Request an additional decimal place, because toExponential uses toFixed, which doesn't round the same on all platforms.
      var exponentialString = value.toExponential( decimalPlaces + 1 );

      // Break into mantissa and exponent tokens.
      var tokens = exponentialString.toLowerCase().split( 'e' );

      // Adjust the mantissa token to the correct number of decimal places, using nearest-neighbor rounding.
      var mantissaString = Util.toFixed( parseFloat( tokens[0] ), decimalPlaces );
      var exponentString = tokens[1];

      // Convert if a specific exponent was requested.
      if ( options.exponent !== null ) {
        mantissaString = Util.toFixed( parseFloat( mantissaString ) * Math.pow( 10, parseInt( exponentString, 10 ) - options.exponent ), Math.max( 0, decimalPlaces ) );
        exponentString = options.exponent.toString();
      }

      // mantissa x 10^exponent
      return mantissaString + ' x 10<span style="font-size:' + Util.toFixed( options.superscriptScale, 0 ) + '%"><sup>' + parseInt( exponentString, 10 ) + '</sup></span>';
    }
  };

  return toScientificNotation;
} );
