// Copyright 2025, University of Colorado Boulder

/**
 * PHScalePreferencesNode provides user controls for sim-specific preferences.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Text from '../../../../scenery/js/nodes/Text.js';
import PhScaleStrings from '../../PhScaleStrings.js';
import phScale from '../../phScale.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PHScalePreferences from '../model/PHScalePreferences.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';

class PHScalePreferencesNode extends PreferencesPanelContentNode {
  public constructor( tandem: Tandem ) {

    // Create the preference for whether the autofill feature is enabled, see https://github.com/phetsims/ph-scale/issues/104
    const autoFillLabel = new Text( PhScaleStrings.autoFillStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS );
    const autoFillDescription = new Text( PhScaleStrings.autoFillDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS );
    const autoFillSwitch = new ToggleSwitch( PHScalePreferences.autoFillEnabledProperty, false, true,
      PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS );
    const autoFillControl = new PreferencesControl( {
      labelNode: autoFillLabel,
      descriptionNode: autoFillDescription,
      controlNode: autoFillSwitch,
      tandem: tandem.createTandem( 'autoFillControl' )
    } );
    autoFillControl.addLinkedElement( PHScalePreferences.autoFillEnabledProperty );

    super( {
      content: [ autoFillControl ],
      fill: 'white',
      tandem: tandem
    } );
  }
}

phScale.register( 'PHScalePreferencesNode', PHScalePreferencesNode );
export default PHScalePreferencesNode;