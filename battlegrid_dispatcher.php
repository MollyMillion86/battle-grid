<?php

	

	ob_start();
	
	include_once("conf/DB/db.php");
	include_once("class/BATTLEGRID.class.php");

	
	if ($_POST['action']) {
		

		$grid = new BATTLEGRID(array('db' => $db));
		
		
		$data = json_decode($_POST['data'], true);
		
		
		$html_id = isset($data['html_id']) ? trim($data['html_id']) : false;
		$pos_x = isset($data['pos_x']) ? trim($data['pos_x']) : '';
		$pos_y = isset($data['pos_y']) ? trim($data['pos_y']) : '';
		$symbol = isset($data['symbol']) ? trim ($data['symbol']) : '';
		$color = isset($data['color']) ? trim ($data['color']) : '';
	
	
		// action
		switch ($_POST['action']) {
			
			case 'get': // refresh page
				$return = $grid->get($html_id);
			break;
			
			case 'put': // checker moved for first time
				$return = $grid->put($html_id, $pos_x, $pos_y, $symbol, $color);
			break;
			
			case 'update': // checker already in battlegrid
				$return = $grid->update($html_id, $pos_x, $pos_y);
			break;
			
			case 'delete': // checker removed
				$return = $grid->remove($html_id, $pos_x, $pos_y);
			break;
			
			case 'hardDelete': // remove button clicked
				$return = $grid->hardRemove($html_id);
			break;
			
			default:
				$return = array("error" => "No action");
			break;
		}

		
		echo json_encode($return);
		
		
	}
	
	
?>