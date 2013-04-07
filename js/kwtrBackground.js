(function($, undefined) {



    var apiURL = '// http://twittercensus.se/api.php?sn=hampusbrynolf'
    var apiURL = 'http://api.klout.com/v2/users.json/score/twitter/batch?key=vuengndhgrbawsxh6g5ycgs3&handles=' ;
    chrome.extension.onMessage.addListener(function(request, sender, fn) {
        var action = request.action ;




        if ('fetchScore' === action) {

            console.log('hej');

            console.log(apiURL + request.screenNames);

            $.ajax({
                url: apiURL + request.screenNames,
                success: function(response) {
                    fn(response);
                },
                error: function() {
                    fn({ users: [] });
                }
            });
        }
    });
})(jQuery) ;
