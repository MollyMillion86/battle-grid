


$(document).ready(function() {
	
	// On page load or viewport change
	anchorMap("#dashboard", "#map, #grid");
	window.addEventListener("resize", function() {
		
		anchorMap("#dashboard", "#map, #grid");
		
		resizeDashboard();
		
		
	});
	
	
	
	resizeDashboard();
	
	
	
	// get map
	var data = {
		"action" : "get"
	};

	// get user map on page load
	$.ajax({
	
		url: "upload_map_dispatcher.php",
		type: "POST",
		data: data,
		success: function(ret) {
			
			var Ret = JSON.parse(ret);
			
			if (!Ret.error) {
				
				$("#map").attr("src", Ret.filename);
				
				var string = sizeGrid("map");
				
				$("#grid").html(string);
				
			} else console.log(Ret.error);
			
			
		}
		
		
		
	})
	
	
	
	
	
	$("#uploadMap").click(function() {
		
		
		var fd = new FormData();
		
		var file = $("#uploadFile")[0].files;
		fd.append("file", file[0]);

		$.ajax({
			
			url: "upload_map_dispatcher.php",
			type: "POST",
			data: fd,
			contentType:false,
			processData:false,
			success: function(ret) {
				
				var obj = JSON.parse(ret)

			}
			
			
		})
		
		
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	// jQuery UI - Drag checkers
	$(".checker").each(function(i, v) {
		
		var id = $(v).attr("id");
		$("#" + id).draggable();

		battlegridPos('get', id);
	
	});


	
	
	
	// delete checkers
	$("#checkerRemover").droppable({
		drop: function(evt, ui) {
			
			var pos = $("#" + ui.draggable[0].id).position();
			var posX = pos.left;
			var posY = pos.top;

			
			// AJAX remove
			battlegridPos("delete", ui.draggable[0].id, posX.toString(), posY.toString());
			
			
			// checker opacity and hold it on removing area
			$("#" + ui.draggable[0].id).addClass("deleted");
			
		}
	});
	
	
	

})

	





/**
* @name		anchorMap
* 
* Anchor map and grid to the bottom border of dashboard
* 
* @param 			posFromItem
* 					posToItem
*/

function anchorMap(posFromItem, posToItem) {

	var pos = $(posFromItem).position();
	
	$(posToItem).css({
		"left" : pos.left,
		"top" : pos.top + $(posFromItem).height()
	});

	
}

/**
* @name		resizeDashboard
* 
* Dashboard width same as grid, remover and adder area widths
* 
*/
	
function resizeDashboard() {
	var outerWidth = $("#grid").outerWidth() + $("#checkerRemover").outerWidth() + $("#checkerAdder").outerWidth();
	$("#dashboard").outerWidth(outerWidth);
}




/**
* @name 	battleGridPos
* 
* Update checkers positions
* 
* @params			action				string				'get' | 'put' | 'update' | 'delete'
* 					html_id				string				checker ID
* 					pos_x				string				checker left position
* 					pos_y				string				checker top position
* 
*/
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
		if (result.deleted == '0') $("#" + html_id).removeClass("deleted");

		if (result.error) console.log(result.error);

	});
	
}





/**
* @name		anchorChecker
* 
* Set checkers position at the center of a square in the grid
* 
* @param		checker			Object
*/

function anchorChecker(checker) {
	
	var id = $(checker).attr("id");
	var pPos = $("#" + id).position();
	
	
	if (!($("#" + id).hasClass("deleted"))) {
		

		 $("#grid div.box.borded").droppable({
			drop: function(event, ui) {
				
				var multipleBase = 60;
				var multipleLeft = 10;
				var multipleTop = -6;
				
				// anchor checker based on proximity to edges
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
		
		
	} else $("#" + id).removeClass('deleted');
	

	






}




/**
* @name 	sizeGrid
* 
* Create a grid according to map dimensions.
* Every square is 60x60 px.
* 
* @param		map				string			map ID 
*
*/
function sizeGrid(map) {

		var widthGrid = 0;
		var heightGrid = 0;
		var numba = 1;
		
		var widthMap = $("#" + map).width();
		var heightMap = $("#" + map).height();

		var letter = 'A';
		var string = '';
		
		while (heightMap > heightGrid) {
			
			string += '<div class="d-flex flex-row">';

			widthGrid = 0;
			numba = 0;
			
			while (widthMap > widthGrid) {

				numba += 1;
				
				string += '<div class="box borded" id="' + letter + numba + '"></div>';
				
				widthGrid += 60;
			}
			
			
			string += '</div>';
			
			letter = String.fromCharCode(letter.charCodeAt(0) + 1);
			
			heightGrid += 60;
			
			
		}
		
		return string;
	
}