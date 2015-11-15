/*
 * workExperiencePanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.workExperiencePanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.workExperiencePanel', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.DataService'
] )

/**
 * @ngdoc directive
 * @name workExperiencePanel
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'workExperiencePanel', function workExperiencePanelDirective( DataService ) {
        var CN = 'workExperiencePanelDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'workExperiencePanel/workExperiencePanel.tpl.html',
            scope : {},
            link : function workExperiencePanelDirectiveLink( scope, element, attrs ) {
                // console.log( CN + " instantiated." );

                scope.workInfo = null;


                scope.getData = function getData(){
                    // console.log( CN + ".getData" );
                    DataService.getWorkInfo()
                        .then(
                            function dataReceived( workInfo ) {
                                scope.workInfo = workInfo;
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
