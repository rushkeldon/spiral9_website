/*
 * navBar.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.navBar
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.navBar', [
    'ngTouch',
    'spiral9.services.DataService',
    'spiral9.services.ResponsiveService',
    'spiral9.services.SignalTowerService'
] )

/**
 * @ngdoc directive
 * @name navBar
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'navBar', function navBarDirective( $document, $window, DataService, ResponsiveService, SignalTowerService ) {
        var CN = 'navBarDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'navBar/navBar.tpl.html',
            scope : {},
            link : function navBarDirectiveLink( scope, element, attrs ) {
                // console.log( CN + " instantiated." );

                scope.navInfo = null;
                scope.currentSelector = "";

                scope.displayNavItems = function displayNavItems( e ){
                    console.log( CN + ".displayNavItems" );

                };

                scope.navItemClicked = function navItemClicked( e, selector ){
                    console.log( CN + ".navItemClicked" );

                    scope.currentSelector = selector;
                    scope.scrollToCurrentSelector();
                };

                scope.scrollToCurrentSelector = function scrollToCurrentSelector(){
                    console.log( CN + ".scrollToCurrentSelector" );

                };

                scope.breakPointChanged = function breakPointChanged( newBreakPointTag ) {
                    console.log( CN + ".breakPointChanged" );
                    console.log( "\tnewBreakPointTag :", newBreakPointTag );

                };

                scope.documentScrolled = function documentScrolled(){
                    if( !scope.slidePanelHeight ){
                        scope.getSlidePanelHeight();
                    }

                    if( !scope.navBarHeight ){
                        scope.getNavBarHeight();
                    }

                    if( scope.slidePanelHeight ){
                        if( $window.pageYOffset >= scope.slidePanelHeight - scope.navBarHeight ){
                            TweenMax.set( element[ 0 ], {
                                css : {
                                    position : "fixed",
                                    top : "0px"
                                }
                            } );
                        } else{
                            TweenMax.set( element[ 0 ], {
                                css : {
                                    position : "absolute",
                                    top : scope.slidePanelHeight - scope.navBarHeight + "px"
                                }
                            } );
                        }
                    }
                };

                scope.getData = function getData(){
                    // console.log( CN + ".getData" );
                    DataService.getNavInfo()
                        .then(
                            function dataReceived( navInfo ) {
                                scope.navInfo = navInfo;
                                scope.currentSelector = scope.navInfo.navItems[ 0 ].selector;
                                scope.init();
                            },
                            function dataFailed( error ){
                                console.error( CN + ".dataFailed", error );
                            }
                        );
                };

                scope.getSlidePanelHeight = function getSlidePanelHeight(){
                    var slidePanel = window.document.querySelector( '.slide-panel' );
                    if( slidePanel ){
                        scope.slidePanelHeight = parseInt( window.getComputedStyle( slidePanel, null )
                            .getPropertyValue( 'height' ), 10 );
                    } else{
                        scope.slidePanelHeight = 0;
                    }
                    return scope.slidePanelHeight;
                };

                scope.getNavBarHeight = function getNavBarHeight(){
                    scope.navBarHeight = parseInt( window.getComputedStyle( element[ 0 ], null )
                        .getPropertyValue( 'height' ), 10 );
                    return scope.navBarHeight;
                };

                scope.init = function init(){
                    scope.getNavBarHeight();

                    if( ResponsiveService.tag() === 'large' ){
                        // console.log( CN + " sees desktop media query." );
                        TweenMax.set( element[ 0 ], {
                            css : {
                                top : $window.innerHeight - scope.navBarHeight
                            }
                        } );
                    }
                    SignalTowerService.subscribeToSignal( 'signalBreakPointChanged', scope.breakPointChanged, scope );
                    $document.bind( 'scroll', scope.documentScrolled );
                    scope.getSlidePanelHeight();
                };

                scope.$evalAsync( scope.getData );
            }
        };
    } );
