

jQuery.fn.iphoneSwitch = function(start_state, switched_on_callback, switched_off_callback, options) {

	const off_position = -107;
	const on_position = 0;

	var state = start_state == 'off' ? start_state : 'on';
	
	// define default settings
	var settings = {
		mouse_over: 'pointer',
		mouse_out:  'default',
		switch_on_container_path: 'iphone_switch_container_on.png',
		switch_off_container_path: 'iphone_switch_container_off.png',
		switch_path: 'iphone_switch.png',
		switch_height: 54,
		switch_width: 188
	};

	if(options) {
		jQuery.extend(settings, options);
	}

	// create the switch
	return this.each(function() {

		var container;
		var image;

		/* jQuyer.html() doesn't work in XUL, use .innerHTML instead */
		/*
		// make the container
		container = jQuery('<div class="iphone_switch_container" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; position: relative; z-index:150; overflow: hidden"></div>');
		
		// make the switch image based on starting state
		image = jQuery('<img class="iphone_switch" style="position: relative; z-index:160; height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; background-image:url('+settings.switch_path+'); background-repeat:none; background-position:'+(state == 'off' ? off_position : on_position)+'px" src="'+(state == 'off' ? settings.switch_on_container_path : settings.switch_off_container_path)+'" /></div>');

		// insert into placeholder
		jQuery(this).html(jQuery(container).html(jQuery(image)));
		*/
		this.innerHTML = '\
<div class="iphone_switch_container" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; position: relative; z-index:150; overflow: hidden">\
<img class="iphone_switch" style="position: relative; z-index:160; height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; background-image:url('+settings.switch_path+'); background-repeat:none; background-position:'+(state == 'off' ? off_position : on_position)+'px" src="'+(state == 'off' ? settings.switch_on_container_path : settings.switch_off_container_path)+'" />\
</div>\
		';

		jQuery(this).mouseover(function(){
			jQuery(this).css("cursor", settings.mouse_over);
		});

		jQuery(this).mouseout(function(){
			jQuery(this).css("background", settings.mouse_out);
		});

		// click handling
		jQuery(this).click(function() {
			if(state == 'off') {
				jQuery(this).find('.iphone_switch').animate({backgroundPosition: on_position}, "slow", function() {
					jQuery(this).attr('src', settings.switch_off_container_path);
					switched_on_callback();
				});
				state = 'on';
			}
			else {
				jQuery(this).find('.iphone_switch').animate({backgroundPosition: off_position}, "slow", function() {
					switched_off_callback();
				});
				jQuery(this).find('.iphone_switch').attr('src', settings.switch_on_container_path);
				state = 'off';
			}
		});		

	});
	
};
