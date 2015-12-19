/*
 * badgeLink.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.badgeLink
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.badgeLink', [
    'spiral9.services.DataService'
] )

/**
 * @ngdoc directive
 * @name badgeLink
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'badgeLink', function badgeLinkDirective( DataService ) {
        var CN = 'badgeLinkDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'badgeLink/badgeLink.tpl.html',
            scope : {
                key : "@"
            },
            link : function badgeLinkDirectiveLink( scope, element, attrs ) {
                // console.log( CN + " instantiated." );

                var retryCount = 0;
                var retryLimit = 10;
                var retryDelay = 300;

                scope.fgColor = "#FFFFFF";

                scope.badgeLinkInfo = null;

                scope.badgeClicked = function badgeClicked( e ){
                    scope.getColors();
                    scope.tweenColors();
                    if( scope.badgeLinkInfo.url ) {
                        window.open( scope.badgeLinkInfo.url, "_blank" );
                    }
                };

                scope.badgeHoveredOver = function badgeHoveredOver( e ){
                    scope.getColors();
                    if( e.target === element[ 0 ] ){
                        scope.tweenColors();
                    }
                };

                scope.getColors = function getColors(){
                    if( !scope.bgColor ){
                        scope.bgColor = window.getComputedStyle( element[ 0 ], null ).getPropertyValue( 'background-color' );
                        scope.color = window.getComputedStyle( element[ 0 ], null ).getPropertyValue( 'color' );
                    }
                };

                scope.tweenColors = function tweenColors(){
                    scope.tween = TweenMax.to( element[ 0 ], 0.3, {
                        backgroundColor : scope.badgeLinkInfo.clr,
                        color : scope.fgColor
                    } );
                };

                scope.restoreColors = function restoreColors(){
                    TweenMax.to( element[ 0 ], 0.3, {
                        backgroundColor : scope.bgColor,
                        color : scope.color
                    } );
                };

                scope.badgeHoveredOut = function badgeHoveredOut( e ){
                    if( e.target === element[ 0 ] ){
                        scope.restoreColors();
                    }
                };

                scope.getData = function getData(){
                    // console.log( CN + ".getData" );

                    if( !scope.key ){
                        if( retryCount < retryLimit ) {
                            retryCount++;
                            window.setTimeout( scope.getData, retryDelay );
                            return;
                        } else {
                            console.error( CN + " timed out looking for scope.key and is now assigning 'null' to scope.key.  Try giving a 'data-key' attribute to the <badge-link> element." );
                            scope.key = "null";
                        }
                    }

                    scope.badgeLinkInfo = DataService.getSkillInfo( scope.key );
                };

                scope.$evalAsync( scope.getData );
            }
        };
    } );
