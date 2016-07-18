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
                scope.navInfo = null;
                scope.currentSelector = "";
                scope.shouldMenuDisplay = false;
                scope.handlersHandled = {};

                scope.toggleNavMenu = function toggleNavMenu( e ){
                    scope.shouldMenuDisplay = !scope.shouldMenuDisplay;
                    scope.$evalAsync();
                };

                scope.navItemClicked = function navItemClicked( e, selector ){
                    if( ResponsiveService.tag() !== 'large' ){
                        scope.shouldMenuDisplay = false;
                        scope.$evalAsync();
                    }
                    scope.currentSelector = selector;
                    scope.scrollToCurrentSelector();
                };

                scope.scrollToCurrentSelector = function scrollToCurrentSelector(){
                    var targetElement = $document[ 0 ].querySelector( scope.currentSelector );
                    if( targetElement ){
                        //var currentVerticalScroll = window.pageYOffset;
                        var currentVerticalScroll = ( window.pageYOffset !== null ) ? window.pageYOffset : ( document.documentElement.scrollTop !== null ) ? document.documentElement.scrollTop : document.body.scrollTop;

                        scope.echo = currentVerticalScroll + " ";
                        var targetY = currentVerticalScroll + targetElement.getBoundingClientRect().top;// - 62;
                        if( targetY < 0 ){ targetY = 0; }

                        if( scope.tween ){
                            scope.tween.kill();
                        }

                        scope.tween = TweenMax.to( window, 1, {
                            scrollTo : { y : targetY },
                            ease : Power2.easeOut,
                            onComplete : function cleanTween(){
                                scope.tween = null;
                            }
                        } );
                    }
                };

                scope.breakPointChanged = function breakPointChanged( newBreakPointTag ) {
                    if( newBreakPointTag === 'large' ){
                        scope.shouldMenuDisplay = true;
                    } else {
                        scope.shouldMenuDisplay = false;
                    }
                    scope.$evalAsync();
                };

                scope.documentClicked = function documentClicked( e ){
                    var doesClickPertain = element[ 0 ].contains( e.target );

                    if( !doesClickPertain ){
                        if( ResponsiveService.tag() !== 'large' ){
                            scope.shouldMenuDisplay = false;
                            scope.$evalAsync();
                        }
                    }
                };

                scope.documentScrolled = function documentScrolled(){
                    scope.layout();
                };

                scope.getData = function getData(){
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

                scope.layout = function layout(){
                    if( ResponsiveService.tag() === 'large' ){
                        scope.getSlidePanelHeight();

                        if( !scope.navBarHeight ){
                            scope.getNavBarHeight();
                        }

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

                    } else {
                        TweenMax.set( element[ 0 ], {
                            css : {
                                position : "fixed",
                                top : "0px"
                            }
                        } );
                    }
                };

                scope.init = function init(){
                    scope.getNavBarHeight();

                    if( ResponsiveService.tag() === 'large' ){
                        TweenMax.set( element[ 0 ], {
                            css : {
                                top : $window.innerHeight - scope.navBarHeight
                            }
                        } );
                    }
                    SignalTowerService.subscribeToSignal( 'signalBreakPointChanged', scope.breakPointChanged, scope );
                    SignalTowerService.subscribeToSignal( 'slidePanelSizeChanged', scope.layout, scope );
                    $document.bind( 'scroll', scope.documentScrolled );
                    $document.bind( 'click', scope.documentClicked );
                    scope.getSlidePanelHeight();
                    scope.breakPointChanged( ResponsiveService.tag() );
                };

                scope.$evalAsync( scope.getData );
            }
        };
    } );
