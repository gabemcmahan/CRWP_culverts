/**
 * @author gmcmahan
 */


$(document).ready(function() { 


		$(".fancybox").fancybox();

	  $('#panelToggle').click(function() {
	    $("#visualizationsBlock").animate({width: 'toggle'});
	    $("#holder_table").animate({width: 'toggle'});
	    
	
		if ($("#MapHolder").css("left") == '720px'){
			
			$("#panelToggle").animate({left: '10px'}, function() {
					$("#togImage").attr('src', 'img/arrow-next_tog.png');
			} );
			
			$("#MapHolder").animate({left: '40px'}, function() {
	    	// Animation complete.
	    	
	    	var mapCent = map.getCenter()
	    	google.maps.event.trigger(map, 'resize')
	    	map.setCenter(mapCent)
	    	
	    	});
	    }
	    

		else {
			$("#MapHolder").animate({left: '720px'});
			
			$("#togImage").attr('src', 'img/arrow-prev_tog.png');
			
			$("#panelToggle").animate({left: '680px'}, function() {
	    	// Animation complete.
	    	var mapCent = map.getCenter()
	    	google.maps.event.trigger(map, 'resize')
	    	map.setCenter(mapCent)
    	
    	});
			//

			
	    	
	    	}
	    	});

});