// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Util = require( 'DOT/Util' );

  return {
    //TODO run this by other developers, is there a better way?
    //TODO consider http://blog.coolmuse.com/2012/06/21/getting-the-exponent-and-mantissa-from-a-javascript-number/
    //TODO consider using toExponential instead of toPrecision:
    //TODO http://stackoverflow.com/questions/11124451/how-can-i-convert-numbers-into-scientific-notation
    //TODO https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toExponential
    /*
     * Converts a number to a format like 1.23 x 10^25
     * @param {Number} value the number to be formatted
     * @param {Number} decimalPlaces how many digits after the decimal point
     * @param {Number} constantExponent optional constant exponent, may affect precision of mantissa, optional
     * @return {String} HTML fragment
     */
    toTimesTenString: function( value, decimalPlaces, constantExponent ) {
      if ( value === 0 ) {
        return '0';
      }
      else if ( constantExponent === 0 ) {
        return Util.toFixed( value, decimalPlaces );
      }
      else {
        var precisionString = value.toExponential( decimalPlaces ); // eg, 12345 -> 1.23e+4
        var tokens = precisionString.toLowerCase().split( 'e' ); //TODO will this work in all browsers?
        if ( tokens.length === 1 ) {
          return tokens[0]; // no exponent, return the mantissa
        }
        else {
          var mantissaString = tokens[0];
          var exponentString = tokens[1];
          if ( constantExponent !== undefined && constantExponent !== null ) {
            mantissaString = Util.toFixed( parseFloat( mantissaString ) * Math.pow( 10, parseInt( exponentString, 10 ) - constantExponent ), Math.max( 0, decimalPlaces - 1 ) );
            exponentString = constantExponent.toString();
          }
          return mantissaString + ' x 10<span style="font-size:85%"><sup>' + parseInt( exponentString, 10 ) + '</sup></span>'; // mantissa x 10^exponent
        }
      }
    }
  };
} );
