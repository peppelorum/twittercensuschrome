(function($, window, undefined) {
    var kloutIcon16URL = chrome.extension.getURL("icons/klout-16.png");
    var kloutIcon18URL = chrome.extension.getURL("icons/klout-18.png");

    var apiURL = 'http://twittercensus.se/api.php?sn=';

    var fetchScores = function(screenNames, fn) {
        console.log(apiURL + screenNames);


        $.ajax({
                url: apiURL + screenNames,
                success: function(response) {
                        var data = JSON.parse(response);
                        if (data !== null) {
                        for (var i = 0; i < data.length; i++) {
                            $('a[data-user-id="'+ data[i].id +'"]').each(function() {
                                // if ($(this).attr())
                                $(this).before('<a style="display: inline-block; border-radius: 2px; width: 12px; height: 12px; background-color:'+ 
                                data[i].clustercolor +'" href="'+ data[i].url +'" target="_blank" title="'+ data[i].clustername +'"></a>');    
                            });
                            // $(this).attr('data-twittercensus-done', '1');
                        }    
                    }
                },
                error: function() {
                }
            });
    };

    var extractScreenName = {
        // @deprecated '.user-details': function(idx, el) { return $('.user-screen-name', el); },
        // @depreated '.user-content-rest': function(idx, el) { return $('a', el); },
        '.js-stream-tweet':   function(idx, el) {
            var old = $('a.tweet-screen-name', el);
            if (old && old.length > 0) {
                // "Old" Twitter selector.
                return old;
            } else {
                // New-new Twitter "Fly" selector.
                var fly = $('.fullname', el);
                // Remap function of the node which has the text value we want (Screen-name.)
                fly.text = function() { return $('.username b', el).text() };
                return fly;
            }
        }
    };

    var visibleScreenNames = function() {
        return _.uniq(_.flatten(_.map(_.keys(extractScreenName), function(selector) {
            return _.toArray($(selector).map(function (idx, el) {
                return extractScreenName[selector](idx, el).text();
            }));
        })));
    };

    var foreachVisibleScreenName = function(fn) {
        _.each(_.keys(extractScreenName), function(selector) {
            $(selector).each(function(idx, el) {
                fn(extractScreenName[selector](idx, el), el);
            });
        });
    };

    var scores = {};

    var fetchMissingScores = function() {
        var screenNames = visibleScreenNames().filter(function(screenName) {
            return undefined === scores[screenName.toLowerCase()];
        });

        if (0 !== screenNames.length) {
            screenNames = screenNames.slice(0, 4);
            _.each(screenNames, function(user) {
                scores[user.toLowerCase()] = null;
            });

            fetchScores(screenNames.join(','), function(response) {
                _.each(response, function(data) {
                    data = JSON.parse(data);
                });

                fetchMissingScores();
            });
        }
    };

    var intervals = [ 500, 1000, 5000, 10000 ];
    var check = function() {
        _.each(intervals, function(interval) {
            _.delay(function() { fetchMissingScores(); }, interval);
        });
    };

    $(window).scroll(_.debounce(function() {
        fetchMissingScores();

    }, 500));

    $('body').live('mouseup', check);
    $(check);
})(jQuery, window);
