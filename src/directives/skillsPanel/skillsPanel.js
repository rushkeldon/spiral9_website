/*
 * skillsPanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.skillsPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.skillsPanel', [
    'ngTouch',
    'spiral9.services.DataService',
    'spiral9.directives.skillTile'
] )

/**
 * @ngdoc directive
 * @name skillsPanel
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'skillsPanel', function skillsPanelDirective( $document, $window, DataService, ResponsiveService, SignalTowerService ) {
        var CN = 'skillsPanelDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'skillsPanel/skillsPanel.tpl.html',
            scope : {},
            link : function skillsPanelDirectiveLink( scope, element, attrs ) {
                // console.log( CN + " instantiated." );

                scope.skillsInfo = null;

                scope.getData = function getData(){
                    // console.log( CN + ".getData" );
                    DataService.getSkillsInfo()
                        .then(
                            function dataReceived( skillsInfo ) {
                                scope.skillsInfo = skillsInfo;
                            },
                            function dataFailed( error ){
                                console.error( CN + ".dataFailed", error );
                            }
                        );
                };

                scope.$evalAsync( scope.getData );
            }
        };
    } );
