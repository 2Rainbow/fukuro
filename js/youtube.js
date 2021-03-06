/*
 * youtube
 * https://github.com/savetheinternet/Tinyboard/blob/master/js/youtube.js
 *
 * Don't load the YouTube player unless the video image is clicked.
 * This increases performance issues when many videos are embedded on the same page.
 * Currently only compatible with YouTube.
 *
 * Proof of concept.
 *
 * Released under the MIT license
 * Copyright (c) 2013 Michael Save <savetheinternet@tinyboard.org>
 *
 * Usage:
 *	$config['embedding'] = array();
 *	$config['embedding'][0] = array(
 *		'/^https?:\/\/(\w+\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9\-_]{10,11})(&.+)?$/i',
 *		'<div class="video-container" data-video="$2"><a href="$0" target="_blank" class="file"><img style="width:360px;height:270px;" src="//img.youtube.com/vi/$2/0.jpg"/></a></div>'
 );
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/youtube.js';
 *
 */


onready(function(){
    var do_embed_yt = function(tag) {
        $('div.video-container a', tag).click(function() {
            var videoID = $(this.parentNode).data('video');
            $(this.parentNode).html('<iframe type="text/html" width="360" height="270" src="//www.youtube.com/embed/' + videoID + '?autoplay=1" frameborder="0"/>');
            return false;
        });
    };

    do_embed_yt(document);

    var do_yt_loadName = function (tag) {
        $('div.video-container', tag).hover(function () {
            var videoID = $(this).data('video');
            var vidtmp = $(this);   // omg
            $.ajax({
                dataType: "json",
                url: 'https://www.googleapis.com/youtube/v3/videos?id=' + videoID + '&part=snippet&key=' + youtubeApi3Key,
                success: function (data, status, xhr) {
                    vidtmp.attr("title", data.items[0].snippet.title);
                }
            });
        });

    };

    do_yt_loadName();

    // allow to work with auto-reload.js, etc.
    $(document).bind('new_post', function(e, post) {
        /* old version
         do_embed_yt(post);
         do_yt_loadName(post);
         */
        post = $(post);
        post.each(function(index, element){
            do_embed_yt(element);
            do_yt_loadName(element);
        })
    });
});
