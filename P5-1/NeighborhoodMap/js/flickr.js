var flickr = {

    //given a searh term and the infoWindow to populate with results, search flickr and populate the popup
    fetch: function(searchWord, infoWindow) {

        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                tags: searchWord,
                tagmode: "any",
                format: "json"
            },
            function(data) {
                if (data.items.length == 0) {
                    //TODO: for production, something more graceful here ...
                    console.log("No search results ...");
                }
                var firstItem = data.items[0];
                var html = "<h2>" + searchWord + "</h2><img src='" + firstItem.media.m + "'><br/>" + firstItem.title + "<br/>Author:" + firstItem.author;
                infoWindow.setContent(html);
            });
    }
}
