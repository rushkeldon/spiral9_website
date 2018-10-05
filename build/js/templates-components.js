!function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("aboutPanel/aboutPanel.tpl.html",'<section id="about" class="about-panel" ng-show="aboutInfo">\n    <div class="title-area">\n        <h2 ng-bind="aboutInfo.title"></h2>\n\n        <p ng-bind="aboutInfo.subTitle"></p>\n    </div>\n    <div class="body-area">\n        <div class="text-area">\n            <h3 ng-bind="aboutInfo.myName"></h3>\n            <h4 ng-bind="aboutInfo.myRole"></h4>\n            <hr ng-repeat-start="blurb in aboutInfo.htmlBlurbs" ng-if="false">\n            <p ng-bind-html="blurb | makeSafeHTML"></p>\n            <hr ng-repeat-end ng-if="false">\n            <div class="more-info-toggle" ng-if="aboutInfo.moreInfo">\n                <a href="javascript:;" ng-if="!isMoreInfoDisplayed" ng-click="toggleMoreInfo()"><i class="glyphicon glyphicon-eye-open"></i>{{aboutInfo.moreInfo.labelSeeMore}}</a>\n                <a href="javascript:;" ng-if="isMoreInfoDisplayed" ng-click="toggleMoreInfo()"><i class="glyphicon glyphicon-eye-close"></i>{{aboutInfo.moreInfo.labelSeeLess}}</a>\n            </div>\n            <div class="more-info" ng-if="aboutInfo.moreInfo">\n                <hr ng-repeat-start="blurb in aboutInfo.moreInfo.htmlBlurbs" ng-if="false">\n                <p ng-bind-html="blurb | makeSafeHTML"></p>\n                <hr ng-repeat-end ng-if="false">\n            </div>\n            <button class="btn" ng-bind="aboutInfo.btnLabel" ng-click="buttonClicked($event)"></button>\n        </div>\n        <div class="img-box">\n            <img class="img-circle" ng-src="{{aboutInfo.myImgURL}}" alt="{{aboutInfo.myName}}">\n        </div>\n    </div>\n</section>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("contactPanel/contactPanel.tpl.html",'<section id="contact" class="contact-panel" ng-show="contactInfo">\n    <div class="title-area">\n        <h2 ng-bind="contactInfo.title"></h2>\n        <p ng-bind-html="contactInfo.subTitle | makeSafeHTML"></p>\n    </div>\n    <div class="body-area">\n        <div class="contact-name"\n             ng-if="contactInfo.name"\n             ng-bind="contactInfo.name">\n        </div>\n        <div class="contact-address"\n             ng-if="contactInfo.address">\n            <span class="glyphicons glyphicons-map"></span>\n            {{contactInfo.address}}\n        </div>\n        <div class="contact-email"\n             ng-if="contactInfo.email">\n            <a href="mailto:{{contactInfo.email}}?subject=interesting%20project&body=Hello%20{{contactInfo.name.split( \' \' )[ 0 ]}},%0D%0DI%20am%20writing%20to%20you%20about%20a%20project%20you%20might%20be%20interested%20in.%0D%0D"><span class="glyphicons glyphicons-envelope"></span>{{contactInfo.email}}</a>\n        </div>\n        <div class="contact-phone"\n             ng-if="contactInfo.phone">\n            <a href="tel:{{contactInfo.phone}}"><span class="glyphicons glyphicons-iphone"></span>{{contactInfo.phone}}</a>\n        </div>\n        <div class="contact-url"\n             ng-if="contactInfo.url">\n            <a href="{{contactInfo.url}}"><span class="glyphicons glyphicons-link"></span>{{contactInfo.url}}</a>\n        </div>\n        <div class="contact-linkedin-url"\n             ng-if="contactInfo.linkedInURL">\n            <a href="{{contactInfo.linkedInURL}}"><span class="social social-linked-in"></span>{{contactInfo.linkedInURL}}</a>\n        </div>\n    </div>\n    <div class="contact-footer"\n         ng-if="contactInfo.footerHTML"\n         ng-bind-html="contactInfo.footerHTML | makeSafeHTML"></div>\n</section>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("navBar/navBar.tpl.html",'<nav class="nav-bar" ng-show="navInfo">\n    <!-- <span ng-bind="echo"></span> -->\n    <button ng-click="toggleNavMenu( $event )">\n        <label ng-bind="navInfo.label"></label>\n        <i class="fa fa-bars"></i>\n    </button>\n    <ul class="nav-menu">\n        <li class="nav-item"\n            ng-show="shouldMenuDisplay"\n            ng-repeat="navItem in navInfo.navItems"\n            ng-class="{ \'active\' : currentSelector === navItem.selector }"\n            ng-bind="navItem.label"\n            ng-click="navItemClicked( $event, navItem.selector, navItem.bookmark )"></li>\n    </ul>\n</nav>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("badgeLink/badgeLink.tpl.html",'<div class="badge-link"\n     ng-show="badgeLinkInfo"\n     ng-bind="badgeLinkInfo.name"\n     ng-click="badgeClicked()"\n     ng-attr-title="{{badgeLinkInfo.longName}}"\n     ng-mouseenter="badgeHoveredOver( $event )"\n     ng-mouseleave="badgeHoveredOut( $event )">\n</div>\n\n\n\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("lightbox/lightbox.tpl.html",'<div class="dark-room" ng-show="readyToDisplay">\n    <div class="light-frame">\n        <div class="touch-pane" ng-swipe-left="nextImage()" ng-swipe-right="prevImage()"></div>\n        <div class="light-box">\n            <img/>\n            <div class="signpost"></div>\n            <div class="image-border"></div>\n            <button class="btn-prev fa fa-chevron-left"></button>\n            <button class="btn-next fa fa-chevron-right"></button>\n            <div class="caption-pane"></div>\n        </div>\n    </div>\n    <div class="light-frame">\n        <div class="touch-pane" ng-swipe-left="nextImage()" ng-swipe-right="prevImage()"></div>\n        <div class="light-box">\n            <img/>\n            <div class="signpost"></div>\n            <div class="image-border"></div>\n            <button class="btn-prev fa fa-chevron-left"></button>\n            <button class="btn-next fa fa-chevron-right"></button>\n            <div class="caption-pane"></div>\n        </div>\n    </div>\n</div>\n\n\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("portfolioPanel/portfolioPanel.tpl.html",'<section id="portfolio" class="portfolio-panel" ng-show="portfolioInfo">\n    <div class="title-area">\n        <h2 ng-bind="portfolioInfo.title"></h2>\n        <p ng-bind="portfolioInfo.subTitle"></p>\n    </div>\n    <div class="body-area">\n        <div class="filter-bar">\n            <div class="filter-btn"\n                 ng-repeat="filterTag in portfolioInfo.filterTags"\n                 ng-class="{current : currentFilterTag === filterTag}"\n                 ng-click="filterByTag( $event, filterTag )">\n                <span ng-if="filterTag.icon" class="glyphicons glyphicons-{{filterTag.icon}}"></span>\n                <span ng-if="filterTag.icon">&nbsp;</span>\n                <span ng-bind="filterTag.tag" ></span>\n            </div>\n        </div>\n        <div class="projects-panel" ng-show="portfolioInfo.projects && portfolioInfo.projects.length">\n            <div class="project-tile"\n                 ng-repeat="project in portfolioInfo.projects"\n                 ng-click="projectClicked( $event, project )"\n                 style="background-image:url({{project.thumb}})">\n                <!-- <img ng-src="{{project.thumb}}"> -->\n                <div class="hover-pane">\n                    <h1 ng-if="project.label" ng-bind="project.label"></h1>\n                    <a class="btn-view"\n                       ng-click="viewProjectImages( project )"\n                       title="View Images">\n                        <span class="glyphicons glyphicons-picture"></span>\n                    </a>\n                    <a class="btn-link"\n                       href="{{project.link}}"\n                       title="Visit Project Site"\n                       target="_blank">\n                        <span class="glyphicons glyphicons-link"></span>\n                    </a>\n                </div>\n            </div>\n            <lightbox></lightbox>\n        </div>\n    </div>\n</section>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("skillTile/skillTile.tpl.html",'<div class="skill-tile" ng-show="skillInfo">\n    <div class="skill-meter">\n        <arc-indicator class="arc-indicator" data-paused data-expected="1" data-actual="{{skillInfo.percent / 100}}"></arc-indicator>\n    </div>\n    <h4 ng-bind="skillInfo.label"></h4>\n    <p ng-bind-html="skillInfo.blurb | makeSafeHTML"></p>\n</div>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("skillsPanel/skillsPanel.tpl.html",'<section id="skills" class="skills-panel" ng-show="skillsInfo">\n    <div class="title-area">\n        <h2 ng-bind="skillsInfo.title"></h2>\n        <p ng-bind="skillsInfo.subTitle"></p>\n    </div>\n    <div class="body-area">\n        <skill-tile ng-repeat="skillInfo in skillsInfo.skills" data-skill-info="skillInfo"></skill-tile>\n    </div>\n</section>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("slidePanel/slidePanel.tpl.html",'<div id="slide" class="slide-panel" ng-show="slideShowInfo">\n    <div class="shadow-overlay"></div>\n    <div ng-repeat="imgURL in slideShowInfo.imgURLs"\n         class="slide-img slide-img-{{$index}}"\n'+"         ng-style=\"{ 'background-image' : 'url(' + imgURL + ')' }\"></div>\n</div>\n")}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("responsiDiv/responsiDiv.tpl.html",'<div style="{{colorRule}}{{getAlignRule()}}{{paddingRule}}" ng-class="divClassName" ng-bind-html="elementData.markup | makeSafeHTML"></div>\n\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("responsiveImage/responsiveImage.tpl.html",'<div ng-class="imgClassName" >\n    <img class="responsive-image" ng-src="{{imgSrc}}" alt="{{altText}}" width="{{imgWidth}}"/>\n</div>')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("timeline/timeline.tpl.html",'<ul class="timeline" ng-show="timelineInfo">\n    <li ng-repeat="(eventIndex, event) in timelineInfo.events" class="timeline-event" ng-class-even="\'timeline-inverted\'">\n        <div class="timeline-badge {{event.badgeClass}} hidden"\n             when-visible="animateElementIn"\n             when-not-visible="animateElementOut">\n            <i class="glyphicons glyphicons-{{event.iconName}}"></i>\n        </div>\n        <div class="timeline-panel {{event.badgeClass}} hidden"\n             when-visible="animateElementIn"\n             when-not-visible="animateElementOut">\n            <div class="timeline-heading">\n                <h4>{{event.title}}</h4>\n                <p class="timeline-when" ng-if="event.when">\n                    <i class="halflings halflings-time"></i>{{event.when}}\n                </p>\n\n                <div class="heading-inner">\n                    <h5 ng-if="event.role" ng-bind="event.role"></h5>\n                    <a ng-repeat="linkInfo in event.linkInfos"\n                       ng-href="{{linkInfo.url}}"\n                       target="{{linkInfo.target ? linkInfo.target : \'_self\'}}">\n                        <i class="halflings halflings-link"></i>{{linkInfo.label}}\n                    </a>\n                </div>\n            </div>\n            <!--  <div class="timeline-body" ng-if="event.bodyHTML" ng-bind-html="event.bodyHTML | makeSafeHTML"> -->\n            <div class="timeline-body">\n                <div class="badge-panel" ng-if="event.badgeKeys">\n                    <badge-link ng-repeat="key in event.badgeKeys" data-key="{{key}}"></badge-link>\n                </div>\n            </div>\n            <div class="toggle-link" ng-click="toggleDetailLevel(eventIndex)" ng-if="event.details">\n                <a href="javascript:;" ng-if="!event.isMoreDetails"><i class="halflings halflings-download"></i>see more details</a>\n                <a href="javascript:;" ng-if="event.isMoreDetails"><i class="halflings halflings-upload"></i>see less detail</a>\n            </div>\n            <!-- <div class="timeline-footer" ng-bind-html="event.footerHTML | makeSafeHTML"> -->\n            <div class="timeline-footer">\n                <ul ng-if="event.details">\n                    <li ng-repeat="detail in event.details" ng-bind-html="detail | makeSafeHTML"></li>\n                </ul>\n            </div>\n        </div>\n    </li>\n</ul>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("workExperiencePanel/workExperiencePanel.tpl.html",'<section id="work" class="work-panel" ng-show="workInfo">\n    <div class="title-area">\n        <h2 ng-bind="workInfo.title"></h2>\n        <p ng-bind="workInfo.subTitle"></p>\n    </div>\n    <div class="body-area">\n        <timeline data-timeline-info="workInfo"></timeline>\n    </div>\n</section>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("arcIndicator/arcIndicator.tpl.html",'<svg class="arc-indicator" version="1.1" xmlns="http://www.w3.org/2000/svg">\n    <g>\n        <circle cx="50%" cy="50%" r="55" />\n        <text class="progress-text" text-anchor="middle" dx="50%" dy="50%">\n            <tspan class="actual" alignment-baseline="middle" > {{actual_formatted}}%</tspan>\n        </text>\n    </g>\n    <g path-group>\n        <path class="progress-bar inner-bar normal" stroke-linejoin="round" inner-path />\n        <path class="progress-bar outer-bar" stroke-linejoin="round" outer-path />\n    </g>\n</svg>\n')}])}(),function(n){try{n=angular.module("templates-components")}catch(e){n=angular.module("templates-components",[])}n.run(["$templateCache",function(n){n.put("titlePanel/titlePanel.tpl.html",'<div class="title-panel" ng-show="titleInfo">\n    <h1 ng-bind="titleInfo.title"></h1>\n    <h2 class="sub-title"\n        ng-bind-html="subTitle | makeSafeHTML"></h2>\n</div>\n')}])}();