/*
 * skillTile.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.skillTile
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.skillTile', [
    'spiral9.directives.arcIndicator',
    'spiral9.filters.makeSafeHTML'
] )

/**
 * @ngdoc directive
 * @name skillTile
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'skillTile', function skillTileDirective( $document, $window ) {
        var CN = 'skillTileDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'skillTile/skillTile.tpl.html',
            scope : {
                skillInfo : "="
            },
            link : function skillTileDirectiveLink( scope, element, attrs ) {
                // console.log( CN + " instantiated." );

                scope.init = function init(){
                    $document.bind( 'scroll', scope.documentScrolled );

                };

                scope.documentScrolled = function documentScrolled(){
                    var bottom = element[ 0 ].getBoundingClientRect().bottom;

                    if( $window.innerHeight >= bottom || $window.pageYOffset >= bottom  ){
                        $document.unbind( 'scroll', scope.documentScrolled );
                        angular.element( element[ 0 ].querySelector( '.arc-indicator' ) ).isolateScope().play();
                    }
                };

                scope.$evalAsync( scope.init );
            }
        };
    } );
