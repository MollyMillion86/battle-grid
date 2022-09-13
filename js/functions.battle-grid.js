

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
	var outerWidth = $("#grid").outerWidth() + $("#checkerAdder").outerWidth();
	$("#dashboard").outerWidth(outerWidth);
}



/**
* @name		 resizeIfNotEmpty
* 
* Run function resizeDashboard if grid is completely created
* 
* @params			resizeDashboard		function
* 
*/
function resizeIfNotEmpty(resizeDashboard) {	
	
	let div = document.getElementById("grid");
	
	if (div.childNodes.length > 0) resizeDashboard();
	
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
		let deltaWidth = 0;
		let deltaHeight = 0;
		
		while (heightMap > heightGrid) {
			
			string += '<div class="d-flex flex-row">';

			widthGrid = 0;
			numba = 0;
			
			while (widthMap > widthGrid) {

				numba += 1;
				
				string += '<div class="box borded" id="' + letter + numba + '"></div>';
				
				widthGrid += 60;
				
				// if (widthGrid > widthMap) return widthGrid;
				
			}
			
			
			string += '</div>';
			
			letter = String.fromCharCode(letter.charCodeAt(0) + 1);
			
			heightGrid += 60;
			
			// if (heightGrid > heightMap) return heightGrid;
		}
		
		
		
		
		// black border on right
		if (widthMap < widthGrid) deltaWidth = widthGrid - widthMap;
		if (heightMap < heightGrid) deltaHeight = heightGrid - heightMap;
		
		$("#" + map).css({
			"border-right" : deltaWidth + "px solid #5E4A3F",
			"border-bottom" : deltaHeight + "px solid #5E4A3F"
		})
		
		
		return string;
		
		
		
		
	
}