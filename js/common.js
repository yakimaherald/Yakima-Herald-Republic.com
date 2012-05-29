(function( $, undefined ){
	$( function(){
	
		// Tabs
		$('dl.tab').each(function(){
			var tabs = $(this).children('dd').children('a');
			tabs.click(function (e){
				activateTab($(this));
				return false;
			});
		});

		function activateTab(tab){
			var activeTab = tab.closest('dl').find('a.active');
			var contentLocation = tab.attr('href');

			// Strip off the current ul that IE Adds
			contentLocation = contentLocation.replace(/^.+#/, '#');

			// Make Tab Active
			activeTab.removeClass('active');
			tab.addClass('active');

			$(contentLocation).closest('.tabs-content').children('li').hide();
			$(contentLocation).css('display', 'block');
		}

		//Text Change
		var sTextCookie = "TextSize",
			textCookie = yhr.cookie.get(sTextCookie),
			aSizeOpt = [];

		$('.text-change').bind("click", function(){
			var sClass = $(this).data('change');
			updateSize(sClass);
			return false;
		});

		$('.text-change').each(function(){
			var sClass = $(this).data('change');
			aSizeOpt.push('text-'+sClass);
		});

		aSizeOpt = aSizeOpt.join(" ");

		// console.log(aSizeOpt);

		function updateSize(sClass){
			var $oHtml = $("html");

			$oHtml.removeClass(aSizeOpt);
			yhr.cookie.set("TextSize", sClass);
			$oHtml.addClass("text-"+sClass);
		}


		if(textCookie){
			updateSize(textCookie);
		}

		// Menu 
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
						if(!yhr.support.touch){

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
					
				});
			}

		};

		Menu.init();

		//Animate Scroll To Top
		$('#back-to-top').bind('click', function(){
			$('body,html').animate({
				scrollTop:0
			}, 800);
			return false;
		});
	});
})( jQuery );	