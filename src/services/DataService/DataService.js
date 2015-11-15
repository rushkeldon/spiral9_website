angular.module( 'spiral9.services.DataService', [] )
    .service( 'DataService', function DataService( $http, $q ) {
        var CN = "DataService";

        // private service
        var _dataService = {
            isDataPending : false,
            siteData : null,
            deferred : $q.defer(),
            pendingProps : [],
            getData : function getData( propName ) {
                switch( true ){
                    // already have data
                    case ( _dataService.siteData !== null ) :
                        if( propName ){
                            return _dataService.resolveProp( propName );
                        } else {
                            return _dataService.deferred.promise;
                        }
                        break;
                    // data has been requested - pending
                    case ( _dataService.isDataPending ) :
                        if( propName ){
                            return _dataService.deferProp( propName );
                        } else {
                            return _dataService.deferred.promise;
                        }
                        break;
                    // need to request data
                    case ( !_dataService.isDataPending ) :
                        var promise = propName ? _dataService.deferProp( propName ) : _dataService.deferred.promise;
                        $http.get( 'index.json' )
                            .then(
                            function dataReceived( response ) {
                                _dataService.siteData = response.data;
                                _dataService.processPendingProps( true );
                                _dataService.deferred.resolve( _dataService.siteData );
                            },
                            function dataFailed( error ) {
                                _dataService.processPendingProps( false, error );
                                _dataService.deferred.reject( error );
                            }
                        );
                        return promise;
                        // break;
                }
            },
            deferProp : function deferProp( propName ){
                var deferred = $q.defer();
                _dataService.pendingProps.push( { deferred : deferred, propName : propName } );
                return deferred.promise;
            },
            resolveProp : function resolveProp( propName ){
                var deferred = $q.defer();
                deferred.resolve( _dataService.siteData[ propName ] );
                return deferred.promise;
            },
            processPendingProps : function processPendingProps( success, error ){
                if( success ){
                    angular.forEach( _dataService.pendingProps, function resolvePromise( pendingProp ){
                        pendingProp.deferred.resolve( _dataService.siteData[ pendingProp.propName ] );
                    } );
                } else {
                    angular.forEach( _dataService.pendingProps, function rejectPromise( pendingProp ){
                        pendingProp.deferred.reject( error );
                    } );
                }
                _dataService.pendingProps = [];
            }
        };

        // exported public service
        var dataService = {
            getSlideShowInfo : function getSlideShowInfo(){
               // console.log( CN + ".getSlideShowInfo" );
                return _dataService.getData( 'slideShowInfo' );
            },
            getTitleInfo : function getTitleInfo(){
               // console.log( CN + ".getTitleInfo" );
                return _dataService.getData( 'titleInfo' );
            },
            getNavInfo : function getNavInfo(){
               // console.log( CN + ".getNavInfo" );
                return _dataService.getData( 'navInfo' );
            },
            getAboutInfo : function getAboutInfo(){
               // console.log( CN + ".getAboutInfo" );
                return _dataService.getData( 'aboutInfo' );
            },
            getSkillsInfo : function getSkillsInfo(){
               // console.log(CN + ".getSkillsInfo" );
                return _dataService.getData( 'skillsInfo' );
            },
            getWorkInfo : function getWorkInfo(){
                return _dataService.getData( 'workInfo' );
            },
            getContactInfo : function getContactInfo(){
               // console.log( CN + ".getContactInfo" );
                return _dataService.getData( 'contactInfo' );
            },
            getDataByName : function getDataByName( propertyName ){
                return _dataService.getData( propertyName );
            },
            getSiteData : function getSiteData(){
               // console.log( CN + ".getSiteData" );
                return _dataService.getData();
            }
        };

        // request data immediately ( comment this out if you want to lazy load the data )
        _dataService.getData();

        return dataService;
    } );
