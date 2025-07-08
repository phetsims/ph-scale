# pH Scale Development Guidelines

## Learned Conventions and Tricky Workflows

*   **Adding Custom Simulation Preferences:**
    *   To add custom preferences to a simulation, create a `PreferencesModel` instance.
    *   Pass this `PreferencesModel` instance to the `Sim` constructor via the `preferencesModel` option.
    *   Inside the `PreferencesModel` constructor, use the `simulationOptions.customPreferences` array to define custom preference nodes. Each entry in this array should be an object with a `createContent` function that returns a Scenery `Node` representing the preference UI.
    *   Example:
        ```typescript
        import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
        import Sim from '../../joist/js/Sim.js';
        import Tandem from '../../tandem/js/Tandem.js';

        // ... other imports and code ...

        const preferencesModel = new PreferencesModel( {
          simulationOptions: {
            customPreferences: [ {
              createContent: ( tandem: Tandem ) => new MyCustomPreferencesNode( tandem.createTandem( 'myCustomPreferences' ) )
            } ]
          }
        } );

        const sim = new Sim( titleStringProperty, screens, {
          preferencesModel: preferencesModel
        } );
        ```