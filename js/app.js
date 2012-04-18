(function($){
	//
	// Main Site 
	// TODO: cache objects and clean up
	//
	YHR = 
	{
		init: function(){

			$('dl.tab').each(function(){
				var tabs = $(this).children('dd').children('a');
				tabs.click(function (e){
					YHR.activeTab($(this));
					e.preventDefault();
				});
			});

			$('.nav-toggle').live('click', function(){

				if($(this).hasClass('open')){
					$('#nav-list').hide('slow');
					$(this).removeClass('open');
					$('.nav-toggle').children('span').html('+');
				}else{
					$('#nav-list').show('slow', function(){
						$('.nav-toggle').addClass('open');
						$('.nav-toggle').children('span').html('-');
					});

				}
				return false;

			});
			// Start Lionbars
			YHR.lb();
			YHR.twitter();

		},
		lb: function(){
			// Lion bars isn't reponsive need to look into making it change
			$('#lb').lionbars();
		},
		activeTab: function(tab){
			var activeTab = tab.closest('dl').find('a.active');
			var contentLocation = tab.attr('href');

			// Strip off the current ul that IE Adds
			contentLocation = contentLocation.replace(/^.+#/, '#');

			// Make Tab Active
			activeTab.removeClass('active');
			tab.addClass('active');

			$(contentLocation).closest('.tabs-content').children('li').hide();
			$(contentLocation).css('display', 'block');
		},
		fontMan: function(org, orgLineHeight, type){

			switch(type){
				case 'plus':
					var newFontSize = (org*1.2);
					var newLineHeight = (orgLineHeight*.08);
					$('article p').css('font-size', newFontSize);
					$('article p').css('line-height', newLineHeight);
				break;
				case 'minus':
					$('article p').css('font-size', org);
				break;
			}
		},
		twitter: function(){

			String.prototype.parseURL = function(){
				return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
        			return url.link(url);
    			});
			};

			String.prototype.parseUsername = function(){
			    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
			        var username = u.replace("@","")
			        return u.link("http://twitter.com/"+username);
			    });
			};

			String.prototype.parseHashtag = function() {
			    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			        var tag = t.replace("#","%23")
			        return t.link("http://search.twitter.com/search?q="+tag);
			    });
			};

			$.getJSON("http://twitter.com/status/user_timeline/yakima_herald.json?count=2&callback=?", function(data){
				var tweet = data[0].text;

				tweet = tweet.parseURL().parseHashtag().parseUsername();

				$('.twitter-status').html(tweet);
				$('.twitter-time').html('<strong>' + YHR.timeAgo(data[0].created_at) + '</strong>');
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

	//
	// Responsive Slider - Down n' Dirty 
	// This will not be final slider
	// TODO: Clean up and turn into plugin 
	// TODO: Remove Full Content Links & ClearInterval if click is active
	//
	Slider = 
	{
		rotateId: '',
		totalSlides: '',
		init: function(){
			this.rotateIndex = 0;
			
			$('#slider-btns li a').live('click', function(){
				var i = $(this).data('slide');
				Slider.populate(i);
				clearInterval(Slider.rotateId);
				return false;
			});	

			$('.left-arrow').live('click', function(){
				Slider.back();
				clearInterval(Slider.rotateId);
				return false;
			});

			$('.right-arrow').live('click', function(){
				Slider.next();
				clearInterval(Slider.rotateId);
				return false;
			});

			$('#slides').each(function(){
				var slide = $(this).children('.slide');
				Slider.totalSlides = slide.length;
				

				this.sliderBtns = [];

				for(var i=0; i < Slider.totalSlides; i++){
					var btn = '<li><a href="#" data-slide="'+i+'"></a></li>';
					this.sliderBtns.push(btn);
				}

				$.each(this.sliderBtns, function(index, value){
					$('#slider-btns').append(value);
				});

				Slider.activeSlide(0, Slider.totalSlides);
				Slider.findHeight();
				
			});

			$(window).bind('resize', function () { 

			    	Slider.findHeight();

			});
		},
		activeSlide: function(index, totalSlides){

			Slider.rotateCount(totalSlides);

			$('#slider .slide:[data-slide="'+index+'"]').addClass('active').fadeIn('slow');
			$('.slider-controls').fadeIn('slow');
			$('#slider-btns li a:[data-slide="'+index+'"]').addClass('active');

			Slider.rotateId = setInterval(function(){Slider.rotateCount(totalSlides);}, 8000);
		},
		rotateCount: function(totalSlides){

			if(this.rotateIndex === totalSlides){ this.rotateIndex = 0; }
			this.foo = this.rotateIndex;
			Slider.populate(this.foo);
			this.rotateIndex++;
			//console.log(this.foo, totalSlides);
		},
		populate: function(index){

			Slider.clear(); // Stop queue build up

			$('.slide').fadeOut('slow').removeClass('active');
			$(".slide:[data-slide='"+index+"']").fadeIn('slow').addClass('active');
			Slider.findHeight();
			$('#slider-btns li a').removeClass('active');
			$('#slider-btns li a:[data-slide="'+index+'"]').addClass('active');

		},
		next: function(){
			var index = ($('.slide.active').data('slide') + 1);

			if(index === Slider.totalSlides){ index = 0; }
			Slider.populate(index);
		},
		back: function(){
			var index = ($('.slide.active').data('slide') - 1);

			if(index < 0){ index = (Slider.totalSlides - 1); }
			Slider.populate(index);
		},
		clear: function(){
			$('.slide').stop(true, true);
		},
		findHeight: function(){
			var totalheight = $('.slide.active').outerHeight();
			$('#sizer').css("height", totalheight);
		}
	};

	//
	// Drop Down Menu 
	//
	Menu = 
	{
		init: function(){

			$('.main-nav[data-menu-content]').each(function(){

				var sections = $(this),
								hovering,
								target;

				sections.bind("fetch", function(){

					// only get the data if its a non touch device
					// touch people will only get main nav items
					if(!Modernizr.touch){

						$.get(sections.data('menu-content'), function(data){

							var menu = $(data).appendTo('#nav-objects');

							sections.unbind("fetch");
							Menu.behavior();
							if(hovering){
								$('div[data-menu="'+$(target).closest('a[data-section]').data('section')+'"]:eq(0)').trigger('menushow');
							}

						});
					}

				})
				.bind('mouseenter focus', function(e){
					hovering = true;
					target = e.target;
					$(this).trigger('fetch');
				})
				.bind('mouseleave blur', function(){
					hovering = false;
				})
				.trigger('fetch');

			});

		},
		behavior: function(){

			var menuTimer;

			$('.main-nav>ul>li>a[data-section]').each(function(i){

				var anchor = $(this);
				var menu = $('div[data-menu="'+$(this).data('section')+'"]"eq(0)');
				var menuid = menu.attr('id');
				var anchorid = anchor.attr('id');

				if(!menuid){
					menuid = 'navp-' + i;
					menu.attr('id', menuid);
				}

				if(!anchorid){
					anchorid = "navp-" + i;
					anchor.attr('id', anchorid);
				}

				anchor.attr({
					'expanded' : false
				});

				anchor.data('menuObj', menu);

				menu.attr({
					'labelledby': menuid
				})
				.data('anchorObj', anchor);

			})
			.bind('mouseenter focus', function(e){
					clearTimeout(menuTimer);
					$(this).data('menuObj').trigger('menushow');
			})
			.bind('mouseleave blur', function(){
				var el = $(this);
				// console.log(el);
				el.data('hoverfocused', false);
				menuTimer = setTimeout(function(){
					el.data('menuObj').trigger('menuhide');
				}, 100);
			});

			$('div[data-menu]').bind('menushow', function(){

				var anchor = $(this).data('anchorObj');

				anchor.attr('expanded', true);

				$(this).add(anchor.parent())
					   .add(anchor.closest('ul'))
					   .addClass('menu-expaned');


				$('div[data-menu].menu-expaned').not(this).trigger('menuhide');

				// console.log($(this));

			})
			.bind('menuhide', function(){
				//remove class from anchor and div
				var anchor = $(this).data('anchorObj');
				anchor.attr('expanded', false);

				$(this).add(anchor.parent())
					   .add(anchor.closest('ul'))
					   .removeClass('menu-expaned');
			})
			.bind('mouseenter focusin', function(){
				$(this).data('anchorObj').data('hoverfocus', true);
				clearTimeout(menuTimer); // let it stay down
			})
			.bind('delayedLeave', function(){
				$(this).data('anchorObj').data('hoverfocus', false);
				$(this).trigger('menuhide');
			})
			.bind('mouseleave focusout', function(){
				var el = $(this);
				menuTimer = setTimeout(function(){
					el.trigger('delayedLeave');
				}, 100);
				
			})
		}

	}


	YHR.init();
	Slider.init();
	Menu.init();

})(jQuery);