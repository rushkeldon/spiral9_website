angular.module( 'spiral9.directives.responsiveImage', [
    'spiral9.services.ResponsiveService',
    'spiral9.services.SignalTowerService'
] )
    .directive( 'responsiveImage', function responsiveImageDirective( ResponsiveService, SignalTowerService ) {
        var CN = "responsiveImageDirective";
        return {
            restrict : 'E',
            replace : true,
            scope : {
                elementData : '='
            },
            templateUrl : 'responsiveImage/responsiveImage.tpl.html',
            link : function( scope, element, attrs ) {

                scope.altText = "";
                scope.imgWidth = "";
                scope.imgClassName = "";
                scope.imgSrc = "";

                function getSrc() {
                    return scope.elementData.urls ? scope.elementData.urls[ ResponsiveService.tag() ] : "";
                }

                function getAlignment() {
                    var align = "left";
                    if( scope.elementData.hasOwnProperty( 'align' ) ) {
                        switch( typeof(scope.elementData.align) ) {
                            case 'string': // pass through
                                align = scope.elementData.align;
                                break;
                            case 'object': // get the corresponding breakpoint
                                align = scope.elementData.align[ ResponsiveService.tag() ];
                                break;
                        }

                    }
                    return align;
                }

                function getWidth() {
                    var width = "100%";
                    var shouldConvert = true;
                    if( scope.elementData.hasOwnProperty( 'convert' ) ) {
                        // opted in to convert to percentage
                        if( !scope.elementData.convert.width ) {
                            shouldConvert = false;
                            width = scope.elementData.width;
                        }
                    }

                    if( shouldConvert ) {
                        if( typeof(scope.elementData.width === "string") ) {
                            // NOTE : assumption that width was described in pixels
                            scope.elementData.width = parseInt( scope.elementData.width, 10 );
                        }
                        width = ResponsiveService.convertWidthToPercent( scope.elementData.width, scope.elementData.parentMaxWidth );
                    }

                    return width;
                }

                function getPadding() {
                    var padding = "0px";
                    if( scope.elementData.hasOwnProperty( 'convert' ) ) {
                        // opted in to convert to percentage
                        if( scope.elementData.convert.padding ) {
                            padding = ResponsiveService.convertPaddingToPercents( scope.elementData.padding, scope.elementData.parentMaxWidth, scope.elementData.aspectRatio );
                        } else {
                            // opted out of converting to percentage - just pass through
                            padding = scope.elementData.padding;
                        }
                    } else {
                        // default when no 'convert' property : convert to percentage
                        padding = ResponsiveService.convertPaddingToPercents( scope.elementData.padding, scope.elementData.parentMaxWidth, scope.elementData.aspectRatio );
                    }
                    return padding;
                }

                function getClassName() {
                    var imageClassName = scope.elementData.className ? scope.elementData.className : "";

                    if( scope.elementData.hasOwnProperty( 'slideIndex' ) && scope.elementData.hasOwnProperty( 'elementIndex' ) ) {
                        imageClassName += " slide-element-" + scope.elementData.slideIndex + "-" + scope.elementData.elementIndex;
                    }
                    return imageClassName;
                }

                function breakPointChanged( newBreakPointTag ) {
                    scope.$evalAsync( setDynamicProperties );
                }

                function setStaticProperties() {
                    scope.altText = scope.elementData.altText ? scope.elementData.altText : "";
                    scope.imgWidth = getWidth();
                    scope.imgClassName = getClassName();
                    angular.element( element ).css( {
                        "padding" : getPadding()
                    } );
                }

                function setDynamicProperties() {
                    scope.imgSrc = getSrc();
                    angular.element( element ).css( {
                        "text-align" : getAlignment()
                    } );
                }

                function init() {
                    if( scope.elementData ) {
                        // normalize data
                        scope.elementData.urls = ResponsiveService.normalizeURLs( scope.elementData.urls );

                        setStaticProperties();

                        setDynamicProperties();

                        // subscribe and set up unsubscribe
                        SignalTowerService.subscribeToSignal( 'signalBreakPointChanged', breakPointChanged );
                        scope.$on( '$destroy', function cleanup() {
                            SignalTowerService.unSubscribeFromSignal( 'signalBreakPointChanged', breakPointChanged );
                        } );

                        // phone home
                        scope.elementData.initialized = true;
                        if( scope.$parent.registerElement ) {
                            scope.$parent.registerElement( scope.elementData, element );
                        }
                    } else {
                        $timeout( init, 500 );
                    }
                }

                scope.$evalAsync( init );
            }
        };
    } );