(function( $, undefined ){
	$( function(){
	
		twitter = {
			
			init: function(){


				String.prototype.parseURL = function(){
					return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
						return url.link(url);
					});
				};

				String.prototype.parseUsername = function(){
					return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
						var username = u.replace("@","");
						return u.link("http://twitter.com/"+username);
					});
				};

				String.prototype.parseHashtag = function() {
					return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
					var tag = t.replace("#","%23");
					return t.link("http://search.twitter.com/search?q="+tag);
				});
				};

				$.getJSON("http://twitter.com/status/user_timeline/yakima_herald.json?count=2&callback=?", function(data){
					var tweet = data[0].text;

					tweet = tweet.parseURL().parseHashtag().parseUsername();

					$('#status').append(tweet);
					$('#twitter-time').html('<strong>' + twitter.timeAgo(data[0].created_at) + '</strong>');
				});

			},
			timeAgo: function(dateString){

				var rightNow = new Date();
				var then = new Date(dateString);

				if($.browser.msie){
					then = Date.parse(dateString.replace(/(\+)/, ' UTC$1'));
				}

				var diff = rightNow - then;

				var second = 1000,
				minute = second * 60,
				hour = minute * 60,
				day = hour * 24,
				week = day * 7;
			
				if (isNaN(diff) || diff < 0) {
					return ""; // return blank string if unknown
				}

				if (diff < second * 2) {
					// within 2 seconds
					return "right now";
				}

				if (diff < minute) {
					return Math.floor(diff / second) + " seconds ago";
				}

				if (diff < minute * 2) {
					return "about 1 minute ago";
				}

				if (diff < hour) {
					return Math.floor(diff / minute) + " minutes ago";
				}

				if (diff < hour * 2) {
					return "about 1 hour ago";
				}

				if (diff < day) {
					return  Math.floor(diff / hour) + " hours ago";
				}

				if (diff > day && diff < day * 2) {
					return "yesterday";
				}

				if (diff < day * 365) {
					return Math.floor(diff / day) + " days ago";
				}

				else {
					return "over a year ago";
				}


			}

		};

		twitter.init();

	});
})( jQuery );	