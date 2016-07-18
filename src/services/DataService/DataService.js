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
            },
            skillInfos : {
                "null" : {
                    "name" : "null",
                    "longName" : "Null",
                    "url" : "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null",
                    "blurb" : "Apparently there was no key, so upon lookup we found (you guessed it!) null.",
                    "clr" : "#999999"
                },
                "as3" : {
                    "name" : "as3",
                    "longName" : "AS3",
                    "url" : "https://en.wikipedia.org/wiki/ActionScript",
                    "blurb" : "ActionScript 3 is an object-oriented programming language and a dialect of ECMAScript.  ECMAScript is a trademarked scripting language specification standardized by Ecma International in the ECMA-262 specification. Well-known implementations of the language, such as JavaScript and ActionScript are widely used for client-side scripting on the Web.",
                    "clr" : "#FE3E10"
                },
                "air" : {
                    "name" : "air",
                    "longName" : "Adobe AIR",
                    "url" : "https://en.wikipedia.org/wiki/Adobe_AIR",
                    "blurb" : "Adobe AIR enables developers to package the same code into native apps for Windows and Mac OS desktops as well as iPhone, iPad, Kindle Fire, Nook Tablet, and other Android devices.  In the case of iOS the code is pre-compiled to allow LLVM to output native ARM assembly code to run on iOS without requiring any runtime.",
                    "clr" : "#FE3E10"
                },
                "angular" : {
                    "name" : "angular",
                    "longName" : "AngularJS",
                    "url" : "https://angularjs.org",
                    "blurb" : "AngularJS is an open-source web application framework mainly maintained by Google and by a community of individual developers and corporations to address many of the challenges encountered in developing single-page applications in a browser.",
                    "clr" : "#E01600"
                },
                "aws" : {
                    "name" : "aws",
                    "longName" : "Amazon Web Services",
                    "url" : "https://aws.amazon.com/what-is-aws/",
                    "blurb" : "Amazon Web Services (AWS) is a secure cloud services platform, offering compute power, database storage, content delivery and other functionality to help businesses scale and grow.",
                    "clr" : "#F99900"
                },
                "bootstrap" : {
                    "name" : "bootstrap",
                    "longName" : "Bootstrap",
                    "url" : "http://getbootstrap.com",
                    "blurb" : "Bootstrap is a free and open-source collection of tools for creating websites and web applications. It contains HTML- and CSS-based design templates for typography, forms, buttons, navigation and other interface components, as well as optional JavaScript extensions.",
                    "clr" : "#5A3F83"
                },
                "css3" : {
                    "name" : "css3",
                    "longName" : "CSS3",
                    "url" : "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3",
                    "blurb" : "CSS3 is the latest evolution of the Cascading Style Sheets language.",
                    "clr" : "#2E6DA4"
                },
                "css" : {
                    "name" : "css",
                    "longName" : "CSS",
                    "url" : "https://developer.mozilla.org/en-US/docs/Web/CSS",
                    "blurb" : "Cascading Style Sheets - all the versions before CSS3.",
                    "clr" : "#2E6DA4"
                },
                "d3" : {
                    "name" : "d3",
                    "longName" : "D3.js",
                    "url" : "http://d3js.org/",
                    "blurb" : "D3.js is a JavaScript library for manipulating documents based on data. D3 helps you bring data to life using HTML, SVG, and CSS.",
                    "clr" : "#FA9D35"
                },
                "facebook" : {
                    "name" : "facebook",
                    "longName" : "Facebook APIs",
                    "url" : "https://developers.facebook.com/docs/javascript/quickstart",
                    "blurb" : "Facebook APIs for web development.",
                    "clr" : "#415E9D"
                },
                "git" : {
                    "name" : "git",
                    "longName" : "Git",
                    "url" : "https://en.wikipedia.org/wiki/Git_(software)",
                    "blurb" : "A distributed revision control system with an emphasis on speed, data integrity, and support for distributed, non-linear workflows.",
                    "clr" : "#F84C16"
                },
                "gulp" : {
                    "name" : "gulp",
                    "longName" : "Gulp.js",
                    "url" : "http://gulpjs.com/",
                    "blurb" : "Gulp is a streaming javascript task runner used to enhance and automate your workflow and particularly building your project.",
                    "clr" : "#D14542"
                },
                "html5" : {
                    "name" : "html5",
                    "longName" : "HTML5",
                    "url" : "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5",
                    "blurb" : "The fifth revision of the HTML standard since the inception of the World Wide Web. HTML5 is supposed to be what HTML should have been in the first place.",
                    "clr" : "#F36518"
                },
                "html" : {
                    "name" : "html",
                    "longName" : "HTML",
                    "url" : "https://en.wikipedia.org/wiki/HTML",
                    "blurb" : "HyperText Markup Language - all the versions before HTML5!",
                    "clr" : "#F36518"
                },
                "jasmine" : {
                    "name" : "jasmine",
                    "longName" : "Jasmine",
                    "url" : "http://jasmine.github.io/",
                    "blurb" : "Jasmine is a behavior-driven development framework for testing JavaScript code.",
                    "clr" : "#8B3F83"
                },
                "jenkins" : {
                    "name" : "jenkins",
                    "longName" : "Jenkins",
                    "url" : "https://wiki.jenkins-ci.org/display/JENKINS/Meet+Jenkins",
                    "blurb" : "Jenkins is an award-winning, cross-platform, continuous integration and continuous delivery application that increases productivity.",
                    "clr" : "#D5362C"
                },
                "jquery" : {
                    "name" : "jquery",
                    "longName" : "jQuery",
                    "url" : "https://jquery.com/",
                    "blurb" : "jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler.",
                    "clr" : "#2E6DA4"
                },
                "js" : {
                    "name" : "javascript",
                    "longName" : "JavaScript",
                    "url" : "https://developer.mozilla.org/en-US/docs/Web/JavaScript/About_JavaScript",
                    "blurb" : "JavaScript is a lightweight, interpreted, object-oriented language with first-class functions that is prototype-based, multi-paradigm scripting language that is dynamic, and supports object-oriented, imperative, and functional programming styles.",
                    "clr" : "#323232"
                },
                "less" : {
                    "name" : "less",
                    "longName" : "LESS",
                    "url" : "http://lesscss.org/",
                    "blurb" : "Less is a CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables, mixins, functions and many other techniques that allow you to make CSS that is more maintainable, themable and extendable.",
                    "clr" : "#404245"
                },
                "linux" : {
                    "name" : "linux",
                    "longName" : "Linux OS",
                    "url" : "https://www.linux.com/",
                    "blurb" : "A Unix-like and mostly POSIX-compliant computer operating system (OS) assembled under the model of free and open-source software development and distribution.",
                    "clr" : "#06406A"
                },
                "mac" : {
                    "name" : "mac os",
                    "longName" : "Mac OS X",
                    "url" : "http://www.apple.com/osx/",
                    "blurb" : "OS X is the operating system that makes it possible to do all the things you do on a Mac.",
                    "clr" : "#333333"
                },
                "photoshop" : {
                    "name" : "photoshop",
                    "longName" : "Adobe Photoshop CC",
                    "url" : "http://www.adobe.com/products/photoshop.html",
                    "blurb" : "Adobe Photoshop is a raster graphics editor developed and published by Adobe Systems for Windows and Mac OS.",
                    "clr" : "#00C7FF"
                },
                "responsive" : {
                    "name" : "responsive",
                    "longName" : "Responsive Web Design",
                    "url" : "http://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/",
                    "blurb" : "Responsive web design is an approach to web design aimed at designing and developing web sites and single page applications to provide an optimal viewing and interaction experience — easy reading and navigation with a minimum of resizing, panning, and scrolling—across a wide range of devices and screen sizes.",
                    "clr" : "#5C2D91"
                },
                "rest" : {
                    "name" : "rest",
                    "longName" : "REST",
                    "url" : "https://en.wikipedia.org/wiki/Representational_state_transfer",
                    "blurb" : "REST (REpresentational State Transfer) is an architectural style, and an approach to communications that is often used in the development of Web services.",
                    "clr" : "#5BC0DE"
                },
                "scrum" : {
                    "name" : "scrum",
                    "longName" : "Scrum",
                    "url" : "https://www.mountaingoatsoftware.com/agile/scrum",
                    "blurb" : "Scrum is an agile way to manage a project, usually software development. Agile software development with Scrum is often perceived as a methodology; but rather than viewing Scrum as methodology, think of it as a framework for managing a process.",
                    "clr" : "#38607C"
                },
                "symbian" : {
                    "name" : "symbian",
                    "longName" : "Symbian OS",
                    "url" : "https://en.wikipedia.org/wiki/Symbian",
                    "blurb" : "The Symbian OS is the operating system developed and sold by Symbian Ltd. The OS was primarily used by Nokia.",
                    "clr" : "#FDAC00"
                },
                "winjs" : {
                    "name" : "winjs",
                    "longName" : "WinJS",
                    "url" : "https://dev.windows.com/en-us/develop/winjs",
                    "blurb" : "WinJS is an open-source JavaScript library that can assist you in building HTML, CSS, and JavaScript applications for the Windows Store with a consistent look and performance across all Windows devices.",
                    "clr" : "#442058"
                },
                "windows" : {
                    "name" : "windows",
                    "longName" : "Microsoft Windows",
                    "url" : "https://www.microsoft.com/en-us/windows",
                    "blurb" : "Windows is Microsoft's operating system.",
                    "clr" : "#0075DA"
                },
                "wordpress" : {
                    "name" : "wordpress",
                    "longName" : "WordPress",
                    "url" : "https://en.wikipedia.org/wiki/WordPress",
                    "blurb" : "WordPress is a free and open-source content management system (CMS) based on PHP and MySQL.",
                    "clr" : "#118BC0"
                },
                "wix" : {
                    "name" : "wix",
                    "longName" : "Windows Installer XML Toolset",
                    "url" : "http://wixtoolset.org/",
                    "blurb" : "The Windows Installer XML Toolset (WiX, pronounced \"wicks\"), is a free software toolset that builds Windows Installer packages from XML. It's a command-line environment that builds MSI and MSM packages.",
                    "clr" : "#979797"
                }
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
            },
            getSkillInfo : function getSkillInfo( key ){
                // console.log( CN + ".getSkillInfo" );
                // console.log( "\tkey :", key );
                return _dataService.skillInfos[ key ];
            }
        };

        // request data immediately ( comment this out if you want to lazy load the data )
        _dataService.getData();

        return dataService;
    } );
