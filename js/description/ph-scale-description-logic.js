// Copyright 2023-2024, University of Colorado Boulder

// @author Jonathan Olson <jonathan.olson@colorado.edu>

/* eslint-disable */

export default () => {
  let context;
  let strings;

  const totalVolumeToEnum = totalVolume => {
    if ( totalVolume === 0 ) {
      return 'empty';
    }
    else if ( totalVolume < 1.2 ) {
      return 'partiallyFilled';
    }
    else {
      return 'full';
    }
  };

  return phet.joist.DescriptionContext.registerLogic( {
    launch( descriptionContext, descriptionStrings ) {
      context = descriptionContext;
      strings = descriptionStrings;

      const macroScreen = context.get( 'phScale.macroScreen' );
      if ( macroScreen ) {
        const macroScreenView = context.get( 'phScale.macroScreen.view' );

        // solution
        //const soluteProperty = context.get( 'phScale.macroScreen.model.solution.soluteProperty' );
        const soluteProperty = context.get( 'phScale.macroScreen.model.dropper.soluteProperty' ); // TODO: why was this not defined?
        const solutionPHProperty = context.get( 'phScale.macroScreen.model.solution.pHProperty' );
        const solutionTotalVolumeProperty = context.get( 'phScale.macroScreen.model.solution.totalVolumeProperty' );
        const soluteVolumeProperty = context.get( 'phScale.macroScreen.model.solution.soluteVolumeProperty' );
        const waterVolumeProperty = context.get( 'phScale.macroScreen.model.solution.waterVolumeProperty' );

        // pH Meter
        const pHMeterPHProperty = context.get( 'phScale.macroScreen.model.pHMeter.pHProperty' );
        const pHMeterPositionProperty = context.get( 'phScale.macroScreen.model.pHMeter.probe.positionProperty' );

        // Dropper
        const dropperEnabledProperty = context.get( 'phScale.macroScreen.model.dropper.enabledProperty' );
        const isDispensingProperty = context.get( 'phScale.macroScreen.model.dropper.isDispensingProperty' );
        const isAutofillingProperty = context.get( 'phScale.macroScreen.model.isAutofillingProperty' );

        // Water faucet
        const waterFaucetEnabledProperty = context.get( 'phScale.macroScreen.model.waterFaucet.enabledProperty' );
        const waterFaucetFlowRateProperty = context.get( 'phScale.macroScreen.model.waterFaucet.flowRateProperty' );

        // Drain faucet
        const drainFaucetEnabledProperty = context.get( 'phScale.macroScreen.model.drainFaucet.enabledProperty' );
        const drainFaucetFlowRateProperty = context.get( 'phScale.macroScreen.model.drainFaucet.flowRateProperty' );


        const simStateDescriptionNode = new phet.scenery.Node( {
          tagName: 'p'
        } );

        context.nodeSet( macroScreenView, 'screenSummaryContent', new phet.scenery.Node( {
          children: [
            new phet.scenery.Node( {
              tagName: 'p',
              innerContent: strings.screenSummary()
            } ),
            simStateDescriptionNode
          ]
        } ) );

        context.multilink( [
          soluteProperty,
          solutionTotalVolumeProperty
        ], (
          solute,
          solutionTotalVolume
        ) => {
          simStateDescriptionNode.innerContent = strings.screenSummarySimStateDescription(
            solute.tandemName,
            totalVolumeToEnum( solutionTotalVolume )
          );
        } );

        const solutes = [
          phet.phScale.Solute.BATTERY_ACID,
          phet.phScale.Solute.BLOOD,
          phet.phScale.Solute.CHICKEN_SOUP,
          phet.phScale.Solute.COFFEE,
          phet.phScale.Solute.DRAIN_CLEANER,
          phet.phScale.Solute.HAND_SOAP,
          phet.phScale.Solute.MILK,
          phet.phScale.Solute.ORANGE_JUICE,
          phet.phScale.Solute.SODA,
          phet.phScale.Solute.SPIT,
          phet.phScale.Solute.VOMIT,
          phet.phScale.Solute.WATER
        ];

        const soluteComboBox = context.get( 'phScale.macroScreen.view.soluteComboBox' );
        context.nodeSet( soluteComboBox, 'accessibleName', strings.soluteComboBoxAccessibleName() );
        for ( const solute of solutes ) {
          context.propertySet( soluteComboBox.a11yNamePropertyMap.get( solute ), strings.soluteName( solute.tandemName ) );
        }

        // pdomOrder
        // context.nodeSet( macroScreenView.pdomPlayAreaNode, 'pdomOrder', [
        //   context.get( 'phScale.macroScreen.view.dropperNode.button' ),
        //   context.get( 'phScale.macroScreen.view.soluteComboBox' ),
        //   context.get( 'phScale.macroScreen.view.waterFaucetNode.faucetNode' ),
        //   context.get( 'phScale.macroScreen.view.drainFaucetNode' ),
        //   context.get( 'phScale.macroScreen.view.pHMeterNode.probeNode' ),
        //   context.get( 'phScale.macroScreen.view.resetAllButton' )
        // ] );

        const alerter = new phet.sceneryPhet.Alerter( {
          alertToVoicing: false,
          descriptionAlertNode: macroScreenView
        } );

        context.lazyLink( isDispensingProperty, isDispensing => {
          alerter.alert( strings.dropperDispensingAlert( isDispensing ) );
        } );
      }
    },
    added( tandemID, obj ) {
      // Will be called when an object is dynamically added after sim start-up
    },
    removed( tandemID, obj ) {
      // Will be called when an object is dynamically removed after sim start-up
    }
  } );
};