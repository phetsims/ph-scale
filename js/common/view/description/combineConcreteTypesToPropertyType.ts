// Copyright 2024, University of Colorado Boulder

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import LocalizedString from '../../../../../chipper/js/LocalizedString.js';
import localeProperty, { Locale } from '../../../../../joist/js/i18n/localeProperty.js';

// Just for now to get types working well.
type FakeLocale = string;

// A type for the collection of functions that will return the actual string values.
type GeneralConcreteType = Record<string, ( ...args: any[] ) => string>;

// Creates a new type that makes all entries of the provided type a TReadOnlyProperty.
type WrapWithTReadOnlyProperties<T extends any[]> = { [K in keyof T]: TReadOnlyProperty<T[K]> };

export type GeneralPropertyType<ConcreteType extends GeneralConcreteType> = {
  [key in keyof ConcreteType]: ( ...args: WrapWithTReadOnlyProperties<Parameters<ConcreteType[ key ]>> ) => TReadOnlyProperty<string>
};

const combineConcreteTypesToPropertyType = <ConcreteType extends GeneralConcreteType>( map: Map<FakeLocale, Partial<ConcreteType>> ): GeneralPropertyType<ConcreteType> => {

  const result = {} as GeneralPropertyType<ConcreteType>;

  const englishValues = map.get( 'en' );

  for ( const key in englishValues ) {
    result[ key ] = ( ...propertyArgs: TReadOnlyProperty<any>[] ) => {

      // @ts-expect-error
      return new DerivedProperty( [ localeProperty, ...propertyArgs ], ( locale: FakeLocale, ...valueArgs ) => {

        // Returns an array of locales that a provided locale code can fall back to.
        const fallbackLocales = LocalizedString.getLocaleFallbacks( locale as Locale );

        // Iterate through fallbacks - if the provided map has that locale, retreive the function from the map and call it.
        for ( const fallbackLocale of fallbackLocales ) {
          if ( map.has( fallbackLocale ) ) {
            const func = map.get( fallbackLocale )![ key ];

            if ( func ) {
              return func( ...valueArgs );
            }
            else {
              return undefined;
            }
          }
        }
        return undefined;
      } );
    };
  }

  return result;
};

export default combineConcreteTypesToPropertyType;