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

        if($.__mobile__) {
            $(document).on('click', '.pip-container .toggler', function(e){
                var parent = $(this).parent();
                parent.find('video').each(function(){this.pause();}).toggle();
                parent.find('video:visible').each(function(e){
                    var currentTime = this.currentTime;
                    parent.find('audio').each(function() {
                        this.currentTime = currentTime;
                        this.play();
                    });
                    this.play();
                });
            });

            $(document).on('play', '.pip-container video', function(e) {
                var video = e.target;

                $(this).parent().find('audio').each(function(){
                    this.currentTime = video.currentTime;
                    this.play();
                });
            });

            $(document).on('pause', '.pip-container video', function(e) {
                var video = e.target;

                $(this).parent().find('audio').each(function(){
                    this.pause();
                });
            });

            $(document).on('seeked', '.pip-container video', function(e) {
                var video = e.target;

                $(this).parent().find('audio').not(video).each(function(){
                    this.currentTime = video.currentTime;
                });
            });

            return;
        }

        $(document).on('click', '.pip-container video.forward-layer', function(e){
            var video = e.target;

            $(this).parent().find('video').not(video).each(function(){
                $(this).prop('controls', false);
                $(this).removeClass("backward-layer").addClass("forward-layer");
            });

            $(video).prop('controls', true);
            $(this).addClass("backward-layer").removeClass("forward-layer");
        });

        $(document).on('play', '.pip-container video.backward-layer', function(e) {
            var video = e.target;

            $(this).parent().find('video,audio').not(video).each(function(){
                this.currentTime = video.currentTime;
                this.play();
            });
        });

        $(document).on('pause', '.pip-container video.backward-layer', function(e) {
            var video = e.target;

            $(this).parent().find('video,audio').not(video).each(function(){
                this.pause();
                this.currentTime = video.currentTime;
            });
        });

        $(document).on('seeked', '.pip-container video.backward-layer', function(e) {
            var video = e.target;

            $(this).parent().find('video,audio').not(video).each(function(){
                this.currentTime = video.currentTime;
            });
        });

        $(document).on('canplay', '.pip-container video, .pip-container audio', function(e) {
            var jparent = $(this).parent('.pip-container');
            var parent = jparent.get(0);
            if(!parent.__canplay_count)
                parent.__canplay_count = 0;

            parent.__canplay_count++;

            if(parent.__canplay_count == 3) {
                jparent.find('video,audio').each(function() {this.play();});
            }
        });
    })
    // .directive('pipVideo', function() {

    //     return {
    //         restrict: 'E',
    //         scope: {},
    //         controller: 'pipVideoCtrl',
    //         link: function(scope, $element, a) {
    //             if(!$.isOn()) {
    //                 // console.log("IS OFF\n");

    //                 $element.find('video, audio').each(function() {
    //                     this.pause();
    //                     this.src = "";
    //                     delete this;
    //                     $(this).remove();
    //                     // console.log('deleted video, audio\n');
    //                 });

    //                 return;
    //             }

    //             // console.log("Link\n");

    //             scope.videoUrl = a.videoUrl;
    //             scope.frontVideoUrl = a.frontVideoUrl;
    //             scope.rearVideoUrl = a.rearVideoUrl;
    //             scope.audioUrl = a.audioUrl;

    //             scope.eventId = a.eventId;
    //             scope.occurredAt = a.occurredAt;
    //             scope.savedAt = a.savedAt;
    //             scope.velocity = a.velocity;
    //             scope.gx = a.gx;
    //             scope.gy = a.gy;
    //             scope.gz = a.gz;
    //             scope.address = a.address;

    //             // console.log("Video URL: " + scope.videoUrl + "\n");

    //             if($.__mobile__) {
    //                 $element.on('click', '.pip-container .toggler', function(e){
    //                     $element.find('video').each(function(){this.pause();}).toggle();
    //                     $element.find('video:visible').each(function(e){
    //                         var currentTime = this.currentTime;
    //                         $element.find('audio').each(function() {
    //                             this.currentTime = currentTime;
    //                             this.play();
    //                         });
    //                         this.play();
    //                     });
    //                 });

    //                 $element.on('play', 'video', function(e) {
    //                     var video = e.target;

    //                     $element.find('audio').each(function(){
    //                         this.currentTime = video.currentTime;
    //                         this.play();
    //                     });
    //                 });

    //                 $element.on('pause', 'video', function(e) {
    //                     var video = e.target;

    //                     $element.find('audio').each(function(){
    //                         this.pause();
    //                     });
    //                 });

    //                 $element.on('seeked', 'video', function(e) {
    //                     var video = e.target;

    //                     $element.find('audio').not(video).each(function(){
    //                         this.currentTime = video.currentTime;
    //                     });
    //                 });

    //                 return;
    //             }

    //             $element.on('click', '.pip-container video.forward-layer', function(e){
    //                 var video = e.target;

    //                 $element.find('video').not(video).each(function(){
    //                     $(this).prop('controls', false);
    //                     $(this).removeClass("backward-layer").addClass("forward-layer");
    //                 });

    //                 $(video).prop('controls', true);
    //                 $(this).addClass("backward-layer").removeClass("forward-layer");
    //             });

    //             $element.on('play', 'video.backward-layer', function(e) {
    //                 var video = e.target;

    //                 $element.find('video,audio').not(video).each(function(){
    //                     this.currentTime = video.currentTime;
    //                     this.play();
    //                 });
    //             });

    //             $element.on('pause', 'video.backward-layer', function(e) {
    //                 var video = e.target;

    //                 $element.find('video,audio').not(video).each(function(){
    //                     this.pause();
    //                     this.currentTime = video.currentTime;
    //                 });
    //             });

    //             $element.on('seeked', 'video.backward-layer', function(e) {
    //                 var video = e.target;

    //                 $element.find('video,audio').not(video).each(function(){
    //                     this.currentTime = video.currentTime;
    //                 });
    //             });

    //             var canplay_front_video = false;
    //             var canplay_rear_video = false;
    //             var canplay_audio = false;
    //             var played = false;

    //             $element.on('canplay', 'video.front-video', function(e) {
    //                 if(canplay_front_video || played)
    //                     return;
    //                 canplay_front_video = true;

    //                 if(canplay_front_video && canplay_rear_video && canplay_audio) {
    //                     played = true;
    //                     $element.find('video,audio').each(function() {this.play();});
    //                 }
    //             });
    //             $element.on('canplay', 'video.rear-video', function(e) {
    //                 if(canplay_rear_video || played)
    //                     return;
    //                 canplay_rear_video = true;

    //                 if(canplay_front_video && canplay_rear_video && canplay_audio) {
    //                     played = true;
    //                     $element.find('video,audio').each(function() {this.play();});
    //                 }
    //             });
    //             $element.on('canplay', 'audio', function(e) {
    //                 if(canplay_audio || played)
    //                     return;
    //                 canplay_audio = true;

    //                 if(canplay_front_video && canplay_rear_video && canplay_audio) {
    //                     played = true;
    //                     $element.find('video,audio').each(function() {this.play();});
    //                 }
    //             });

    //         },
    //         templateUrl : (!$.__mobile__) ? '/assets/monitor/views/content/pip-video.html' : '/assets/monitor/views/content/pip-video-ios.html'
    //     };
    // })
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
