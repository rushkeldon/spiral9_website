
angular.module( 'spiral9.directives.timeline', [
    'angular-scroll-animate',
    'spiral9.directives.badgeLink',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.ResponsiveService'
] )
/**
 * @ngdoc directive
 * @name timeline
 * @restrict AE
 * @description
 * Primary container for displaying a vertical set of timeline events.
 */
    .directive( 'timeline', function timelineDirective( ResponsiveService ) {
        var CN = "timeline";
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'timeline/timeline.tpl.html',
            scope : {
                timelineInfo : "="
            },
            link : function timelineDirectiveLink( scope, element, attrs ){

                scope.toggleDetailLevel = function toggleDetailLevel( eventIndex ){
                    var event = scope.timelineInfo.events[ eventIndex ];
                    var lessDetailElement = element[ 0 ].querySelectorAll( '.timeline-body' )[ eventIndex ];
                    var moreDetailElement = element[ 0 ].querySelectorAll( '.timeline-footer' )[ eventIndex ];

                    if( !event.isMoreDetails ){
                        // grow footer
                        TweenMax.set( moreDetailElement, {
                            height : 'auto'
                        } );
                        TweenMax.from( moreDetailElement, 0.2, {
                            height : 0
                        } );
                        // shrink body
                        TweenMax.to( lessDetailElement, 0.2, {
                            height : 0
                        } );
                        event.isMoreDetails = true;
                    } else {
                        // grow body
                        TweenMax.set( lessDetailElement, {
                            height : 'auto'
                        } );
                        TweenMax.from( lessDetailElement, 0.2, {
                            height : 0
                        } );
                        // shrink footer
                        TweenMax.to( moreDetailElement, 0.2, {
                            height : 0
                        } );
                        event.isMoreDetails = false;
                    }
                };

                scope.animateElementIn = function animateElementIn( elem ) {
                    elem.removeClass( 'hidden' );
                    elem.addClass( 'bounce-in' );
                };

                scope.animateElementOut = function animateElementOut( elem ) {
                    // only hide for desktop
                    if( ResponsiveService.tag() === 'large' ){
                        elem.addClass( 'hidden' );
                        elem.removeClass( 'bounce-in' );
                    }
                };
            }
        };
    } );
