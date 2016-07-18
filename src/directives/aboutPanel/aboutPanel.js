/*
 * aboutPanel.js
 *
 * The MIT License (MIT)
 *
 */

/**
 * @ngdoc overview
 * @name directives.aboutPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.aboutPanel', [
    'ngTouch',
    'spiral9.filters.makeSafeHTML',
    'spiral9.services.DataService'
] )

/**
 * @ngdoc directive
 * @name aboutPanel
 * @restrict E
 * @element ANY
 * @description An empty directive description. Please fill in a high level description of this directive.
 */
    .directive( 'aboutPanel', function aboutPanelDirective( DataService ) {
        var CN = 'aboutPanelDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'aboutPanel/aboutPanel.tpl.html',
            scope : {},
            link : function aboutPanelDirectiveLink( scope, element, attrs ) {
                // console.log( CN + " instantiated." );

                scope.aboutInfo = null;
                scope.isMoreInfoDisplayed = false;
                scope.moreInfoElement = null;

                scope.buttonClicked = function buttonClicked( e ){
                    var url = scope.aboutInfo.btnURL;
                    if( url ) {
                        window.open( url, "_self" );
                    }
                };

                scope.toggleMoreInfo = function toggleMoreInfo(){
                    if( !scope.moreInfoElement ){
                        scope.moreInfoElement = element[ 0 ].querySelector( '.more-info' );
                    }
                    if( !scope.isMoreInfoDisplayed ){
                        TweenMax.set( scope.moreInfoElement, {
                            height : 'auto'
                        } );
                        TweenMax.from( scope.moreInfoElement, 0.2, {
                            height : 0
                        } );
                        scope.isMoreInfoDisplayed = true;
                    } else {
                        TweenMax.to( scope.moreInfoElement, 0.2, {
                            height : 0
                        } );
                        scope.isMoreInfoDisplayed = false;
                    }
                };

                scope.getData = function getData(){
                    // console.log( CN + ".getData" );
                    DataService.getAboutInfo()
                        .then(
                            function dataReceived( aboutInfo ) {
                                scope.aboutInfo = aboutInfo;
                            },
                            function dataFailed( error ){
                                console.error( CN + ".dataFailed", error );
                            }
                        );
                };

                scope.$evalAsync( scope.getData );
            }
        };
    } );
