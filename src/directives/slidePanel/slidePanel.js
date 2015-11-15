/*
 * slidePanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.slidePanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.slidePanel', [
    'spiral9.services.DataService'
] )

/**
 * @ngdoc directive
 * @name slidePanel
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'slidePanel', function slidePanelDirective( $document, $timeout, $window, DataService ) {
        var CN = 'slidePanelDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'slidePanel/slidePanel.tpl.html',
            scope : {},
            link : function slidePanelDirectiveLink( scope, element, attrs ) {
               // console.log( CN + " instantiated." );

                // initial values
                scope.retryMS = 200;
                scope.shouldPlay = true;
                scope.slideIndex = -1;
                scope.tween = null;
                scope.baseElement = element[ 0 ];
                scope.slideShowInfo = null;

                function swapSlides( nextSlide, prevSlide ) {
                   // console.log( CN + ".swapSlides" );

                    // prepare nextSlide to fade in
                    if( nextSlide ) {
                        TweenMax.set( nextSlide, {
                            zIndex : 2,
                            autoAlpha : 0
                        } );
                    }
                    // move prevSlide back in z-index
                    if( prevSlide ) {
                        TweenMax.set( prevSlide, {
                            zIndex : 1
                        } );
                    }
                }

                function getSlides() {
                    var oldIndex = scope.slideIndex;
                    var nextSlide, prevSlide;
                    scope.slideIndex++;

                    // mind the bounds - carousel if we've reached the end
                    if( scope.slideIndex >= scope.slideShowInfo.imgURLs.length ) {
                        scope.slideIndex = 0;
                    }

                    nextSlide = element[ 0 ].querySelector( '.slide-img-' + scope.slideIndex );

                    // only assign prevSlide if valid
                    if( scope.slideIndex !== oldIndex && oldIndex !== -1 ){
                        prevSlide = element[ 0 ].querySelector( '.slide-img-' + oldIndex );
                    }

                    return [ nextSlide, prevSlide ];
                }

                scope.displayNextSlide = function displayNextSlide(){
                   // console.log( CN + ".displayNextSlide" );

                    if( !scope.shouldPlay ){
                        return;
                    }

                    var slides = getSlides();
                    scope.nextSlide = slides[ 0 ];
                    scope.prevSlide = slides[ 1 ];

                    if( !scope.nextSlide ){
                        $timeout( scope.displayNextSlide, scope.retryMS );
                        scope.slideIndex--;
                        if( scope.slideIndex < -1 ){ scope.slideIndex = -1; }
                        return;
                    }

                    swapSlides( scope.nextSlide, scope.prevSlide );

                    var duration = scope.slideShowInfo.transition.duration ? scope.slideShowInfo.transition.duration : 0.5;

                    scope.$evalAsync( function fadeIn(){
                        scope.tween = TweenMax.to( scope.nextSlide, duration, {
                            autoAlpha : 1,
                            onComplete : function fadeInComplete() {
                                if( scope.prevSlide ){
                                    TweenMax.set( scope.prevSlide, { autoAlpha : 0 } );
                                }
                                setTimeout( scope.displayNextSlide, scope.slideShowInfo.transition.delay * 1000 );
                            }
                        } );
                    } );
                };

                function documentScrolled(){
                    if( scope.tween ){
                        scope.tween.kill();
                        if( scope.nextSlide ){
                            TweenMax.set( scope.nextSlide, { autoAlpha : 1 } );
                        }
                        if( scope.prevSlide ){
                            TweenMax.set( scope.prevSlide, { autoAlpha : 0 } );
                        }
                    }

                    if( $window.pageYOffset > 0 ){
                        scope.shouldPlay = false;
                        clearTimeout( scope.timeoutID );
                    } else {
                        scope.shouldPlay = true;
                        clearTimeout( scope.timeoutID );
                        scope.timeoutID = setTimeout( scope.displayNextSlide, scope.slideShowInfo.transition.delay * 1000 );
                    }
                }

                scope.getData = function getData(){
                   // console.log( CN + ".getData" );

                    DataService.getSlideShowInfo()
                        .then(
                            function dataReceived( slideShowInfo ) {
                               // console.log( CN + ".dataReceived" );
                                scope.slideShowInfo = slideShowInfo;
                                scope.$evalAsync( scope.init );
                            },
                            function dataFailed( error ){
                                console.error( CN + ".dataFailed", error );
                            }
                    );
                };

                scope.init = function init(){
                    //console.log( CN + ".init" );
                    //console.log( "\tscope.slideShowInfo :", scope.slideShowInfo );
                    //console.log( "\tscope.baseElement :", scope.baseElement );

                    if( scope.baseElement && scope.baseElement.querySelector ){
                        $document.bind( 'scroll', documentScrolled );

                        TweenMax.set( scope.baseElement, {
                            height : $window.innerHeight
                        } );

                        TweenMax.set( scope.baseElement.querySelector( '.shadow-overlay' ), {
                            height : $window.innerHeight
                        } );

                        scope.$evalAsync( scope.displayNextSlide );
                    } else {
                        //// console.log( "...retrying in " + scope.retryMS + " ms." );
                        // $timeout( scope.init, scope.retryMS );
                    }
                };

                scope.$evalAsync( scope.getData );

            }
        };
    } );