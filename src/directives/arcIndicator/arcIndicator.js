/*
 * arcIndicator.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.arcIndicator
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.arcIndicator', [
    // 'spiral9.services.DataService',
] )

/**
 * @ngdoc directive
 * @name arcIndicator
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'arcIndicator', function arcIndicatorDirective( $document, $timeout, $window ) {
        var CN = "indicatorDirective";
        return {
            restrict : 'E',
            replace : true,
            transclude : true,
            controller : function arcIndicatorController( $scope, $element, $attrs ) {
                var diff = ( $scope.expected - $scope.actual ) / $scope.expected;
                var canvasWidth = parseInt(window.getComputedStyle( $element[ 0 ], null ).getPropertyValue( 'width' ), 10 );
                var canvasHeight = parseInt(window.getComputedStyle( $element[ 0 ], null ).getPropertyValue( 'height' ), 10 );
                var circle = $element.find( 'circle' )[ 0 ];
                var radius = circle.r.baseVal.value;

                $scope.radius = radius;
                $scope.canvasWidth = canvasWidth;
                $scope.canvasHeight = canvasHeight;
                $scope.spacing = 0.9;
                $scope.paused = $attrs.hasOwnProperty( 'paused' );

                function convertToRads( angle ) {
                    return angle * (Math.PI / 180);
                }

                function findDegress( percentage ) {
                    return 360 * percentage;
                }

                function getArcValues( index, radius, spacing ) {
                    return {
                        innerRadius : (index + spacing) * radius,
                        outerRadius : (index + spacing) * radius
                    };
                }

                $scope.buildArc = function() {
                    return d3
                        .svg
                        .arc()
                        .innerRadius( function( d ) {
                            return d.innerRadius;
                        } )
                        .outerRadius( function( d ) {
                            return d.outerRadius;
                        } )
                        .startAngle( 0 )
                        .endAngle( function( d ) {
                            return d.endAngle;
                        } );
                };

                $scope.findPathColor = function() {
                    var actualPercent = $scope.actual * 100;

                    if( actualPercent >= 100 ){
                        return 'percent100';
                    }

                    for( var i=90; i > 0; i -= 10 ){
                        if( actualPercent > i ){
                            return 'percent' + i;
                        }
                    }

                    return 'percent10';
                };

                $scope.getArcInfo = function( index, value, radius, spacing ) {
                    var end = findDegress( value ),
                        arcValues = getArcValues( index, radius, spacing );
                    return {
                        innerRadius : arcValues.innerRadius,
                        outerRadius : arcValues.outerRadius,
                        endAngle : convertToRads( end ),
                        startAngle : 0
                    };
                };

                $scope.tweenArc = function tweenArc( b, arc ) {
                    // console.log( CN + '.tweenArc' );
                    return function( a ) {
                        var i = d3.interpolate( a, b );
                        for( var key in b ) {
                            if( b[ key ] ){
                                a[ key ] = b[ key ];
                            }
                        }
                        return function( t ) {
                            return arc( i( t ) );
                        };
                    };
                };

                $scope.play = function play(){
                    $scope.tweenInnerArc();
                    $scope.tweenOuterArc();
                    $scope.play = function(){};
                };

            },
            templateUrl : 'arcIndicator/arcIndicator.tpl.html',
            link : function( scope, element, attrs ) {
                scope.actual_formatted = ( scope.actual * 100 ).toFixed( 0 );
            },
            scope : {
                actual : '@',
                expected : '@'
            }
        };
    } )

    .directive( 'pathGroup', function pathGroupDirective() {
        var CN = "pathGroupDirective";
        return {
            requires : '^arcIndicator',
            link : function( scope, element, attrs, ctrl ) {
                element
                    .attr(
                    "transform",
                    "translate(" + scope.canvasWidth / 2 + "," + scope.canvasHeight / 2 + ")"
                );
            }
        };
    } )

    .directive( 'innerPath', function innerPathDirective() {
        var CN = "innerPathDirective";
        return {
            restrict : 'A',
            transclude : true,
            requires : '^pathGroup',
            link : function( scope, element, attrs, ctrl ) {
                scope.innerArc = d3.select( element[ 0 ] );
                var arcObject = scope.buildArc();
                var arc = scope.getArcInfo( 1.1, scope.expected, scope.radius, 0.05 );
                var end = arc.endAngle;

                arc.endAngle = 0;

                scope.tweenInnerArc = function tweenInnerArc(){
                    // console.log( CN + '.tweenInnerArc' );
                    if( !scope.innerArc ){ console.log( 'no innerArc' ); return; }
                    scope.innerArc
                        .datum( arc )
                        .attr( 'd', arcObject )
                        .transition()
                        .delay( 100 )
                        .duration( 2000 )
                        .attrTween( "d", scope.tweenArc( {
                            endAngle : end
                        }, arcObject ) );
                };
            }
        };
    } )

    .directive( 'outerPath', function outerPathDirective() {
        var CN = "outerPathDirective";
        return {
            restrict : 'A',
            transclude : true,
            requires : '^pathGroup',
            link : function( scope, element, attrs ) {
                scope.outerArc = d3.select( element[ 0 ] );
                var arcObject = scope.buildArc();
                var arc = scope.getArcInfo( 1.2, scope.actual, scope.radius, 0.1 );
                var end = arc.endAngle;

                arc.endAngle = 0;
                element.addClass( scope.findPathColor() );

                scope.tweenOuterArc = function tweenOuterArc() {
                    // console.log( CN + '.tweenOuterArc - noop' );
                    if( !scope.outerArc ){ console.log( 'no outerArc' ); return; }

                    scope.outerArc
                        .datum( arc )
                        .attr( 'd', arcObject )
                        .transition()
                        .delay( 200 )
                        .duration( 1500 )
                        .ease( 'bounce' )
                        .attrTween( 'd', scope.tweenArc( { endAngle : end }, arcObject ) );
                    /**/
                };

                if( !scope.paused ){
                    scope.tweenOuterArc();
                }
            }
        };
    } );
