
angular.module( 'spiral9.directives.timeline', [
    'angular-scroll-animate',
    'spiral9.filters.makeSafeHTML'
] )
/**
 * @ngdoc directive
 * @name timeline
 * @restrict AE
 * @description
 * Primary container for displaying a vertical set of timeline events.
 */
    .directive( 'timeline', function timelineDirective() {
        var CN = "timeline";
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'timeline/timeline.tpl.html',
            scope : {
                timelineInfo : "="
            },
            link : function timelineDirectiveLink( scope, element, attrs ){
                var exampleTimlineInfo = {
                    "title" : "WORK EXPERIENCE",
                    "subTitle" : "Some of my experiences creating experiences",
                    "events" : [
                        {
                            "badgeClass": "danger",
                            "iconName" : "exclamation-sign",
                            "title" : "New Event",
                            "when" : "just a moment ago",
                            "headerHTML" : "Header Here",
                            "bodyHTML" : "<p>Hmmm, addEventToTimeline was called with no eventInfo!<br/>So you have gotten this default event.</p>",
                            "footerHTML" : "This is the footer."
                        }
                    ]
                };

                scope.addEventToTimeline = function addEventToTimeline( eventInfo ) {
                    eventInfo = eventInfo ? eventInfo :  {
                        badgeClass: 'danger',
                        badgeIconClass: 'glyphicon-exclamation-sign',
                        title: 'New Event',
                        when: 'just a moment ago',
                        contentHtml: '<p>Hmmm, addEventToTimeline was called with no eventInfo!<br/>So you have gotten this default event.</p>'
                    };

                    scope.timelineInfo.events.push( eventInfo );
                };

                scope.animateElementIn = function animateElementIn( elem ) {
                    elem.removeClass( 'hidden' );
                    elem.addClass( 'bounce-in' );
                };

                scope.animateElementOut = function animateElementOut( elem ) {
                    elem.addClass( 'hidden' );
                    elem.removeClass( 'bounce-in' );
                };
            }
        };
    } );
