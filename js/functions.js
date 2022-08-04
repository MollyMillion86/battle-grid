


$(document).ready(function() {
	
	// al caricamento della pagina o quando cambia il viewport
	anchorMap("#dashboard", "#map, #grid");
	window.addEventListener("resize", anchorMap("#dashboard", "#map, #grid"));
	

	
	// jQuery UI - Drag checkers
	$(".checker").each(function(i, v) {
		
		var id = $(v).attr("id");
		$("#" + id).draggable();

		battlegridPos('get', id);
		
		
		
	});


	
	
	
	// elimina pedine
	$("#checkerRemover").droppable({
		drop: function(evt, ui) {
			
			var pos = $("#" + ui.draggable[0].id).position();
			var posX = pos.left;
			var posY = pos.top;

			
			// AJAX remove
			battlegridPos("delete", ui.draggable[0].id, posX.toString(), posY.toString());
			
			
			// rendi la pedina opaca e trattienila nell'area di cancellazione
			$("#" + ui.draggable[0].id).addClass("deleted");
			
		}
	});
	
	
	

})

	






/**
* function anchorMap: ancora la mappa (con griglia) al bordo basso della dashboard
* 
* @param 			posFromItem
* 					posToItem
*/

function anchorMap(posFromItem, posToItem) {
	// preleva bottom e left di #dashboard per usarli per #map
	var pos = $(posFromItem).position();
	
	$(posToItem).css({
		"left" : pos.left,
		"top" : pos.top + $(posFromItem).height()
	});

	
}


	






function battlegridPos(action, html_id, pos_x, pos_y) {


	var posObj = {
		'html_id' : html_id,
		'pos_x' : (pos_x !== undefined) ? pos_x.replace("px", "") : '0',
		'pos_y' : (pos_y !== undefined) ? pos_y.replace("px", "") : '0'
	};
	

	var data = JSON.stringify(posObj);

	$.post("battlegrid_dispatcher.php", {
		
		"action" : action,
		"data" : data
		
	}, function(ret) {

		var result = JSON.parse(ret);

		if ((result.pos_x) && (result.pos_y)) {
			
			$("#" + html_id).css({
				"left" : result.pos_x + "px",
				"top" : result.pos_y + "px"
			});
			
		}
		
		if (result.deleted == '1') $("#" + html_id).addClass("deleted");

		if (result.error) console.log(result.error);

	});
	
}





/**
* posiziona le pedine al centro dei quadrati della griglia di battaglia
*/

function anchorChecker(checker) {
	
	var id = $(checker).attr("id");
	var pPos = $("#" + id).position();
	
	
	if (!($("#" + id).hasClass("deleted"))) {
		
		
	
		// griglia
		 $("#grid div.box.borded").droppable({
			drop: function(event, ui) {
				
				// multipli di 60
				var multipleBase = 60;
				var multipleLeft = 10;
				var multipleTop = -6;
				
				// ancora segnalino in base alla vicinanza con i bordi
				while (Math.max(multipleLeft, ui.position.left) == ui.position.left) multipleLeft = multipleLeft + multipleBase;
				while (Math.max(multipleTop, ui.position.top) == ui.position.top) multipleTop = multipleTop + multipleBase;

				
				var leftPos = (multipleLeft - ui.position.left) > (multipleBase / 2) ? (multipleLeft - multipleBase) + 2 : multipleLeft + 2;
				var topPos = (multipleTop - ui.position.top) > (multipleBase / 2) ? (multipleTop - multipleBase) + 2 : multipleTop + 2;

				$("#" + id).css({
					"left" : leftPos,
					"top" : topPos
				});

				battlegridPos('update', id, leftPos.toString(), topPos.toString());

			}
		});
		
		
	}
	

	






}