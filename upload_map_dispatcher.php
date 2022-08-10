<?php

	

	ob_start();
	
	include_once("conf/DB/db.php");
	
	if (isset($_POST['action'])) {
		
		$error = false;
		$ret = '';
		
		include_once("class/MAP.class.php");
		
		
		if ($_POST['action'] == 'get') {
			
			
			$user = 'general';
			
			$map = new MAP(array('db' => $db, 'user' => $user));
			
			$return = $map->get();
			
			
			
			
		} else {
			
		
		
		
			if ($_FILES['file']['name'] == '') {
				
				$ret .= "File name empty<br>";
				$error = true;
			}
			
			if (($_FILES['file']['size'] > 3145728)) {
				
				$ret .= "File size > 3 MB<br>";
				$error = true;
			}
			
			if (($_FILES['file']['type'] !== "image/jpeg") ||
				($_FILES['file']['type'] !== "image/png") || 
				($_FILES['file']['type'] !== "image/bmp")) {
		
				$ret .= "File type must be jpg, png or bmp<br>";
				$error = true;
			}
		
		}
		
		// print_r($_FILES);
		// image/jpeg
		// image/png
		// image/bmp
		// 3145728 bytes = 3 MB
		
		/* if (!$error) {
			
			$user = 'general';
			
			$user64 = base64_encode($user);
			$name = base64_encode(trim($_FILES['file']['name']));
			$type = $_FILES['file']['type'];
			$file = $_FILES['file']['tmp_name'];
			
			$err = file_put_contents('img/maps/$user/map.$type', file_get_contents($_FILES['file']['tmp_name']));
			
			
			// if ($err > 0) {
				
				switch ($_POST['action']) {
					
					case 'get': // refresh map
						$return = $grid->get();
					break;
					
					case 'put': // map updated for first time
						$return = $grid->put($user64, $name, $type, $file);
					break;
					
					case 'update': // map updated
						$return = $grid->update();
					break;
					
					case 'delete': // map removed
						$return = $grid->remove();
					break;
					
					default:
						$return = array("error" => "No action");
					break;
					
				}
				
			} else {
				
				$ret .= "Cannot save file<br>";
				$error = true;
				
			}
			
		
			
			
		} else {
			
			$return = array("error" => $ret);
			
			
		} */

		echo json_encode($return);

	}
	
	
	
	
?>