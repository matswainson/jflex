;(function($){

	function jFlex(el, options){

		var base = this;

		base.autoMode = null;
		base.el = el;
		base.$el = $(el);
		base.index = 0;
		base.defaultOptions = {
			autoplay: false,
			customClass: '',
			fx: 'slide',
			highlightColor: '#555',
			showArrows: false,
			swipeable: true,
			theme: 'light',
			timing: 5000,
			titles: 'top'
		};
		
		base.options = $.extend({}, base.defaultOptions, options);

		function supportsCSS(type) {
			var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
			if (type === 'transition') {
				prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' ');
			}
			for (var i = 0; i < prefixes.length; i++) {
				if (document.createElement('div').style[prefixes[i]] !== undefined) {
					if (type === 'transform') {
						return (prefixes[i] === 'transform') ? prefixes[i] : '-' + prefixes[i].replace('T','-t').toLowerCase();
					} else if (type === 'transition') {
						return (prefixes[i] === 'transition') ? prefixes[i] : '-' + prefixes[i].replace('T','-t').toLowerCase();
					}
				}
			}
			return false;
		}

		function flex(event, autoplay) {

			var idx = (typeof event === 'number') ? event : $(this).index();
			var transform = (!idx) ? '' : base.transformString.replace('{{offset}}', (idx * base.slideWidth));
			var width = 'width: ' + (base.slideCount * base.slideWidth) + 'px';

			base.index = idx;
			base.$slider.attr('style', transform + width);


			if (typeof event !== 'number' && base.autoMode) {
				clearInterval(base.autoMode);
			}
			
			base.$slideTitles.find('li').attr('class', '');

			if (autoplay) {
				if (idx === 0) {
					base.$slideTitles.find('li:eq(' + (base.slideCount - 1) + ')').attr('class', 'title--auto title--right');
					base.$slideTitles.find('li:eq(' + idx + ')').attr('class', 'title--active title--auto');
				} else {
					base.$slideTitles.find('li:eq(' + (idx - 1) + ')').attr('class', (autoplay) ? 'title--right title--auto' : 'title--right').find('.title--l');
					base.$slideTitles.find('li:eq(' + idx + ')').attr('class', (autoplay) ? 'title--active title--auto' : 'title--active');
				}
			} else {
				base.$slideTitles.find('li:eq(' + idx + ')').attr('class', 'title--active');
			}

			base.$arrows.left.toggleClass('jflex--hidden', base.index === 0);
			base.$arrows.right.toggleClass('jflex--hidden', base.index === base.slideCount - 1);

			// trigger css repaint / reflow
			base.$el.offset().height;

		}

		function playBall(){
			var idx = 0;
			base.autoMode = setInterval(function(){
				idx = (idx === base.slideCount - 1) ? 0 : idx + 1;
				flex(idx, true);
			}, base.options.timing);
			base.$slideTitles.children().first().attr('class', 'title--active title--auto');
		}

		function selectFirstTitle(){
			base.$slideTitles.children().first().attr('class', 'title--active');
		}

		function bindFlex(){
			base.$slideTitles.children().bind('click', flex);
			base.$slides.find('img').bind('dragstart', function(event) { event.preventDefault(); });
			$(window).bind('resize orientationchange', flexSize);
		}

		function bindArrows(){
			var arrowHTML = '<div class="jflex-arrow jflex-arrow--left jflex--hidden"></div>';
			arrowHTML += '<div class="jflex-arrow jflex-arrow--right"></div>';
			$('.jflex--wrapper').append(arrowHTML);

			function tapArrow() {
				var direction = $(this).hasClass('jflex-arrow--left') ? 'left' : 'right';
				if (base.autoMode) {
					clearInterval(base.autoMode);
				}
				if (base.index === 0 && direction === 'left' ||
					base.index === base.slideCount - 1 && direction === 'right') {
					return;
				}
				var newIndex = direction === 'left' ? base.index - 1 : base.index + 1;
				flex(newIndex);
			}
			$('.jflex-arrow').bind('click', tapArrow);
			base.$arrows = {
				left: $('.jflex-arrow--left'),
				right: $('.jflex-arrow--right')
			};
		}

		function bindTouch(){

			var diff = 0,
				direction,
				origMouseX;

			function dragStart(event) {
				if (base.autoMode) {
					clearInterval(base.autoMode);
				}
				var orig = (event.type === 'mousedown') ? event.originalEvent : event.originalEvent.touches[0];
				origMouseX = orig.pageX;
				base.$slider.bind('touchmove', dragMove)
							.bind('mousemove', dragMove)
							.bind('mouseleave', dragOff)
							.bind('mouseup', dragOff)
							.bind('touchend', dragOff)
							.bind('touchcancel', dragOff)
							.removeClass('slides--anim');
				base.$slideTitles.children().removeClass('title--auto');
			}

			function dragMove(event) {
				var origEv = (event.type === 'touchmove') ? event.originalEvent.touches[0] : event.originalEvent;
				var mouseX = origEv.pageX;
				diff = Math.round(mouseX - origMouseX);
				direction = (diff < 0) ? '<' : '>';
				var offset =  Math.abs((base.index * base.slideWidth) - diff);
				if (direction === '>' && base.index === 0 ||
					direction === '<' && base.index === (base.slideCount - 1)) {
					return;
				}
				base.$slider.attr('style', base.transformString.replace('{{offset}}', offset) + 'width: ' + (base.slideWidth * base.slideCount) + 'px;');
			}

			function dragOff(event) {
				var newIndex = (direction === '<') ? base.index + 1 : base.index - 1,
					origEv = (event.type === 'touchend' || event.type === 'touchcancel') ? event.originalEvent.changedTouches[0] : event.originalEvent;
				var mouseX = origEv.pageX,
					offset = base.index * base.slideWidth;
				diff = Math.round(mouseX - origMouseX);
				base.$slider.unbind('touchmove', dragMove)
							.unbind('mousemove', dragMove)
							.unbind('mouseleave', dragOff)
							.unbind('mouseup', dragOff)
							.unbind('touchend', dragOff)
							.unbind('touchcancel', dragOff)
							.addClass('slides--anim');
				if (direction === '>' && base.index === 0 ||
					direction === '<' && base.index === (base.slideCount - 1)) {
					return;
				}
				if (diff > 140 || diff < -140) {
					flex(newIndex);
					return;
				}
				base.$slider.attr('style', base.transformString.replace('{{offset}}', offset) + 'width: ' + (base.slideWidth * base.slideCount) + 'px;');
			}

			base.$slider.bind('touchstart', dragStart);
			base.$slider.bind('mousedown', dragStart);

		}

		function setGlobals(){
			base.$el.addClass('jFlex');
			base.$slider = base.$el.children();
			base.$slides = base.$slider.children();
			base.slideCount = base.$slides.length;
			base.slideWidth = base.$el.width();

			var cssTransforms = supportsCSS('transform');
			if (cssTransforms) {
				base.transformString = cssTransforms + ': translate3d(-{{offset}}px, 0, 0); ';
			} else {
				base.transformString = 'left: -{{offset}}px; ';
			}

			base.$slides.width(base.slideWidth + 'px');
			base.$el.children().width(base.slideCount * base.slideWidth + 'px');

			var animStyle = cssTransforms ? 'slides--anim-css' : 'slides--anim-js';
			base.$slideTitles = $('<ul class="slides--titles ' + animStyle + '"></ul>');
		}

		function setTitleAnimationTiming() {
			var cssTransitions = supportsCSS('transition');
			if (!cssTransitions) {
				return;
			}
			var highlightColor = (base.options.theme === 'dark' && base.options.highlightColor === '#555') ? '#fff' : base.options.highlightColor,
				seconds = base.options.timing / 1000,
				style = document.createElement('style');
			var css = '.slides--titles li.title--auto.title--active .title--l { ' + cssTransitions + ': all linear ' + seconds + 's; }';
				css+= '.slides--titles li .title--l {background: ' + highlightColor +';}';
				css+= '.slides--titles .title--active .title--t, .jflex--dark .slides--titles .title--active .title--t {color: ' + highlightColor + ';}';
			style.type = 'text/css';
			style.appendChild(document.createTextNode(css));
			$('body').append(style);
		}

		function flexAnimated(){
			base.$slider.addClass('slides--anim');
		}

		function flexSize(){
			var transform = !base.index ? '' : 'transform: translate3d(-' + (base.index * base.slideWidth) + 'px, 0, 0); ';
			base.slideWidth = base.$el.width();
			base.$slider.attr('style', transform + 'width: ' + (base.slideCount * base.slideWidth) + 'px');
			base.$slides.width(base.slideWidth + 'px');
		}

		function flexGlobals(){
			var baseClasses = 'flex jFlex ',
				customClass = base.options.customClass ? base.options.customClass + ' ' : '',
				sizeHtml = 'jflex--' + base.$slides.length.toString(),
				themeHtml = base.options.theme === 'dark' ? ' jflex--dark': '';
			baseClasses += customClass + sizeHtml + themeHtml;
			base.$el.attr('class', baseClasses);
		}

		function flexTitles(){
			var titleLi;
			base.$slider.wrap('<div class="jflex--wrapper"></div>');
			if (base.options.titles === 'bottom') {
				base.$el.append(base.$slideTitles);
				titleLi = '<li data-title="{{i}}"><span class="title--l"></span><span class="title--t">{{title}}</span></li>';
			} else {
				base.$el.prepend(base.$slideTitles);
				titleLi = '<li data-title="{{i}}"><span class="title--t">{{title}}</span><span class="title--l"></span></li>';
			}
			var titles = '';
			for (var i = 0; i < base.slideCount; i++) {
				var sTitle = $(base.$slides[i]).attr('data-title') ? $(base.$slides[i]).attr('data-title') : '';
				titles += titleLi.replace('{{i}}', i).replace('{{title}}', sTitle);
			}
			base.$slideTitles.append(titles);
			if (base.options.autoplay && base.options.timing !== '5000') {
				setTitleAnimationTiming();
			}
			base.$slideTitles.height();
		}

		base.init = function(){

			setGlobals();

			if (base.slideCount < 2) {
				console.error('Your HTML must contain at least two slides to flex.');
				return;
			}

			flexGlobals();
			flexTitles();
			bindFlex();

			if (typeof base.options.fx === 'string' && base.options.fx === 'slide') {
				flexAnimated();
			}

			if (base.options.swipeable) {
				bindTouch();
			}

			if (base.options.showArrows) {
				bindArrows();
			}

			if (base.options.autoplay) {
				playBall();
			} else {
				selectFirstTitle();
			}

		};

		base.init();

	}
	
	$.fn.jFlex = function(options){
		return this.each(function(){
			(new jFlex(this, options));
		});
	};

})(jQuery);