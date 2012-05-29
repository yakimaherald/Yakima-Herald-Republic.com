/**
*
* App Controller
*
**/
(function (win, $){

	//gobals
	var doc = win.document,
		docElem = doc.documentElement,
		head = doc.head || doc.getElementsByTagName("head")[0] || docElem,
		Modernizr = win.Modernizr;

	//global namespace
	yhr = {};

	//extend
	yhr.extend = function(obj, props){
		for(var i in props){
			obj[i] = props[i];
		}
		return yhr;
	};

	yhr.extend( yhr, {
		browser	: {},
		dev		: {},
		support	: {}
	});

	// Check for older browsers
	yhr.browser.ie7 = docElem.className.indexOf("ie7") >= 0;
	yhr.browser.ie8 = docElem.className.indexOf("ie8") >= 0;
	yhr.browser.sSize = window.screen.width;

	//Extend Support for modernizr
	yhr.extend( yhr.support, {
		touch : Modernizr.touch
	});

	// Need to debug?
	yhr.dev.debug = false;

	// Allow us to load files
	yhr.loader = {};
	//Dynamically Load our javascript
	yhr.loader.script = function(src){
		if(!src){return;}
		var aSrc = src.split(",");

		for(var i=0;i < aSrc.length; i++){

			var oScript = document.createElement("script");
				oScript.src = aSrc[i];
				head.appendChild(oScript);

		}
	};

	// Cookie Function thanks quirksmode.org
	yhr.cookie = {
		set: function(name, value, days){
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		get: function(name){
			var nameEQ = name + "=";
			var ca = doc.cookie.split(';');
			for (var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		forget: function(name){
			createCookie(name, "", -1);
		}
	};

	yhr.mediaQueriesSupported = ((win.matchMedia && win.matchMedia( "only all" ).matches) || yhr.browser.ie7 || yhr.browser.ie8 );

	// Don't load cool shit for lame people
	if(!yhr.mediaQueriesSupported){
		return;
	}
	docElem.className += " enhanced";

	//Define our templates
	var body = doc.body,
		tmpl = [
			"home",
			"front",
			"article",
			"search"
		];
	//Check which template is being used
	for(var i=0; i < tmpl.length; i++){
		if(tmpl[i]){
			if($(body).hasClass("type-" + tmpl[i])){
				yhr.tmpl = tmpl[i];
			}
		}
	}


	// Page script loaders
	if(yhr.tmpl === "home"){
		//Slider
		$.getScript("js/plugins/reSlider.js", function(){
			setTimeout(function(){
				$('#reSlider').reSlider({
					animationSpeed: 400,
					slideShowSpeed: 8000,
					slideShow: false
				});
			}, 100);
		});
		$.getScript("js/common.js");
		$.getScript("js/plugins/lionbars.js", function(){
			setTimeout(function(){
				$('#lb').lionbars();
			}, 100);
		});

	}

	if(yhr.tmpl === "front"){
		//Slider
		$.getScript("js/plugins/reSlider.js", function(){
			setTimeout(function(){
				$('#reSlider').reSlider({
					animationSpeed: 400,
					slideShowSpeed: 8000,
					slideShow: false
				});
			}, 100);
		});
		$.getScript("js/common.js");
		$.getScript("js/front.js");
	}

	if(yhr.tmpl === "article"){
		$.getScript("js/common.js");
		$.getScript("js/article.js");
	}

	//Debug
	if(yhr.dev.debug){
		console.log(yhr);
	}

})(window, jQuery);