;(function($){

	$.fn.gallery = function(config){

		var defaults = {
			scrollSpeed: 600,
			oasUrl: 'http://oascentral.yakima-herald.com/RealMedia/ads',
			oasPage: 'www.yakimaherald.com/galleries',
			oasPos: 'Middle',
			oasContainer: '.ad-300x250',
			oasAdWidth: 300,
			oasAdHeight: 250
		};

		opt = $.extend(defaults, config);

		var $this = $(this),
			$oPane = $this.children('.thumbnail-pane'),
			$oThumbnails = $oPane.children('.thumbnails'),
			$oThumbs = $oThumbnails.children('.thumbs'),
			$oMainDisplay = $this.children('.pane'),
			$oControls = $this.children('.controls'),
			$paneNextBtn = $oPane.children('.paneNext'),
			$panePrevBtn = $oPane.children('.panePrev'),
			$oCounter = $oControls.children('.counter'),
			$oNextImgBtn = $oControls.children('.next'),
			iAdLoadCount = 0,
			totalThumbs = 0,
			currentIndex = 0;



		gallery = {

			init: function(){

				$.getJSON('data/images.json', function(data){

					var aThumbs = [];

					$.each(data, function(key, val){

						aThumbs.push('<img src="'+val.thumb+'" data-large="'+val.large+'" width="75" height="50" />');
						totalThumbs++;

					});

					$oThumbs.html(aThumbs.join(''));
					
					var currImage = $oThumbs.children('img:first').data('large'),
						sCount = $oCounter.html('1 / '+totalThumbs),
						oImage = $('<img />').attr({ src: currImage, 'class': 'viewing' });

						$oMainDisplay.html(oImage);
				});
			},
			loadImage: function(imgString, index){

				$('<img class="viewing" />').load(function(){

					var self = $(this),
						curr = $oMainDisplay.children('img:first'),
						sCount = (index+1)+' / '+totalThumbs;


						$(self).insertBefore($(curr));
						$(curr).fadeOut(800, function(){
							$(this).remove();
						});

						$oCounter.html(sCount);
						gallery.router(imgString);
						gallery.adCounter();
						
				}).attr('src', imgString);
			},
			router: function(sImg){

				var uri = sImg.replace(/^.*\/|\.[^.]*$/g, '');

				window.location.hash = uri;
				try{
				
					// Need to test later
					//_gaq.push(['_trackPageview',location.pathname + location.search  + location.hash]);
					// setTimeout('document.location = "' + link.attr('href') + '"', 100);
					//console.log(location.pathname + location.hash);
				}catch(err) {}
			},
			adCounter: function(){

				iAdLoadCount++;

				if(iAdLoadCount === 3){

					if($(opt.oasContainer).children().length > 0){
						$(opt.oasContainer).children().remove();
					}

					// Create Iframe and Load ad into it
					var ifrm = $('<iframe />').attr({
									src: opt.oasUrl + "/adstream_sx.ads/" +opt.oasPage+ "/" + gallery.uniqid() + "@"+ opt.oasPos,
									id: gallery.uniqid(),
									marginwidth: 0,
									marginheight: 0,
									scrolling: 'no',
									height: opt.oasAdHeight,
									width: opt.oasAdWidth,
									frameborder: 0
								});

					$(opt.oasContainer).html(ifrm);
					iAdLoadCount = 0;

				}
			},
			uniqid: function(){
				var newDate = new Date();
				return newDate.getTime();
			}
		};
		gallery.init();

		// Thumbnail Scrolling
		$paneNextBtn.bind('click foo', function(){

			var posX = $oThumbs.position().left,
				total = $oThumbs.outerWidth(true),
				pane = $oThumbnails.width();
				diff = total+(posX-pane);
				$panePrevBtn.stop().show("fast");
				if(diff >= pane){
					$oThumbs.stop().animate({left:"-="+(pane-5)}, opt.scrollSpeed, function(){
						if(diff === pane){
							$nextBtn.stop().hide("fast");
						}
					});
				}else{
					$paneNextBtn.stop().hide("fast");
					$oThumbs.stop().animate({left:pane-total}, opt.scrollSpeed);
				}
		});

		$panePrevBtn.bind('click', function(){

			var posX = $oThumbs.position().left,
				total = $oThumbs.outerWidth(true),
				pane = $oThumbnails.width();
				diff = total+(posX-pane);
				$paneNextBtn.stop().show("fast");
				if(posX+pane<=0){
					$oThumbs.stop().animate({left:"+="+(pane-5)}, opt.scrollSpeed, function(){
						if(posX+pane === 0){
							$prevBtn.stop().hide("fast");
						}
					});
				}else{
					$panePrevBtn.stop().hide("fast");
					$oThumbs.stop().animate({left:0}, opt.scrollSpeed);
				}

		});
		// End Thumbnail Scrolling


		// Next Image Button
		$oNextImgBtn.bind('click', function(){

			var foo = $oThumbs.children().get(currentIndex +1);

			console.log(foo);

		});


		$oThumbs.on('click', 'img', function(){

			var large = $(this).data('large'),
				index = $oThumbs.children('img').index(this);


			gallery.loadImage(large, index);

		});


		// This will allow direct link to an image in a gallery
		if(window.location.hash !== ''){

			var imgHash = window.location.hash.substr(1);
			// gallery.loadImage(imgHash);
			console.log(imgHash);
			

		}
	
		console.log(currentIndex);

	};

})(jQuery);