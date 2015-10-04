# [jFlex](http://matswainson.github.io/jflex/)
![jFlex](http://matswainson.com/github/jflex.png)
### Touch-device friendly jQuery carousel plugin.

Demo: [matswainson.github.io/jflex/](http://matswainson.github.io/jflex/)

### Supports:

- Android 4.1+
- Chrome 31+
- Firefox 38+
- IE 9+
- Opera 30+
- Safari iOS 7.1+
- Safari 8+

### Options

* __arrows__ _true, false_
* __autoplay__ _true, false_
* __swipeable__ _true, false_
* __titles__ _bottom, top_
* __timing (ms)__ _number (5000)_

### How to use

<pre>&lsaquo;div class="flex"&rsaquo;  
	&lsaquo;ul class="slides"&rsaquo;  
		&lsaquo;li data-title="Slide 1"&rsaquo;Slide 1&lsaquo;/li&rsaquo;  
		&lsaquo;li data-title="Slide 2"&rsaquo;Slide 2&lsaquo;/li&rsaquo;
		&lsaquo;li data-title="Slide 3"&rsaquo;Slide 3&lsaquo;/li&rsaquo;  
	&lsaquo;/ul&rsaquo;  
&lsaquo;/div&rsaquo;</pre>

<pre>$('.flex').jFlex({
	arrows: true,
	autoplay: true,
	timing: 5000,
	titles: 'bottom'
});</pre>