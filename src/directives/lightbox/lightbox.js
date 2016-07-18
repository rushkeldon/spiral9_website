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

                scope.defaultImageInfo = {
                    "url" : "",
                    "captionHTML" : ""
                };

                scope.reset = function reset() {
                    // console.log( CN + ".reset" );

                    scope.imageIndex = -1;
                    scope.isInTransition = false;
                    scope.transitionFrom = "right";
                    scope.readyToDisplay = false;
                    scope.tweenCount = 0;
                    scope.mouseDirection = 'next';
                };

                scope.reset();

                function getImageIndex( refIndex, direction ) {
                    var index = 0;
                    switch( direction ) {
                        case 'right':
                            index = refIndex + 1 >= scope.imageInfos.length ? 0 : refIndex + 1;
                            break;
                        case 'left':
                            index = refIndex - 1 < 0 ? scope.imageInfos.length - 1 : refIndex - 1;
                            break;
                    }
                    return index;
                }

                function setImageInfo( direction, shouldDisplay ) {
                    // console.log( CN + ".setImageInfo" );
                    // console.log( "\tdirection :", direction );
                    // console.log( "\tshouldDisplay :", shouldDisplay );

                    scope.transitionFrom = direction;
                    var originalImageIndex = scope.imageIndex;
                    scope.imageIndex = getImageIndex( scope.imageIndex, direction );

                    var darkRoom = scope.darkRooms[ 1 ];
                    var imageInfo = scope.imageInfos[ scope.imageIndex ];

                    if( imageInfo && imageInfo === darkRoom.imageInfo /*&& darkRoom.image.naturalWidth*/ ) {
                        if( imageInfo.src ){
                            darkRoom.image.src = imageInfo.src;
                        }
                        if( shouldDisplay ) {
                            scope.imageLoaded( { target : darkRoom.image }, true );
                        }
                    } else {
                        darkRoom.imageInfo = imageInfo;
                        darkRoom.captionPane.innerHTML = imageInfo.captionHTML;
                        if( shouldDisplay ) {
                            darkRoom.image.addEventListener( 'load', scope.imageLoaded, false );
                        }

                        if( imageInfo.src || imageInfo.url ){
                            darkRoom.image.src = imageInfo.src ? imageInfo.src : imageInfo.url;
                        } else {
                            imageInfo.pendingInfo = {
                                direction : direction,
                                imageIndex : originalImageIndex,
                                shouldDisplay : shouldDisplay
                            };
                            // console.log( "setImageInfo does not have any data for the src." );
                        }

                    }
                }

                scope.nextImage = function nextImage() {
                    // console.log( CN + ".nextImage" );

                    if( scope.isInTransition ) { return; }
                    scope.isInTransition = true;
                    scope.dismissCaptionPane( true );
                    setImageInfo( 'right', true );
                };

                scope.prevImage = function prevImage() {
                    // console.log( CN + ".prevImage" );

                    if( scope.isInTransition ) { return; }
                    scope.isInTransition = true;
                    scope.dismissCaptionPane( true );
                    setImageInfo( 'left', true );
                };

                scope.layoutThenIntro = function layoutThenIntro( image ) {
                    // console.log( CN + ".layoutThenIntro" );

                    var naturalWidth = image.naturalWidth;
                    var naturalHeight = image.naturalHeight;
                    var ratio = (naturalHeight / naturalWidth) * 100;
                    var paddingBottom = ratio + "%";
                    var width = naturalWidth > window.document.innerWidth ? window.document.innerWidth : naturalWidth;

                    var darkRoom = scope.darkRooms[ 1 ];

                    darkRoom.lightBox.style.width = width + "px";
                    darkRoom.lightFrame.style.width = width + "px";
                    darkRoom.lightBox.style.paddingBottom = paddingBottom;

                    /*
                    if( !scope.readyToDisplay ) {
                        scope.readyToDisplay = true;
                    }
                    */

                    element[ 0 ].appendChild( darkRoom.lightFrame );

                    scope.$evalAsync( scope.intro );
                };

                scope.imageLoaded = function imageLoaded( e ) {
                    // console.log( CN + ".imageLoaded" );

                    e.target.removeEventListener( 'load', imageLoaded );
                    scope.layoutThenIntro( e.target );
                };

                scope.transitionCompleted = function transitionCompleted( darkRoomToOutro ) {
                    // console.log( CN + ".transitionCompleted" );

                    scope.tweenCount--;

                    if( darkRoomToOutro ) {

                        if( darkRoomToOutro.lightFrame.parentNode ) {
                            darkRoomToOutro.lightFrame.parentNode.removeChild( darkRoomToOutro.lightFrame );
                        }
                        scope.resetDarkRoom( darkRoomToOutro );
                    }

                    if( scope.tweenCount <= 0 ) {
                        scope.darkRooms.reverse();
                        scope.isInTransition = false;
                        scope.darkRooms[ 0 ].touchRect = scope.darkRooms[ 0 ].lightBox.getBoundingClientRect();
                    }
                };

                scope.resetDarkRoom = function resetLightBox( darkRoom ) {
                    // console.log( CN + ".resetDarkRoom" );

                    darkRoom.imageInfo = scope.defaultImageInfo;

                    TweenMax.set( darkRoom.lightBox, {
                        marginRight : "auto",
                        marginLeft : "auto",
                        width : "unset",
                        paddingBottom : "unset",
                        autoAlpha : 0
                    } );

                    TweenMax.set( darkRoom.lightFrame, {
                        width : "unset"
                    } );


                    TweenMax.set( darkRoom.captionPane, {
                        autoAlpha : 0
                    } );
                    /**/
                };

                scope.intro = function intro() {
                    // console.log( CN + ".intro" );

                    var duration = 0.7;
                    var darkRoomToIntro = scope.darkRooms[ 1 ];
                    var darkRoomToOutro = scope.darkRooms[ 0 ];

                    scope.tweenCount = 1;

                    TweenMax.set( darkRoomToIntro.lightBox, {
                        autoAlpha : 1
                    } );

                    var introInfo = {
                        delay : 0.2,
                        ease : Power2.easeOut,
                        autoAlpha : 0,
                        onComplete : scope.transitionCompleted
                    };

                    if( scope.transitionFrom === 'right' ) {
                        introInfo.marginLeft = "120%";
                    } else {
                        introInfo.marginRight = "120%";
                    }

                    scope.introTween = TweenMax.from( darkRoomToIntro.lightBox, duration, introInfo );

                    if( darkRoomToOutro.lightFrame.parentNode ) {
                        scope.tweenCount++;
                        var outroInfo = {
                            delay : 0.2,
                            ease : Power2.easeOut,
                            autoAlpha : 0,
                            onComplete : function outroCompleted() {
                                scope.transitionCompleted( darkRoomToOutro );
                            }
                        };
                        if( scope.transitionFrom === 'right' ) {
                            outroInfo.marginRight = "120%";
                        } else {
                            outroInfo.marginLeft = "120%";
                        }

                        scope.outroTween = TweenMax.to( darkRoomToOutro.lightBox, duration, outroInfo );
                        scope.isInTransition = true;
                    }
                };

                scope.displayCaptionPane = function displayCaptionPane() {
                    if( scope.darkRooms[ 0 ].imageInfo.captionHTML ) {
                        TweenMax.to( scope.darkRooms[ 0 ].captionPane, 0.5, {
                            autoAlpha : 1
                        } );
                    } else {
                        TweenMax.set( scope.darkRooms[ 0 ].captionPane, {
                            autoAlpha : 0
                        } );
                    }
                };

                scope.dismissCaptionPane = function dismissCaptionPane( isImmediate ) {
                    if( isImmediate ) {
                        TweenMax.set( scope.darkRooms[ 0 ].captionPane, {
                            autoAlpha : 0
                        } );
                    } else {
                        TweenMax.to( scope.darkRooms[ 0 ].captionPane, 0.5, {
                            autoAlpha : 0
                        } );
                    }
                };

                scope.mouseMoved = function mouseMoved( e ) {
                    if( scope.isInTransition ) { return; }

                    var darkRoom = scope.darkRooms[ 0 ];
                    var touchX = e.clientX;
                    var touchY = e.clientY;
                    if( touchY < darkRoom.touchRect.top || touchY > darkRoom.touchRect.bottom ) {
                        darkRoom.btnPrev.blur();
                        darkRoom.btnNext.blur();
                        scope.dismissCaptionPane();
                        return;
                    }

                    var prevWidth = darkRoom.touchRect.left + ( darkRoom.touchRect.width * 0.33 );

                    if( touchX <= prevWidth ) {
                        scope.mouseDirection = 'prev';
                        darkRoom.btnPrev.focus();
                    } else {
                        scope.mouseDirection = 'next';
                        darkRoom.btnNext.focus();
                    }

                    // var newFocus = touchX <= prevWidth ? darkRoom.btnPrev.focus() : darkRoom.btnNext.focus();
                    scope.displayCaptionPane();
                };

                scope.mouseLeft = function mouseLeft( e ) {
                    if( scope.isInTransition ) { return; }

                    var darkRoom = scope.darkRooms[ 0 ];
                    darkRoom.btnPrev.blur();
                    darkRoom.btnNext.blur();
                    scope.dismissCaptionPane();
                };

                scope.touchPaneClicked = function touchPaneClicked( e ) {
                    if( scope.isInTransition ) { return; }

                    var darkRoom = scope.darkRooms[ 0 ];
                    var touchX = e.clientX;
                    var touchY = e.clientY - darkRoom.touchRect.top;
                    if( touchY < 0 || touchY > darkRoom.touchRect.height ) {
                        return;
                    }

                    var prevWidth = darkRoom.touchRect.left + ( darkRoom.touchRect.width * 0.33 );

                    if( touchX <= prevWidth ) {
                        scope.prevImage();
                    } else {
                        scope.nextImage();
                    }
                };

                scope.pageClicked = function pageClicked( e ) {
                    if( scope.isInTransition ) { return; }

                    var darkRoom = scope.darkRooms[ 0 ];
                    var touchX = e.clientX;
                    var touchY = e.clientY;

                    switch( true ) {
                        case touchX < darkRoom.touchRect.left :
                        case touchY < darkRoom.touchRect.top :
                        case touchX > darkRoom.touchRect.right :
                        case touchY > darkRoom.touchRect.bottom :
                            scope.dismiss();
                            break;
                    }
                };

                scope.removeDarkRoomByIndex = function removeDarkRoomByIndex( index ) {
                    // console.log( CN + ".removeDarkRoomByIndex" );

                    if( scope.darkRooms[ index ].lightFrame.parentNode ) {
                        scope.darkRooms[ index ].lightFrame.parentNode.removeChild( scope.darkRooms[ index ].lightFrame );
                    }
                };

                scope.addPNGsrcFromNode = function addPNGsrcFromNode( nodeToRasterize, srcRecipient ) {
                    // requires https://github.com/tsayen/dom-to-image

                    // TODO : try catch?  detect Safari's dumb ass??
                    if( nodeToRasterize && srcRecipient ) {
                        domtoimage.toPng( nodeToRasterize )
                            .then(
                                function pngReceived( dataUrl ) {
                                    srcRecipient.src = dataUrl;
                                } )
                            .catch(
                                function pngFailed( error ) {
                                    console.error( 'oops, something went wrong!', error );
                                } );
                    } else {
                        console.error( CN + ".getPNGsrcFromSelector has a missing param..." );
                    }
                };

                scope.newImageInfosReceived = function newImageInfosReceived( newImageInfos ) {
                    if( !newImageInfos || !newImageInfos.length ) {
                        console.error( CN + " newImageInfos missing." );
                        return;
                    }
                    window.document.body.className += " non-scrollable";

                    scope.reset();
                    scope.imageInfos = newImageInfos;
                    scope.rasterizeSignposts();
                    scope.readyToDisplay = true;

                    TweenMax.set( element[ 0 ], {
                        autoAlpha : 0
                    } );

                    TweenMax.to( element[ 0 ], 0.5, {
                        autoAlpha : 1,
                        onComplete : function displayed(){
                            // console.log( CN + ".displayed" );
                            scope.nextImage();
                            scope.addEventListeners();
                        }
                    } );
                };

                scope.addImageData = function addImageData( imageInfo ){
                    // clean out signpostElement
                    scope.signpostElement.innerHTML = "";

                    // populate signpostElement
                    var titleElement = window.document.createElement( 'h1' );
                    titleElement.innerHTML = imageInfo.title;
                    scope.signpostElement.appendChild( titleElement );

                    var blurbElement = window.document.createElement( 'p' );
                    blurbElement.innerHTML = imageInfo.blurbHTML;
                    scope.signpostElement.appendChild( blurbElement );

                    // assign imgSrc for signpost
                    // TODO : ? add in a wait here?
                    scope.addPNGsrcFromNode( scope.signpostElement, imageInfo );
                };

                scope.rasterizeSignposts = function rasterizeSignposts(){
                    // console.log( CN + ".rasterizeSignposts" );

                    angular.forEach( scope.imageInfos, function createSignpost( imageInfo, index ){
                        if( imageInfo.hasOwnProperty( "title" ) ){
                            window.setTimeout( function callAddImageData(){ scope.addImageData( imageInfo ); }, 1000 * index );
                        }
                    } );


                };

                scope.dismiss = function dismiss() {
                    // console.log( CN + ".dismiss" );

                    TweenMax.to( element[ 0 ], 0.5, {
                        autoAlpha : 0,
                        onComplete : function dismissed() {
                            scope.readyToDisplay = false;
                            scope.resetDarkRoom( scope.darkRooms[ 0 ] );
                            scope.resetDarkRoom( scope.darkRooms[ 1 ] );
                            // remove the 'non-scrollable' class from the body
                            window.document.body.className = window.document.body.className.split( " non-scrollable" ).join( "" );
                            scope.removeEventListeners();
                            scope.$evalAsync();
                        }
                    } );
                };

                scope.addEventListeners = function addEventListeners() {
                    // console.log( CN + ".addEventListeners" );

                    angular.forEach( scope.darkRooms, function addListeners( darkRoom ) {
                        darkRoom.touchPane.addEventListener( 'mousemove', scope.mouseMoved, false );
                        darkRoom.touchPane.addEventListener( 'mouseleave', scope.mouseLeft, false );
                        darkRoom.touchPane.addEventListener( 'click', scope.touchPaneClicked, false );
                    } );

                    window.document.addEventListener( 'click', scope.pageClicked, false );
                };

                scope.removeEventListeners = function removeEventListeners( isUponDestruction ) {
                    // console.log( CN + ".removeEventListeners" );

                    // remove event listeners
                    angular.forEach( scope.darkRooms, function addListeners( darkRoom ) {
                        darkRoom.touchPane.removeEventListener( 'mousemove', scope.mouseMoved );
                        darkRoom.touchPane.removeEventListener( 'mouseleave', scope.mouseLeft );
                        darkRoom.touchPane.removeEventListener( 'click', scope.touchPaneClicked );
                    } );

                    window.document.removeEventListener( 'click', scope.pageClicked );
                };

                scope.cleanup = function cleanup() {
                    // console.log( CN + ".cleanup" );

                    scope.removeEventListeners( true );

                    // remove references
                    scope.reset();
                };

                scope.getReferences = function getReferences() {
                    // console.log( CN + ".getReferences" );

                    var lightFrames = element[ 0 ].querySelectorAll( '.light-frame' );
                    scope.offstage = element[ 0 ].querySelector( '.offstage' );
                    scope.signpostElement = element[ 0 ].querySelector( '.signpost' );
                    scope.darkRooms = [];
                    angular.forEach( lightFrames, function getReferences( lightFrame ) {
                        scope.darkRooms.push( {
                            lightFrame : lightFrame,
                            lightBox : lightFrame.querySelector( '.light-box' ),
                            btnNext : lightFrame.querySelector( '.btn-next' ),
                            btnPrev : lightFrame.querySelector( '.btn-prev' ),
                            captionPane : lightFrame.querySelector( '.caption-pane' ),
                            image : lightFrame.querySelector( 'img' ),
                            touchPane : lightFrame.querySelector( '.touch-pane' ),
                            touchRect : { left : 0, right : 0, top : 0, bottom : 0, width : 0, height : 0 },
                            imageInfo : scope.defaultImageInfo
                        } );
                    } );
                };

                scope.init = function init() {
                    var errorMsg = CN + " encountered an error while initializing.";
                    var bodyNode;

                    // graft element into body
                    var elementNode = element[ 0 ].parentNode.removeChild( element[ 0 ] );
                    if( elementNode ) {
                        bodyNode = window.document.querySelector( 'body' );
                        if( bodyNode ) {
                            bodyNode.appendChild( elementNode );
                        } else {
                            console.error( errorMsg );
                            return;
                        }
                    } else {
                        console.error( errorMsg );
                        return;
                    }

                    scope.getReferences();

                    if( scope.offstage && scope.offstage.parentNode ){
                        scope.offstage.parentNode.removeChild( scope.offstage );
                        bodyNode.appendChild( scope.offstage );
                    }

                    // add one-time listeners
                    scope.signalLightboxImages = SignalTowerService.subscribeToSignal( 'signalLightboxImages', scope.newImageInfosReceived, scope );
                    scope.$on( '$destroy', scope.cleanup );

                    // remove and reset darkroom nodes
                    scope.removeDarkRoomByIndex( 0 );
                    scope.resetDarkRoom( scope.darkRooms[ 0 ] );
                    scope.removeDarkRoomByIndex( 1 );
                    scope.resetDarkRoom( scope.darkRooms[ 1 ] );

                };

                scope.$evalAsync( scope.init );
            }
        };
    } );
