(function( $, undefined ){
	$( function(){
	
		// Next Article Slider
		if(yhr.browser.sSize > 481){
			$(window).bind('scroll', function(){
				var distanceTop = $('#last').offset().top - $(window).height(),
					$oSlideNext = $('#slidenext');

				if($(window).scrollTop() > distanceTop){
					$oSlideNext.animate({'right':'0px'}, 300);
				}else{
					$oSlideNext.stop(true).animate({'right':'-430px'}, 100);
				}
			});

			$('#slidenext').children('#close').bind('click', function(){
				
				$('#slidenext').stop(true).animate({'right':'-430px'}, 100, function(){
					$(this).remove();
				});
				return false;
			});
		}

	});
})( jQuery );	