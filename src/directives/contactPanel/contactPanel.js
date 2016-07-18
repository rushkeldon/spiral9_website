/*
 * contactPanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.contactPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.contactPanel', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.DataService',
    'spiral9.directives.skillTile'
] )

/**
 * @ngdoc directive
 * @name contactPanel
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'contactPanel', function contactPanelDirective( $document, $window, DataService ) {
        var CN = 'contactPanelDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'contactPanel/contactPanel.tpl.html',
            scope : {},
            link : function contactPanelDirectiveLink( scope, element, attrs ) {

                scope.contactInfo = null;

                scope.getData = function getData(){
                    DataService.getDataByName( 'contactInfo' )
                        .then(
                            function dataReceived( contactInfo ) {
                                scope.contactInfo = contactInfo;
                            },
                            function dataFailed( error ) {
                                console.error( CN + ".dataFailed", error );
                            }
                        );
                };

                scope.$evalAsync( scope.getData );
            }
        };
    } );
