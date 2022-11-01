<?php

	

	class BATTLEGRID {
		
		
		private $db;
		private $stmt;
		
		public function __construct($param) {
			
			$this->db = isset($param['db']) && !empty($param['db']) ? $param['db'] : [];
			
			
		}
		
		
	
	
		
		public function get($html_id = false) {
			$result = (!empty($html_id)) ? $this->getPosFromId($html_id) : $this->getPos();
			return $result;
		}
		
		public function put($html_id, $pos_x, $pos_y, $symbol, $color) {
			$result = $this->putPos($html_id, $pos_x, $pos_y, $symbol, $color);
			return $result;
		}
		
		public function update($html_id, $pos_x, $pos_y) {
			$result = $this->updatePos($html_id, $pos_x, $pos_y);
			return $result;
		}
		
		
		public function remove($html_id, $pos_x, $pos_y) {
			
			$result = (!empty($html_id) && !empty($pos_x) && !empty($pos_y)) ? $this->deletePosFromId($html_id, $pos_x, $pos_y) : array();
			
			return $result;
		}
		
		public function hardRemove($html_id) {
			
			$result = (!empty($html_id)) ? $this->deleteElemFromId($html_id) : array();
			
			return $result;
		}
		
		
		private function checkIfElemPresent($html_id = false) {
			
			$Query = 'SELECT * FROM grid_pos';
			
			if ($html_id) $Query .=  ' WHERE html_id = :html_id';

			$stmt = $this->db->prepare($Query);
			if ($html_id) $stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
			$stmt->execute();
			
			$result = $stmt->rowCount();
			
			$this->stmt = $stmt;
			
			return $result;
			
		}
		
		
		private function getPos() {

			$present = $this->checkIfElemPresent();
			
			$res = $this->stmt->fetchAll(PDO::FETCH_ASSOC);

			return $res;

		}
		



		private function getPosFromId($html_id) {
			
			$present = $this->checkIfElemPresent($html_id);

			if ($present == 1) {
				
				$tmpRes = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
				$result = $tmpRes[0];
				
			} else {
				
				$result = array('pos_x' => '', 'pos_y' => '');
			}
			
			
			return $result;
			
		}
		
		
		private function putPos($html_id, $posX, $posY, $symbol, $color) {
			
			
			
			$present = $this->checkIfElemPresent($html_id);
			
			if ($present == 1) {
				
				$result = array("error" => 'Checker name already in use');
				
			} else {
				
				$Query = 'INSERT INTO grid_pos (html_id, pos_x, pos_y, symbol, color, deleted) VALUES (:html_id, :pos_x, :pos_y, :symbol, :color,  0)';

				$stmt = $this->db->prepare($Query);
				$stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
				$stmt->bindParam(":pos_x", $posX, PDO::PARAM_STR);
				$stmt->bindParam(":pos_y", $posY, PDO::PARAM_STR);
				$stmt->bindParam(":symbol", $symbol, PDO::PARAM_STR);
				$stmt->bindParam(":color", $color, PDO::PARAM_STR);
				$stmt->execute();
				
				if ($this->db->lastInsertId() > 0) {
					$result = array("status" => 'ok');
				} else {
					$result = array("error" => 'Cannot save positions');
				}
				
			}
			

			
			return $result;
		}
		
		
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

		private function deletePosFromId($html_id, $posX, $posY) {
			
			$Query = 'UPDATE grid_pos SET pos_x = :pos_x, pos_y = :pos_y, deleted = 1 WHERE html_id = :html_id';

			$stmt = $this->db->prepare($Query);
			$stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
			$stmt->bindParam(":pos_x", $posX, PDO::PARAM_STR);
			$stmt->bindParam(":pos_y", $posY, PDO::PARAM_STR);
			$stmt->execute();
			
			$result = ($stmt->execute() == true) ? array("status" => "ok") : array("error" => "Cannot remove $html_id");
			
			return $result;

		
		}
		
		
		private function deleteElemFromId($html_id) {
			
			// $Query = 'UPDATE grid_pos SET pos_x = :pos_x, pos_y = :pos_y, deleted = 1 WHERE html_id = :html_id';
			$Query = 'DELETE FROM grid_pos WHERE html_id = :html_id and deleted = 1';

			$stmt = $this->db->prepare($Query);
			$stmt->bindParam(":html_id", $html_id, PDO::PARAM_STR);
			// $stmt->bindParam(":pos_x", $posX, PDO::PARAM_STR);
			// $stmt->bindParam(":pos_y", $posY, PDO::PARAM_STR);
			$stmt->execute();
			
			$result = ($stmt->execute() == true) ? array("status" => "ok") : array("error" => "Cannot hard remove $html_id");
			
			return $result;

		
		}
	}
	
	
?>