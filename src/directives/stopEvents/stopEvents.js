
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
angular.module( 'spiral9.directives.stopEvents',
    [] )

/**
 * @ngdoc directive
 * @name navBar
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'stopEvents', function stopEventsDirective() {
        return {
            restrict : 'A',
            link : function stopEventsDirectiveLink( scope, element, attr ) {
                var CN = "stopEventsDirective";
                var eventNames = attr.stopEvents.split( ' ' );

                function relayTouchEvent( e ){
                    console.log( CN + ".relayTouchEvent" );
                    scope.$event = e;
                    scope.$eval( attr.ngClick );
                    e.stopPropagation();
                }

                function stopPropagation( e ){
                    console.log( CN + ".stopPropagation" );
                    console.log( "\te.type :", e.type );
                    e.stopPropagation();
                }

                function cleanup(){
                    angular.forEach( eventNames, function deRegisterEvent( eventName ){
                        if( eventName === 'touchend' && attr.ngClick  ){
                            element.off( eventName, relayTouchEvent );
                        } else {
                            element.off( eventName, stopPropagation );
                        }
                    } );
                    relayTouchEvent = null;
                    stopPropagation = null;
                }

                angular.forEach( eventNames, function registerEvent( eventName ){
                    if( eventName === 'touchend' && attr.ngClick ){
                        element.on( eventName, relayTouchEvent );
                    } else {
                        element.on( eventName, stopPropagation );
                    }
                } );

                scope.$on( '$destroy', cleanup );
            }
        };
    } );
