

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
 * @name	availableCheckers
 * 
 * Create checkers according with received datasets and
 * append them into the grid
 * 
 * @param  data 		object --> array --> .html_id .symbol .color .pos_x .pos_y .deleted
 * 						
 */
function availableCheckers(data) {

	for (let x in data) {

		$("#checkers").append('<div class="checker box rounded ' + colors[data[x].color] + ' bg-gradient position-absolute ui-draggable ui-draggable-handle" id="' + data[x].html_id + '" onmouseup="anchorChecker(this);" style="left:' + data[x].pos_x + 'px;top:' + data[x].pos_y + 'px;"></div>');
		
		// class "bi bi-..." REMOVE from DB
		$("#availSymbols > svg.selectable.bi." + data[x].symbol.replace("bi ", "")).clone().appendTo("#checkers > #" + data[x].html_id).removeClass("m-1 rounded selectable ui-selectee ui-selected");

		$("#" + data[x].html_id).draggable();
		
	}

}	
	
	




/**
* @name 	battlegridPos
* 
* Update checkers positions
* 
* @params			action				string				'get' | 'put' | 'update' | 'delete'
* 					html_id			string || undefined		checker ID
* 					pos_x				string				checker left position
* 					pos_y				string				checker top position
* 					symbol				string				checker symbol name @see checkers.html
* 					color				string				checker color @see colors.conf.battle-grid.js
* 
*/
function battlegridPos(action, html_id, pos_x, pos_y, symbol, color) {


	var posObj = {
		'html_id' : html_id,
		'pos_x' : (pos_x !== undefined) ? pos_x.replace("px", "") : '0',
		'pos_y' : (pos_y !== undefined) ? pos_y.replace("px", "") : '0',
		'symbol' : symbol,
		'color' : color
	};
	

	var data = JSON.stringify(posObj);



	$.post("battlegrid_dispatcher.php", {
		
		"action" : action,
		"data" : data
		
	}, function(ret) {

		var result = JSON.parse(ret);

		// get every available checker
		if (!html_id) availableCheckers(result);
		

		// get only requested checker
		if ((result.pos_x) && (result.pos_y)) {
			
			$("#" + html_id).css({
				"left" : result.pos_x + "px",
				"top" : result.pos_y + "px"
			});
			
		}
		
		if (result.deleted == '1') $("#" + html_id).addClass("deleted");
		if (result.deleted == '0') $("#" + html_id).removeClass("deleted");

		if (result.error) sessionStorage.setItem("error", result.error)
		
		
		// PUT
		if (result.status) sessionStorage.setItem("status", result.status);
		

	});

	

}




function battlegridPos2(action, html_id, pos_x, pos_y, symbol, color) {


	var posObj = {
		'html_id' : html_id,
		'pos_x' : (pos_x !== undefined) ? pos_x.replace("px", "") : '0',
		'pos_y' : (pos_y !== undefined) ? pos_y.replace("px", "") : '0',
		'symbol' : symbol,
		'color' : color
	};
	

	var data = JSON.stringify(posObj);

	$.ajaxSetup({
		beforeSend: function(req, setting) {
			req._data = setting.data
		}
	})

	let superset = $.post("battlegrid_dispatcher.php", {
		
		"action" : action,
		"data" : data
		
	}/* , function(ret) {

		var result = JSON.parse(ret);

		// get every available checker
		if (!html_id) availableCheckers(result);
		

		// get only requested checker
		if ((result.pos_x) && (result.pos_y)) {
			
			$("#" + html_id).css({
				"left" : result.pos_x + "px",
				"top" : result.pos_y + "px"
			});
			
		}
		
		if (result.deleted == '1') $("#" + html_id).addClass("deleted");
		if (result.deleted == '0') $("#" + html_id).removeClass("deleted");

		if (result.error) sessionStorage.setItem("error", result.error)
		
		
		// PUT
		if (result.status) sessionStorage.setItem("status", result.status);
		

	} */).always(function(ret) {
		console.log("ALWAYS "  +ret)

		return ret

	});

	return superset

}






/**
 * @name showAlert
 * 
 * Text and show Bootstrap red alert with icon according to
 * given name.
 * ID tags included must be:
 * 		- [ name ]					main div
 * 		- #title-[ name ]			
 * 		- #msg-[ name ]
 * 
 * @param  name 
 * 
 */

function showAlert(name, titleError, msgError) {

	$("#title-" + name).text(titleError);
	$("#msg-" + name).html(msgError);
	$("#" + name).removeClass("d-none").addClass("show");
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