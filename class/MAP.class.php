<?php

	

	class MAP {
		
		
		private $db;
		private $user;
		private $stmt;
		
		public function __construct($param) {
			
			$this->db = isset($param['db']) && !empty($param['db']) ? $param['db'] : [];
			$this->user = isset($param['user']) && !empty($param['user']) ? trim($param['user']) : '';
			
			if ($this->user !== '') $this->checkIfElemPresent($this->user);
		
			
		}
		
		
	
	
		
		public function get() {
			

			$result = ($this->user !== '') ? $this->getMap() : array();
			
			return $result;
		}
		
		/* 
		public function put($html_id, $pos_x, $pos_y) {
			
			$result = (!empty($html_id) && !empty($pos_x) && !empty($pos_y)) ? $this->putPos($html_id, $pos_x, $pos_y) : array();
			
			return $result;
		}
		
		public function update($html_id, $pos_x, $pos_y) {
			
			$result = (!empty($html_id) && !empty($pos_x) && !empty($pos_y)) ? $this->updatePos($html_id, $pos_x, $pos_y) : array();
			
			return $result;
		}
		
		
		public function remove($html_id, $pos_x, $pos_y) {
			
			$result = (!empty($html_id) && !empty($pos_x) && !empty($pos_y)) ? $this->deletePosFromId($html_id, $pos_x, $pos_y) : array();
			
			return $result;
		}
		 */
		

		
		
		
		
		private function checkIfElemPresent($user) {
			
			$Query = 'SELECT * FROM maps WHERE user = :user and deleted = 0';
			
			$stmt = $this->db->prepare($Query);
			$stmt->bindParam(":user", $user, PDO::PARAM_STR);
			$stmt->execute();
			

			$this->stmt = $stmt;

			
		}
		
		
		
		
		private function getMap() {
			

			if ($this->user !== '') {
				
				$tmpRes = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
				

				$result = ($this->stmt->rowCount() > 0) ? array('filename' => "img/maps/" . $this->user . "/" . base64_decode($tmpRes[0]['filename'])) : array('filename' => "img/maps/no-map.jpg");
				
				

			} else {
				
				$result = array('error' => 'User not found');
			}
			
			

			return $result;
			
		}
		
		/* 
		private function putPos($html_id, $posX, $posY) {
			
			$Query = 'INSERT INTO grid_pos (html_id, pos_x, pos_y, deleted) VALUES (:html_id, :pos_x, :pos_y, 0)';

			$stmt = $this->db->prepare($Query);
			$stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
			$stmt->bindParam(":pos_x", $posX, PDO::PARAM_STR);
			$stmt->bindParam(":pos_y", $posY, PDO::PARAM_STR);
			$stmt->execute();
			
			if ($this->db->lastInsertId() > 0) {
				$result = array("status" => 'ok');
			} else {
				$result = array("error" => 'Cannot save positions');
			}
			
			
			return $result;
		}
		 */
		
		
		/* 
		private function updatePos($html_id, $posX, $posY) {
			
			$present = $this->checkIfElemPresent($html_id);
			
			if ($present == 1) {
				
				$Query = 'UPDATE grid_pos SET pos_x = :pos_x, pos_y = :pos_y, deleted = 0 WHERE html_id = :html_id';

				$stmt = $this->db->prepare($Query);
				$stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
				$stmt->bindParam(":pos_x", $posX, PDO::PARAM_STR);
				$stmt->bindParam(":pos_y", $posY, PDO::PARAM_STR);
				$stmt->execute();
				
				
				$result = array("status" => 'ok');

			} else {
				
				$result = $this->putPos($html_id, $posX, $posY);
				
			}
			
			return $result;
		
		}
		 */
		
		
		/* private function deletePosFromId($html_id, $posX, $posY) {
			
			$Query = 'UPDATE grid_pos SET pos_x = :pos_x, pos_y = :pos_y, deleted = 1 WHERE html_id = :html_id';

			$stmt = $this->db->prepare($Query);
			$stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
			$stmt->bindParam(":pos_x", $posX, PDO::PARAM_STR);
			$stmt->bindParam(":pos_y", $posY, PDO::PARAM_STR);
			$stmt->execute();
			
			$result = ($stmt->execute() == true) ? array("status" => "ok") : array("error" => "Cannot remove $html_id");
			
			return $result;

		
		} */
	}
	
	
?>