$(document).ready(function() {
	
	// load checkers on startup
	$("#availSymbols").load("checkers.html");


	// get map
	var data = {
		"action" : "get"
	};
	
	// get map on page load
	$.ajax({
	
		url: "upload_map_dispatcher.php",
		type: "POST",
		data: data,
		success: function(ret) {
			
			var Ret = JSON.parse(ret);
			
			if (!Ret.error) {
				
				$("#map").attr("src", Ret.filename);
	
				setTimeout(function() {
					
					let string = sizeGrid("map");
		
					let width = $("body").outerWidth();
					let height = $("body").outerHeight();
					

					$("#loading").removeClass("w-100 h-100").css({
						"width": width + "px",
						"height": height + "px"
					})
					
					$("#grid").html(string);
					
					
					// set loading img at the center of the viewport
					width = $(window).outerWidth();
					height = $(window).outerHeight();
					
					let calculatedTop = (height / 2) - 122;
					
					$("#loading-img").css({
						"top": calculatedTop + "px"
					}).fadeIn("slow");
					
					let calculatedCenter = (height / 2) - 40;
					let calculatedLeft = (width / 2) - 220;
					
					
					$("#lading-text").css({
						"top": calculatedCenter + "px",
						"left": calculatedLeft + "px"
					}).fadeIn("slow");
					
				}, 1000);
	
			} else sessionStorage.setItem("error", Ret.error);
		}
	});

	
	
	
	// On page load or viewport change
	setTimeout(function() {
		anchorMap("#dashboard", "#map, #grid");
	}, 4000)
	
	window.addEventListener("resize", function() {
		anchorMap("#dashboard", "#map, #grid");
		setTimeout(function() {resizeIfNotEmpty(resizeDashboard)}, 4500);
	});
	
	
	
	setTimeout(function() {resizeIfNotEmpty(resizeDashboard)}, 5000);

	
	// get available checkers
	setTimeout(function() {
		battlegridPos("get");
	}, 6000)

	/**
	* New checkers modal
	*/
	$("#availSymbols").selectable();
	$("#availColors").selectable();
	
	// remove loading blank page and get available errors
	setTimeout(function() {
		
		$("#loading").fadeOut("slow");
		
		let errors = sessionStorage.getItem("error");
		
		if (errors !== null) console.log("Errors: " + errors);
	}, 6500);
	
	
	
	
	 /* ************** */
	/* END OF LOADING */
   /* ************** */
	
	
	
	// click on #add-checker-btn
	$("#add-checker-btn").click(function() {
		
		let error = '';
		
		// text
		let text = $("#name").val();
		let ret = text !== '' ?? text.match(/([a-zA-Z0-9]-)+\g/);
		
		if (text === '') error += 'Name required.<br>';
		if (!ret) error += 'Name must contain letters, numbers and/or - _.<br>';
		
	
		let symbol, color; 

		// symbol checked
		if (!$("#availSymbols > svg.selectable").hasClass("ui-selected")) {
			error += 'Symbol required.<br>';
		} else symbol = $("#availSymbols > svg.ui-selected").attr("class").replace("m-1 rounded selectable", "").replace("ui-selectee ui-selected", "").replace("bi", "");
		
		// color checked
		if (!$("#availColors > div.selectable").hasClass("ui-selected")) {
			error += 'Color required.<br>';
		} else color = $("#availColors > div.ui-selected").attr("title");
		
		
		sessionStorage.setItem("error", error);
		
		if (sessionStorage.getItem("error") === '') {
			
			// AJAX
			$.when(battlegridPos("put", text, pos_x, pos_y, symbol, color)).done(function() {

				if (sessionStorage.getItem("error") === "") {

					// clone selected checker
					$("#checkers").append('<div class="checker box rounded ' + colors[color] + ' bg-gradient position-absolute ui-draggable ui-draggable-handle" id="' + text + '" onmouseup="anchorChecker(this);" style="left:12px;top:116px;"></div>');
					$("#availSymbols > svg.ui-selected").clone().appendTo("#checkers > div:last-of-type").removeClass("m-1 rounded selectable ui-selectee ui-selected");
					$("#" + text).draggable();
					
					// reset and close modal
					$("#name").val("");
					$("#availSymbols > svg.ui-selected, #availColors > div.ui-selected").removeClass("ui-selected");
					
					$("#addCheckerModal").modal("hide");
				
				} else showAlert("alert", "Something went wrong...", sessionStorage.getItem("error"));
			
			});
	
		} else {
			// show BS alert if error
			showAlert("alert", "Something went wrong...", sessionStorage.getItem("error"));
			
		}
		
	
	})
	
	
	
	
	
	// upload map
	$("#uploadMap").click(function() {
		
		if ($("#uploadFile").length == 1) {
		
			var fd = new FormData();
			
			var file = $("#uploadFile")[0].files;
			fd.append('file', file[0]);
			fd.append('action', 'put');
			

			$.ajax({
				
				url: 'upload_map_dispatcher.php',
				type: 'POST',
				data: fd,
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				
				success: function(ret) {
					
					let msg = JSON.parse(ret)
					
					if (msg.error) {
						sessionStorage.setItem("error", msg.error)
						// show BS alert if error
						showAlert("alert", "Something went wrong...", sessionStorage.getItem("error"));
					} else {
						
						// move checkers on top left corner of the new map
						$(".checker").each(function() {

							let html_id = $(this).attr("id");
							
							battlegridPos('update', html_id, '12', '116');
						});
					
					
						location.reload();
					}
					
					
						
				}
				
				
			})
		}
		
	});
	
	
	
	

	

	
	// jQuery UI - Drag checkers
	$("#checkers > .checker").each(function(i, v) {
		
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
			// battlegridPos("delete", ui.draggable[0].id, posX.toString(), posY.toString());
			battlegridPos("hardDelete", ui.draggable[0].id);
			
			// checker opacity and hold it on removing area
			// $("#" + ui.draggable[0].id).addClass("deleted");
			$("#" + ui.draggable[0].id).remove();
			

		}
	});
	
	
	

})

	



