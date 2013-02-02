$(document).ready(function(){
    var compnameElement = $(".comp_name"),
        compname,
        compStopwords = [/(股份)?有限公司$/],
        query,
        tooltipNode,
        tooltip,
        tooltipDesc,
        newsurl;

    function createTooltip() {
        var tooltip = $(
            "<div class='companynews_tooltip topright'>\n" +
            "  <div class='companynews_close'/>\n" +
            "  <div class='companynews_title'></div>\n" +
            "  <div>最近新聞：</div>\n" +
            "  <div class='companynews_news'></div>\n" +
            "</div>"
        );
        tooltip.find(".companynews_close").on("click",function(e){
            $(this).parents(".companynews_tooltip").detach();
        });
        return tooltip;
    }

    function getTooltip() {
        if ( ! tooltipNode ) tooltipNode = createTooltip();
        return tooltipNode;
    }

    function normalizeCompanyName(name) {
        if ( name ) {
            var q = name;
            for ( var i = 0 ; i < compStopwords.length ; i ++ ) {
                q = q.replace(compStopwords[i],"");
            }
            return q;
        } else {
            return "";
        }
    }

    if ( window.location.hostname == "www.104.com.tw" ) {
        //company name in job description (&r=job)
        compname = compnameElement.find("p").children("a").text().trim();
        if ( !compname ) { 
            //company name in company description
            compname = compnameElement.text().trim();
        }

        query = normalizeCompanyName(compname);
        if ( query ) {
            newsurl = "https://news.google.com.tw/news/feeds?hl=zh-TW&safe=off&gl=tw&um=1&ie=UTF-8&output=rss&num=3&q="+encodeURIComponent('"'+query+'"');
            $.get(newsurl, function(html, textStatus){
                if ( textStatus == "success" ) {
                    tooltip = getTooltip();
                    tooltipDesc = "";

                    $(html).find("item").each( function(){
                        console.log($(this).find("title").text());
                        tooltipDesc += "<div>\n";
                        tooltipDesc += "<div class='title'><a href='"+$(this).find("link").text()+"'>";
                        tooltipDesc += $(this).find("title").text();
                        tooltipDesc += "</a></div>\n";
                        //tooltipDesc += "<div class='abstract'>"+$(this).find("description").text()+"</div>\n";
                        tooltipDesc += "</div>";
                        console.log($(this).find("description").text());
                    });

                    if ( tooltipDesc ) {
                        tooltip.find(".companynews_title").text(compname);
                        tooltip.find(".companynews_news").html(tooltipDesc);
                        tooltip.appendTo("html");
                    }
                }
            });
        }
    }

});
