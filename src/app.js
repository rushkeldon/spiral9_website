/*
 * app.js
 *
 * Created: Friday, November 8, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name spiral9
 * @description This is the root module for the spiral9 application.
 */

angular.module( 'spiral9', [
    'ngTouch',
    'spiral9.directives.aboutPanel',
    'spiral9.directives.arcIndicator',
    'spiral9.directives.contactPanel',
    'spiral9.directives.navBar',
    'spiral9.directives.portfolioPanel',
    'spiral9.directives.skillsPanel',
    'spiral9.directives.slidePanel',
    'spiral9.directives.timeline',
    'spiral9.directives.titlePanel',
    'spiral9.directives.workExperiencePanel',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.DataService',
    'spiral9.services.ResponsiveService',
    'spiral9.services.SignalTowerService',
    'templates-components'
] )
    .config( function spiral9config() {
        var CN = "spiral9config";
        // console.log( CN );
    } )

    .controller( 'spiral9controller', function spiral9controller( $scope, DataService ) {
        var CN = "spiral9controller";
        // console.log( CN );
        $scope.DataService = DataService;
    } )

    .run( function(){ } );
