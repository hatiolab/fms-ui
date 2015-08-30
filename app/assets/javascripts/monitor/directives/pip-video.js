angular.module('pip', [])
    .run(function() {
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
                //alert(a.videoUrl);
                scope.videoUrl = a.videoUrl;
                scope.frontVideoUrl = a.frontVideoUrl;
                scope.rearVideoUrl = a.rearVideoUrl;
                scope.audioUrl = a.audioUrl;

                scope.eventId = a.eventId;
                scope.occurredAt = a.occurredAt;
                scope.velocity = a.velocity;
                scope.gx = a.gx;
                scope.gy = a.gy;
                scope.gz = a.gz;
                scope.address = a.address;

                $element.on('click', '.pip-container video.forward-layer', function(e){
                    var video = e.target;

                    var mediagroup = $(video).attr('xmediagroup');
                    $('video[xmediagroup=' + mediagroup + ']').not(video).each(function(){
                        $(this).prop('controls', false);
                        $(this).removeClass("backward-layer").addClass("forward-layer");
                    });

                    $(video).prop('controls', true);
                    $(this).addClass("backward-layer").removeClass("forward-layer");
                });

                $element.on('play', 'video.backward-layer', function(e) {
                    var video = e.target;

                    var mediagroup = $(video).attr('xmediagroup');
                    $('video,audio[xmediagroup=' + mediagroup + ']').not(video).each(function(){
                        this.currentTime = video.currentTime;
                        this.play();
                    });
                });

                $element.on('pause', 'video.backward-layer', function(e) {
                    var video = e.target;

                    var mediagroup = $(video).attr('xmediagroup');
                    $('video,audio[xmediagroup=' + mediagroup + ']').not(video).each(function(){
                        this.pause();
                        this.currentTime = video.currentTime;
                    });
                });

                $element.on('seeked', 'video.backward-layer', function(e) {
                    var video = e.target;

                    var mediagroup = $(video).attr('xmediagroup');
                    $('video,audio[xmediagroup=' + mediagroup + ']').not(video).each(function(){
                        this.currentTime = video.currentTime;
                    });
                });

                $element.on('canplay', 'video.backward-layer', function(e) {
                    $element.find('video.backward-layer').trigger('play');
                });                

            },
            templateUrl : '/assets/monitor/views/content/pip-video.html'
            // template: '' +
            //     '<div class="pip-container" ng-if="frontVideoUrl != null && frontVideoUrl != \'\'">' +
            //     '   <video ng-attr-src="{{ frontVideoUrl }}" controls xmediagroup="pip" class="backward-layer"></video>' +
            //     '   <video ng-attr-src="{{ rearVideoUrl }}" xmediagroup="pip" class="forward-layer"></video>' +
            //     '   <audio ng-attr-src="{{ audioUrl }}" xmediagroup="pip" hidden></audio>' +
            //     '</div>' +
            //     '<div ng-if="frontVideoUrl">' +
            //         '<a target="_self" href="{{ videoUrl }}" download="video.mp4">' +
            //             '[Download]' +
            //         '</a>' +
            //     '<div>'
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
                    $(".backward-layer").removeClass("backward-layer").addClass("forward-layer");
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
