<?php

	

	ob_start();
	
	include_once("conf/DB/db.php");
	include_once("class/MAP.class.php");
	
	
	
	if ($_POST['action']) {
	
		
		$error = false;
		$ret = '';
		$user = 'general';
	
		$map = new MAP(array('db' => $db, 'user' => $user));
			
			
			
		// action
		switch ($_POST['action']) {
			
			case 'get': // load map on startup
				$return = $map->get();
			break;
			
			case 'put': // checker moved for first time

				if ($_FILES['file']['name'] == '') {
					
					$ret .= "File name empty";
					$error = true;
					
				} else $name = base64_encode(trim($_FILES['file']['name']));
				
				if (($_FILES['file']['size'] > 3145728)) {
					
					$ret .= "File size > 3 MB";
					$error = true;
					
				}
				
				if (($_FILES['file']['type'] == "image/jpeg") ||
					($_FILES['file']['type'] == "image/png") || 
					($_FILES['file']['type'] == "image/bmp")) {
					
					$type = $_FILES['file']['type'];
					$file = $_FILES['file']['tmp_name'];
	
				} else {
					
					$ret .= "File type must be jpg, png or bmp";
					$error = true;
					
				}

				

				
				if (!$error) {
				
					$map = new MAP(array('db' => $db, 'user' => $user));
					$return = $map->put($name, $type, $file);
	
				}
				
				
				
			break;
			
			/* case 'update': // checker already in battlegrid
				$return = $grid->update($html_id, $pos_x, $pos_y);
			break;
			
			case 'delete': // checker removed
				$return = $grid->remove($html_id, $pos_x, $pos_y);
			break;
			
			case 'hardDelete': // remove button clicked
				$return = $grid->hardRemove($html_id);
			break; */
			
			default:
				$return = array("error" => "No action");
			break;
	
			
		}

		
		if (($error) || isset($return['error'])) $return = array('error' => $ret);


		echo json_encode($return);

	}
	
	
	
	
	
	
	
?>