

;(function($){

	$.fn.reSlider = function(config) {

		var defaults = {
			animation: 'fade',
			animationSpeed: 700,
			paginationControl: true,
			navigation: true,
			slideShow: true,
			slideShowSpeed: 7000,
			sIndex: 0
		};

		opt = $.extend(defaults, config);

		var $this = $(this),
			currentIndex = opt.sIndex,
			wrapper = $(this).find('#pane'),
			slides = wrapper.children('figure'),
			slideCount = slides.length,
			isAnimating,
			controls,
			slideShowTimeout;

			slider = {
				
				init: function(){

					var slide = $(slides[currentIndex]),
						img = slide.find('img');
						if(opt.animation == 'fade'){
							$(slides).css({
								opacity:0,
								position: 'absolute'
							});
							$(slides[currentIndex]).css('position', 'relative');
						}
						img.load(function(){
							slides.show();
							$this.stop(true, true).animate({height: slide.innerHeight() });
						});
						slider.loadSlide(currentIndex);
				},
				loadSlide: function(index){
					if(isAnimating){
						return false;
					}
					isAnimating = true;
					currentIndex = index;
					var slide = $(slides[index]);

					$this.stop(true, true).animate({height: slide.innerHeight()});

					if(opt.animation == 'fade'){

						slides.animate({opacity: 0}, opt.animationSpeed).css('position', 'absolute');
						
						slide.animate({opacity: 1}, opt.animationSpeed, function(){
							isAnimating = false;
						});
					}
					$this.trigger('slideLoaded', index);
				},
				resize: function(){
					var slide = $(slides[currentIndex]);
					$this.stop(true, true).animate({height: slide.innerHeight()});
				}

			};
			// Start the Slide Show
			if(opt.slideShow){
				var slideshow = function(){
					if(currentIndex + 1 < slideCount){
						slider.loadSlide(currentIndex + 1);
					}else{
						slider.loadSlide(0);
					}
					slideShowTimeout = setTimeout(slideshow, opt.slideShowSpeed);
				};
				slideShowTimeout = setTimeout(slideshow, opt.slideShowSpeed);
			}
			// Pagination Controls
			if(opt.paginationControl){
				controls = $('#pagination');
				$.each(slides, function(i){
					controls.append('<li><a href="#">'+ (i + 1) + '</a></li>');
					controls.find('a:eq('+i+')').click(function(e){
						e.preventDefault();
						clearTimeout(slideShowTimeout);
						slider.loadSlide(i);
					});
				});
			}
			// Navigation
			if(opt.navigation){
				var prev = $('<a class="rePre">Prev</a>');
				prev.click(function(e){
					e.preventDefault();
					clearTimeout(slideShowTimeout);
					if(currentIndex === 0){
						slider.loadSlide(slideCount -1);
					}else{
						slider.loadSlide(currentIndex - 1);
					}
				});
				$this.children('nav').children('ul').before(prev);
				
				var next = $('<a class="reNext">Next</a>');
				next.click(function(e){
					e.preventDefault();
					clearTimeout(slideShowTimeout);
					if(currentIndex + 1 === slideCount){
						slider.loadSlide(0);
					}else{
						slider.loadSlide(currentIndex + 1);
					}
				});
				$this.children('nav').append(next);
			}

			$(window).resize(slider.resize);
			slider.init();
	};
})(jQuery);