/*
 * portfolioPanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.portfolioPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.lightbox', [
        'ngTouch',
        'spiral9.filters.makeSafeHTML',
        'spiral9.services.SignalTowerService'
    ] )

    /**
     * @ngdoc directive
     * @name portfolioPanel
     * @restrict E
     * @element ANY
     * @description An empty directive description. Please fill in a high level description of this directive.
     */
    .directive( 'lightbox', function lightbox( $window, SignalTowerService ) {
        var CN = "lightbox";
        return {
            restrict : "E",
            replace : true,
            scope : {},
            templateUrl : 'lightbox/lightbox.tpl.html',
            link : function lightboxLink( scope, element, attrs ) {

                scope.reset = function reset( isInit ) {
                    scope.imageIndex = 0;
                    scope.isInTransition = false;
                    scope.readyToDisplay = false;
                };

                scope.newImageInfosReceived = function newImageInfosReceived( newImageInfos ) {
                    if( !newImageInfos || !newImageInfos.length ) { return; }

                    window.document.body.classList.add( 'non-scrollable' );

                    scope.reset();
                    scope.imageInfos = newImageInfos;

                    angular.forEach( scope.imageInfos, function( imageInfo, i ) {
                        imageInfo.frame = window.document.createElement( 'div' );
                        imageInfo.frame.classList.add( 'frame' );
                        imageInfo.img = window.document.createElement( 'img' );
                        imageInfo.frame.appendChild( imageInfo.img );

                        imageInfo.img.src = imageInfo.url;
                        if( i === 0 ) {
                            imageInfo.frame.classList.add( 'on-screen' );
                        } else {
                            imageInfo.frame.classList.add( 'off-screen-right' );
                        }

                        imageInfo.frame.setAttribute( 'data-index', i );
                        element[ 0 ].appendChild( imageInfo.frame );
                    } );

                    scope.addEventListeners();
                    scope.readyToDisplay = true;

                };

                scope.nextImage = function nextImage() {
                    var isCarousel;
                    var onScreenImage = element[ 0 ].querySelector( '.on-screen' );
                    if( !onScreenImage ){
                        return;
                    }
                    var index = parseInt( onScreenImage.getAttribute( 'data-index' ), 10 );
                    index++;
                    scope.imageIndex = index >= scope.imageInfos.length ? 0 : index;

                    scope.nextFrame = scope.imageInfos[ scope.imageIndex ].frame;

                    isCarousel = scope.nextFrame.classList.contains( 'off-screen-left' );

                    onScreenImage.classList.remove( 'on-screen' );
                    onScreenImage.classList.add( 'off-screen-left' );

                    if( isCarousel ) {
                        scope.nextFrame.classList.add( 'trans-none' );
                        scope.nextFrame.classList.remove( 'off-screen-left' );
                        scope.nextFrame.classList.add( 'off-screen-right' );
                        scope.$evalAsync(
                            window.setTimeout( function() {
                                scope.nextFrame.classList.remove( 'trans-none' );
                                scope.nextFrame.classList.add( 'on-screen' );
                                scope.nextFrame.addEventListener( 'transitionend', scope.displayInfoPanel, false );
                                scope.nextFrame.classList.remove( 'off-screen-right' );
                            }, 50 ) );
                    } else {
                        scope.nextFrame.classList.add( 'on-screen' );
                        scope.nextFrame.addEventListener( 'transitionend', scope.displayInfoPanel, false );
                        scope.nextFrame.classList.remove( 'off-screen-right' );
                    }
                };

                scope.prevImage = function prevImage() {
                    var isCarousel;
                    var onScreenImage = element[ 0 ].querySelector( '.on-screen' );
                    if( !onScreenImage ){
                        return;
                    }
                    var index = parseInt( onScreenImage.getAttribute( 'data-index' ), 10 );
                    index--;
                    scope.imageIndex = index < 0 ? scope.imageInfos.length - 1 : index;
                    scope.nextFrame = scope.imageInfos[ scope.imageIndex ].frame;
                    var infoPanel = element[ 0 ].querySelector( '.info-panel' );
                    infoPanel.innerHTML = scope.imageInfos[ scope.imageIndex ].captionHTML;

                    isCarousel = scope.nextFrame.classList.contains( 'off-screen-right' );

                    onScreenImage.classList.remove( 'on-screen' );
                    onScreenImage.classList.add( 'off-screen-right' );

                    if( isCarousel ) {
                        scope.nextFrame.classList.add( 'trans-none' );
                        scope.nextFrame.classList.remove( 'off-screen-right' );
                        scope.nextFrame.classList.add( 'off-screen-left' );
                        scope.$evalAsync(
                            window.setTimeout( function() {
                                scope.nextFrame.classList.remove( 'trans-none' );
                                scope.nextFrame.classList.add( 'on-screen' );
                                scope.nextFrame.addEventListener( 'transitionend', scope.displayInfoPanel, false );
                                scope.nextFrame.classList.remove( 'off-screen-left' );
                            }, 50 ) );
                    } else {
                        scope.nextFrame.classList.add( 'on-screen' );
                        scope.nextFrame.addEventListener( 'transitionend', scope.displayInfoPanel, false );
                        scope.nextFrame.classList.remove( 'off-screen-left' );
                    }
                };

                scope.displayInfoPanel = function displayInfoPanel() {
                    console.log( CN + '.displayInfoPanel' );

                    var infoPanel = element[ 0 ].querySelector( '.info-panel' );
                    if ( !infoPanel.classList.contains( 'displayed' ) ){
                        infoPanel.classList.add( 'displayed' );
                        if( scope.nextFrame ) {
                            scope.nextFrame.removeEventListener( 'transitionend', scope.displayInfoPanel, false );
                        }
                    }
                    infoPanel.innerHTML = scope.imageInfos[ scope.imageIndex ].captionHTML;
                };

                scope.dismissInfoPanel = function dismissInfoPanel() {
                    console.log( CN + '.dismissInfoPanel' );

                    var infoPanel = element[ 0 ].querySelector( '.info-panel' );
                    if ( infoPanel.classList.contains( 'displayed' ) ){
                        infoPanel.classList.remove( 'displayed' );
                    }
                };

                scope.keyPressed = function keyPressed( e ) {
                    switch( e.key.toLowerCase() ) {
                        case 'arrowup' :
                            scope.prevImage();
                            break;
                        case 'arrowdown' :
                            scope.nextImage();
                            break;
                        case 'arrowleft' :
                            scope.prevImage();
                            break;
                        case 'arrowright' :
                            scope.nextImage();
                            break;
                    }
                };

                scope.clicked = function clicked( e ) {
                    switch( true ) {
                        case e.target.nodeName.toLowerCase() === 'img' :
                            scope.nextImage();
                            break;
                        case e.target.classList.contains( 'left-arrow' ) :
                            scope.prevImage();
                            break;
                        case e.target.classList.contains( 'right-arrow' ) :
                            scope.nextImage();
                            break;
                        default :
                            scope.dismiss();
                    }

                    e.preventDefault();
                    e.stopPropagation();
                };

                scope.dismiss = function dismiss() {
                    // element[ 0 ].innerHTML = '';
                    angular.forEach( scope.imageInfos, function removeImg( imageInfo ) {
                        imageInfo.img.parentNode.removeChild( imageInfo.img );
                    } );
                    scope.readyToDisplay = false;
                    scope.removeEventListeners();
                    scope.$evalAsync();
                };

                scope.addEventListeners = function addEventListeners() {
                    element[ 0 ].addEventListener( 'mousemove', scope.mouseMoved, false );
                    element[ 0 ].addEventListener( 'mouseleave', scope.mouseLeft, false );
                    window.document.addEventListener( 'keydown', scope.keyPressed, true );
                    window.document.addEventListener( 'click', scope.clicked, true );
                };

                scope.removeEventListeners = function removeEventListeners( isUponDestruction ) {
                    element[ 0 ].removeEventListener( 'mousemove', scope.mouseMoved, false );
                    element[ 0 ].removeEventListener( 'mouseleave', scope.mouseLeft, false );
                    window.document.removeEventListener( 'keydown', scope.keyPressed, true );
                    window.document.removeEventListener( 'click', scope.clicked, true );
                };

                scope.mouseMoved = function mouseMoved( e ) {
                    scope.displayInfoPanel();
                };

                scope.mouseLeft = function mouseLeft( e ) {
                    scope.dismissInfoPanel();
                };

                scope.init = function init() {
                    // add one-time listeners
                    scope.signalLightboxImages = SignalTowerService.subscribeToSignal( 'signalLightboxImages', scope.newImageInfosReceived, scope );
                    // scope.$on( '$destroy', scope.cleanup );

                };

                scope.$evalAsync( scope.init );
            }
        };
    } );
