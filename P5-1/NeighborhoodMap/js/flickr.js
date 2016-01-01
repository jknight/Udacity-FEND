var flickr = {

    // given a search term and the infoWindow to populate with results, search flickr, build 
    // an html snippit of the results, and pass it to the callback
    fetch: function(searchWord, address, div, callback) {

        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                    tags: searchWord,
                    tagmode: "any",
                    format: "json"
                },
                function(data) {

                    var html;
                    if (data.items.length == 0) {
                        html = "<b>No image found :(</b><br/>" + address;
                    } else {

                        var firstItem = data.items[0];
                        var html = "<h5>" + searchWord + "</h5><img class='locationDetailsImage' src='" +
                            firstItem.media.m + "'><br/>" +
                            firstItem.title + "<br/>Author:" +
                            firstItem.author + "<br/>Address:" +
                            address;
                    }
                    return callback(html);
                })
            .done(function() { /* placeholder */ })
            .fail(function() {
                return callback("Please check your network connection");
            })
            .always(function() { /* placeholder */ });

    }
}
