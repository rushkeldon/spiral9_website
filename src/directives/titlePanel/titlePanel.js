/*
 * titlePanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.titlePanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.titlePanel', [
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.DataService'
] )

/**
 * @ngdoc directive
 * @name titlePanel
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'titlePanel', function titlePanelDirective( $timeout, DataService ) {
        var CN = 'titlePanelDirective';
        return {
            restrict : 'E',
            replace : true,
            scope : {},
            templateUrl : 'titlePanel/titlePanel.tpl.html',
            link : function titlePanelDirectiveLink( scope, element, attrs ) {
                // console.log( CN + ".titlePanelDirectiveLink" );
                scope.titleInfo = null;
                scope.subTitleIndex = 0;
                scope.subTitleStage = null;
                scope.transitionTime = 1;
                scope.delay = 4;

                scope.displayNextSubTitle = function displayNextSubTitle(){
                    if( !scope.subTitleStage ){
                        scope.subTitleStage = element[ 0 ].querySelector( '.sub-title' );
                    }
                    if( scope.subTitleStage ){
                        TweenMax.to( scope.subTitleStage, scope.transitionTime, {
                            autoAlpha : 0,
                            onComplete : function fadeOutComplete() {
                                scope.subTitleIndex++;
                                if( scope.subTitleIndex >= scope.titleInfo.subTitles.length ){
                                    scope.subTitleIndex = 0;
                                }
                                scope.$evalAsync( function upateSubTitle(){
                                    scope.subTitle = scope.titleInfo.subTitles[ scope.subTitleIndex ];
                                    TweenMax.to( scope.subTitleStage, scope.transitionTime, {
                                        delay : 0.25,
                                        autoAlpha : 1,
                                        onComplete : function fadeInComplete() {
                                            scope.delayThenDisplay();
                                        }
                                    } );
                                } );
                            }
                        } );
                    }
                };

                scope.delayThenDisplay = function delayThenDisplay(){
                    $timeout( scope.displayNextSubTitle, scope.delay * 1000 );
                };

                scope.getData = function getData(){
                    DataService.getTitleInfo()
                        .then(
                        function dataReceived( titleInfo ) {
                            scope.titleInfo = titleInfo;
                            scope.subTitle = scope.titleInfo.subTitles[ 0 ];
                            scope.delayThenDisplay();
                        },
                        function dataFailed( error ){
                            console.error( CN + ".dataFailed", error );
                        }
                    );
                };

                function init(){
                    scope.getData();
                }

                scope.$evalAsync( init );
            }
        };
    } );
