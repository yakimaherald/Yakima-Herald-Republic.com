;(function ( $, window, document, undefined ) {


 $.fn.share = function(config){

	var defaults = {
		// setup default
		shareTotal: 0,
		url: document.location.href,
		text: document.title,
		count: {},
		total: 0
	};

	opt = $.extend(defaults, config);

	$sre = this;

	// Json url get count
	urlCount = {
		facebook: "http://graph.facebook.com/?id={url}&callback=?",
		twitter: "http://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?"
	};
	//modals windows
	popup = {
		facebook: function(options){
			window.open("http://www.facebook.com/sharer.php?u="+encodeURIComponent(options.url)+"&t="+options.text+"", "", "toolbar=0, status=0, width=900, height=500");
		},
		twitter: function(options){
			window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(options.text)+"&url="+encodeURIComponent(options.url)+"", "", "toolbar=0, status=0, width=650, height=360");
		}
	};

	sharer = {

		init : function(){

			$sre.each(function(){

				var name = $(this).data('type');

				// Count Amount of Buttons
				opt.shareTotal ++;

				if($(this).data('url') !== 'undefined'){
					opt.url = $(this).data('url');
				}
				if($(this).data('text') !== 'undefined'){
					opt.text = $(this).data('text');
				}

				sharer.getJSON(name);

				$(this).bind('click', function(){
					sharer.modals(this);
					return false;
				});

			});

		},
		getJSON: function(name){

			var self = this,
				count = 0,
				url = urlCount[name].replace('{url}', encodeURIComponent(opt.url));

			if(url !== ''){
				$.getJSON(url, function(json){

					if(typeof json.count !== 'undefined'){ //twitter
						count = parseInt(json.count, 10);
					}
					else if(typeof json.shares !== 'undefined'){ //facebook
						count = parseInt(json.shares, 10);
					}

					opt.count[name] = count;
					opt.total += count;
					sharer.render(name);

				})
				.error(function(){
					opt.count[name] = 99; // just so i know what the error was
					sharer.render(name);
				});
			}
			else{
				opt.count[name] = 98; // just so i know what the error was
				sharer.render(name);
			}

		},
		render: function(name){
			var total = opt.count[name];

			$('.'+name+' .count').html(total);
		},
		modals: function(obj){
			var name = $(obj).data('type');
			
			popup[name](opt);
			// TODO: track social interaction
		}

	};
	sharer.init(this);

 };

})(jQuery, window, document);