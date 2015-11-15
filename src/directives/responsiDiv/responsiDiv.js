angular.module( 'spiral9.directives.responsiDiv', [
    'spiral9.services.ResponsiveService',
    'spiral9.filters.makeSafeHTML'
] )
    .directive( 'responsiDiv', function responsiDivDirective( ResponsiveService ) {
        var CN = "responsiDivDirective";
        var defaultColor = "#FFFFFF";
        return {
            restrict : 'E',
            replace : true,
            scope : {
                elementData : '='
            },
            templateUrl : 'responsiDiv/responsiDiv.tpl.html',
            link : function( scope, element, attrs ) {
                scope.colorRule = "";
                scope.alignRule = "";
                scope.paddingRule = "";

                scope.getAlignRule = function getAlignRule() {
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
                    return "text-align:" + align + "; ";
                };

                function getClassName() {
                    var divClassName = scope.elementData.className ? scope.elementData.className : "";

                    if( scope.elementData.hasOwnProperty( 'slideIndex' ) && scope.elementData.hasOwnProperty( 'elementIndex' ) ) {
                        divClassName += " slide-element-" + scope.elementData.slideIndex + "-" + scope.elementData.elementIndex;
                    }
                    return divClassName;
                }

                function init() {

                    if( scope.elementData.padding ) {
                        scope.paddingRule = "padding:" + ResponsiveService.convertPaddingToPercents( scope.elementData.padding,
                                scope.elementData.parentMaxWidth,
                                scope.elementData.aspectRatio ) + "; ";
                    }

                    if( scope.elementData.color ) {
                        scope.colorRule = "color:" + scope.elementData.color + "; ";
                    }

                    scope.divClassName = getClassName();

                    scope.elementData.initialized = true;
                    if( scope.$parent.registerElement ) {
                        scope.$parent.registerElement( scope.elementData, element );
                    }
                }

                scope.$evalAsync( init );
            }
        };
    } );