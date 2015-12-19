/*
 * portfolioPanel.js
 *
 * Created: Friday, November 6, 2015
 * (c) Copyright 2015 Spiral9 Inc. - All Rights Reserved
 * This is unpublished proprietary source code of Spiral9 Inc.
 * The copyright notice above does not evidence any actual or intended
 * publication of such source code.
 */

/**
 * @ngdoc overview
 * @name directives.portfolioPanel
 * @description An empty module description. Please fill in a high level description of this module.
 */
angular.module( 'spiral9.directives.portfolioPanel', [
        'ngTouch',
        'spiral9.directives.lightbox',
        'spiral9.filters.makeSafeHTML',
        'spiral9.services.DataService',
        'spiral9.services.SignalTowerService'
    ] )

    /**
     * @ngdoc directive
     * @name portfolioPanel
     * @restrict E
     * @element ANY
     * @description An empty directive description. Please fill in a high level description of this directive.
     */
    .directive( 'portfolioPanel', function portfolioPanelDirective( DataService, SignalTowerService ) {
        var CN = 'portfolioPanelDirective';
        return {
            restrict : 'E',
            replace : true,
            templateUrl : 'portfolioPanel/portfolioPanel.tpl.html',
            scope : {},
            link : function portfolioPanelDirectiveLink( scope, element, attrs ) {
                scope.portfolioInfo = null;
                scope.currentFilterTag = {
                    "icon" : "",
                    "tag" : "all"
                };

                scope.outro = function outro() {
                    if( scope.projectsToOutro.length ) {
                        angular.forEach( scope.projectsToOutro, function outroProject( projectObject, projectIndex ){
                            TweenMax.to( projectObject.element, 0.3, {
                                force3D : true,
                                ease : Power3.easeOut,
                                autoAlpha : 0.2,
                                scaleX : 0.8,
                                scaleY : 0.8,
                                onComplete : function outroComplete(){
                                    projectObject.project.visible = false;
                                    projectObject.element.style.pointerEvents = 'none';
                                    if( projectIndex === scope.projectsToOutro.length - 1 ){
                                        scope.projectsToOutro = [];
                                    }
                                }
                            } );
                        } );
                    }
                };

                scope.intro = function intro() {
                    if( scope.projectsToIntro.length ) {
                        angular.forEach( scope.projectsToIntro, function introProject( projectObject, projectIndex ){
                            TweenMax.to( projectObject.element, 0.3, {
                                force3D : true,
                                ease: Power3.easeOut,
                                autoAlpha : 1,
                                scaleX : 1,
                                scaleY : 1,
                                onComplete : function(){
                                    projectObject.project.visible = true;
                                    projectObject.element.style.pointerEvents = 'auto';
                                    if( projectIndex === scope.projectsToIntro.length - 1 ) {
                                        scope.projectsToIntro = [];
                                    }
                                }
                            } );
                        } );
                    }
                };

                scope.filterByTag = function filterByTag( e, filterTag ) {
                    scope.projectsToIntro = [];
                    scope.projectsToOutro = [];
                    scope.currentFilterTag = filterTag;

                    if( !scope.projectTileElements ) {
                        scope.projectTileElements = element[ 0 ].querySelectorAll( '.project-tile' );
                    }

                    angular.forEach( scope.portfolioInfo.projects, function scanProjectAndTile( project, projectIndex ) {
                        project.visible = project.hasOwnProperty( 'visible' ) ? project.visible : true;

                        switch( true ) {
                            case ( project.tags.indexOf( scope.currentFilterTag.tag ) !== -1 && !project.visible ) :
                                scope.projectsToIntro.push( { element : scope.projectTileElements[ projectIndex ], project : project } );
                                break;
                            case ( project.tags.indexOf( scope.currentFilterTag.tag ) === -1 && project.visible ) :
                                scope.projectsToOutro.push( { element : scope.projectTileElements[ projectIndex ], project : project } );
                                break;
                        }
                    } );

                    scope.outro();
                    scope.intro();
                };

                scope.projectClicked = function projectClicked( project ) {

                };

                scope.viewProjectImages = function viewProjectImages( project ) {
                    SignalTowerService.dispatchSignal( 'signalLightboxImages', project.imageInfos );
                };

                scope.getData = function getData() {
                    DataService.getDataByName( 'portfolioInfo' )
                        .then(
                            function dataReceived( portfolioInfo ) {
                                scope.portfolioInfo = portfolioInfo;
                                scope.currentFilterTag = portfolioInfo.filterTags[ 0 ];
                            },
                            function dataFailed( error ) {
                                console.error( CN + ".dataFailed", error );
                            }
                        );
                };

                scope.init = function init(){
                    scope.getData();
                };

                scope.$evalAsync( scope.init );
            }
        };
    } );
