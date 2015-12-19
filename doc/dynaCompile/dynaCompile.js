/*
 * titlePanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.titlePanel
 * @description An empty module description. Please fill in a high level description of this module.

 */
angular.module( 'spiral9.directives.dynaCompile',
[] )
    /*
        <div ng-controller="MyController">
            <div dynaCompile="html"></div>
        </div>
        <!-- in this case MyController will be used as the scope in the $compile statement below -->
     */
    .directive( 'dynaCompile', function dynaCompileDirective( $compile ) {
        CN = "dynaCompileDirective";
        return {
            restrict : 'A',
            replace : true,
            link : function dynaCompileLink( scope, element, attrs ) {
                console.log( CN + ".dynaCompileLink" );
                console.log( "\tattrs :", attrs );
                scope.$watch( attrs.dynaCompile, function compileDynamic( html ) {
                    console.log( CN + ".compileDynamic" );
                    element.html( html );
                    $compile( element.contents() )( scope );
                } );
            }
        };
    } );
