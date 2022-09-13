$(document).ready(function() {
	
	// On page load or viewport change
	anchorMap("#dashboard", "#map, #grid");
	window.addEventListener("resize", function() {
		
		anchorMap("#dashboard", "#map, #grid");
		
		setTimeout(function() {resizeIfNotEmpty(resizeDashboard)}, 1000);
		
	});
	
	
	
	setTimeout(function() {resizeIfNotEmpty(resizeDashboard)}, 1000);

	
	
	// get map
	var data = {
		"action" : "get"
	};
	
	
	// new checker modal
	$('.selectable').mouseover(function() {
		$(this).addClass("shadow");	
	});
	// new checker modal
	$('.selectable').mouseleave(function() {
		$(this).removeClass("shadow");
	});

	
	// get user map on page load
	$.ajax({
	
		url: "upload_map_dispatcher.php",
		type: "POST",
		data: data,
		success: function(ret) {
			
			var Ret = JSON.parse(ret);
			
			if (!Ret.error) {
				
				$("#map").attr("src", Ret.filename);
				
				
				setTimeout(function() {
					
					var string = sizeGrid("map");
					
					$("#grid").html(string);
					
				}, 500);

				
			} else console.log(Ret.error);
			
			
		}

	});

	
	
	// upload map
	$("#uploadMap").click(function() {
		
		
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
			
			success: function() {
				
				// move checkers on top left corner of the new map
				$(".checker").each(function() {
					let html_id = $(this).attr("id");
					console.log(html_id);
					battlegridPos('update', html_id, '12', '116');
				});
				
				
				location.reload();
			}
			
			
		})
		
		
	});
	
	
	
	
	
	
	
	
	// every checker dragged into the checker remover area must be emptyied from HTML// click remove
	 $("#remove").on("click", function() {
		
		$(".deleted").each(function() {
			let id = $(this).attr("id");
			battlegridPos('hardDelete', id);
		});

		$(".deleted").remove();
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

	



