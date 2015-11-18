function trace( msg ) {
    var echo = window.document.getElementById( 'echo' );
    echo.innerHTML += msg + "\n";
}

angular.module( 'demoApp', [] )
    .controller( 'DemoController', function( $scope ) {
        $scope.penName = "ng-starter";
    } )
    .directive( 'colorPulse', function colorPulse() {
        function convertToCamel( dashedName ) {
            if( dashedName ) {
                return dashedName.replace( /-([a-z])/g, function( g ) { return g[ 1 ].toUpperCase(); } );
            }
            function getAdjustedHex( hex, lum ) {
                // validate hex string
                hex = String( hex ).replace( /[^0-9a-f]/gi, '' );
                if( hex.length < 6 ) {
                    hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ];
                }
                lum = lum || 0;

                // convert to decimal and change luminosity
                var rgb = "#", c, i;
                for( i = 0; i < 3; i++ ) {
                    c = parseInt( hex.substr( i * 2, 2 ), 16 );
                    c = Math.round( Math.min( Math.max( 0, c + (c * lum) ), 255 ) ).toString( 16 );
                    rgb += ("00" + c).substr( c.length );
                }

                return rgb;
            }
        }

        return {
            restrict : "A",
            replace : false,
            link : function colorPulseLink( scope, element, attrs ) {
                scope.elementClicked = function elementClicked( e ) {
                    if( e.target === element[ 0 ] ) {

                    }
                };

                element.bind( 'click', scope.elementClicked );
            }
        };
    } );
