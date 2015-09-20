angular.module('pip', [])
    .run(function($rootScope, deviceDetector) {
        $.createEventCapturing = (function () {
            var special = $.event.special;
            return function (names) {
                if (!document.addEventListener) {
                    return;
                }

                if (typeof names == 'string') {
                    names = [names];
                }
                $.each(names, function (i, name) {
                    var handler = function (e) {
                        e = $.event.fix(e);

                        return $.event.dispatch.call(this, e);
                    };
                    special[name] = special[name] || {};
                    if (special[name].setup || special[name].teardown) {
                        return;
                    }
                    $.extend(special[name], {
                        setup: function () {
                            this.addEventListener(name, handler, true);
                        },
                        teardown: function () {
                            this.removeEventListener(name, handler, true);
                        }
                    });
                });
            };
        })();

        $.createEventCapturing(['canplay', 'play', 'pause', 'seeked']);

        if($rootScope.isMobile === undefined) {
            $rootScope.isMobile = deviceDetector.isMobile() || deviceDetector.isTablet();
        }

        $.__mobile__ = $rootScope.isMobile;
        //$.__mobile__ = /Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone/i.test(window.navigator.userAgent);
    })
    .directive('pipVideo', function() {

        return {
            restrict: 'E',
            scope: {},
            controller: 'pipVideoCtrl',
            link: function(scope, $element, a) {
                if(!a.videoUrl || a.videoUrl == '') {
                    return;
                }

                scope.videoUrl = a.videoUrl;
                scope.frontVideoUrl = a.frontVideoUrl;
                scope.rearVideoUrl = a.rearVideoUrl;
                scope.audioUrl = a.audioUrl;

                scope.eventId = a.eventId;
                scope.occurredAt = a.occurredAt;
                scope.savedAt = a.savedAt;
                scope.velocity = a.velocity;
                scope.gx = a.gx;
                scope.gy = a.gy;
                scope.gz = a.gz;
                scope.address = a.address;

                if($.__mobile__) {
                    $element.on('click', '.pip-container .toggler', function(e){
                        $element.find('video').each(function(){this.pause();}).toggle();
                        $element.find('video:visible').each(function(e){
                            var currentTime = this.currentTime;
                            $element.find('audio').each(function() {
                                this.currentTime = currentTime;
                                this.play();
                            });
                            this.play();
                        });
                    });

                    $element.on('play', 'video', function(e) {
                        var video = e.target;

                        $element.find('audio').each(function(){
                            this.currentTime = video.currentTime;
                            this.play();
                        });
                    });

                    $element.on('pause', 'video', function(e) {
                        var video = e.target;

                        $element.find('audio').each(function(){
                            this.pause();
                        });
                    });

                    $element.on('seeked', 'video', function(e) {
                        var video = e.target;

                        $element.find('audio').not(video).each(function(){
                            this.currentTime = video.currentTime;
                        });
                    });

                    return;
                }

                $element.on('click', '.pip-container video.forward-layer', function(e){
                    var video = e.target;

                    $element.find('video').not(video).each(function(){
                        $(this).prop('controls', false);
                        $(this).removeClass("backward-layer").addClass("forward-layer");
                    });

                    $(video).prop('controls', true);
                    $(this).addClass("backward-layer").removeClass("forward-layer");
                });

                $element.on('play', 'video.backward-layer', function(e) {
                    var video = e.target;

                    $element.find('video,audio').not(video).each(function(){
                        this.currentTime = video.currentTime;
                        this.play();
                    });
                });

                $element.on('pause', 'video.backward-layer', function(e) {
                    var video = e.target;

                    $element.find('video,audio').not(video).each(function(){
                        this.pause();
                        this.currentTime = video.currentTime;
                    });
                });

                $element.on('seeked', 'video.backward-layer', function(e) {
                    var video = e.target;

                    $element.find('video,audio').not(video).each(function(){
                        this.currentTime = video.currentTime;
                    });
                });

                var canplay_front_video = false;
                var canplay_rear_video = false;
                var canplay_audio = false;
                var played = false;

                $element.on('canplay', 'video.front-video', function(e) {
                    if(canplay_front_video || played)
                        return;
                    canplay_front_video = true;

                    if(canplay_front_video && canplay_rear_video && canplay_audio) {
                        played = true;
                        $element.find('video,audio').each(function() {this.play();});
                    }
                });
                $element.on('canplay', 'video.rear-video', function(e) {
                    if(canplay_rear_video || played)
                        return;
                    canplay_rear_video = true;

                    if(canplay_front_video && canplay_rear_video && canplay_audio) {
                        played = true;
                        $element.find('video,audio').each(function() {this.play();});
                    }
                });
                $element.on('canplay', 'audio', function(e) {
                    if(canplay_audio || played)
                        return;
                    canplay_audio = true;

                    if(canplay_front_video && canplay_rear_video && canplay_audio) {
                        played = true;
                        $element.find('video,audio').each(function() {this.play();});
                    }
                });

            },
            templateUrl : (!$.__mobile__) ? '/assets/monitor/views/content/pip-video.html' : '/assets/monitor/views/content/pip-video-ios.html'
        };
    })
    .directive('pipImage', function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'pipImageCtrl',
            link: function(scope, $element, a) {
                scope.frontImageUrl = a.frontImageUrl;
                scope.rearImageUrl = a.rearImageUrl;

                $element.on('click', '.pip-container img.forward-layer', function(){
                    $element.find(".backward-layer").removeClass("backward-layer").addClass("forward-layer");
                    $(this).addClass("backward-layer").removeClass("forward-layer");
                })
            },
            template: '' +
                '<div class="pip-container" ng-if="frontImageUrl != null && frontImageUrl != \'\'">' +
                '   <img ng-attr-src="{{ frontImageUrl }}" class="backward-layer"></img>' +
                '   <img ng-attr-src="{{ rearImageUrl }}" class="forward-layer"></img>' +
                '</div>'
        };
    })
    .controller('pipImageCtrl', function($scope, $element, $attrs) {
    })
    .controller('pipVideoCtrl', function($scope, $element, $attrs) {
    });
