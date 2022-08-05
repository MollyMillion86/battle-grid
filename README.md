# Battle Grid

Battle Grid is a simple RPG battleground grid written in Javascript, PHP and MySQL.<br>
You can see the main project [here](https://github.com/MollyMillion86/DeDDIY).

## Installation

All you need is Apache, PHP 5+ with PDO and MySQL installed, no other packages required!

Once you installed them, create a new database following the instructions in:

```
conf/create-database.sql
```

After that, create a new PDO connection:

```
$userdb = [ DATABASE USER ];
$host = "localhost";
$passdb = [ DATABASE PASSWORD ];
$dbname = [ DATABASE NAME ];


try {	
	
	$db2 = new PDO("mysql:host=" . $host . ";dbname=" . $dbname, $userdb, $passdb);
	
} catch (PDOException $e) {

	die($e->getMessage());
	
}
```

and save it as:

```
conf/DB/db.php
```

## Usage

Open your browser and digit:

```
localhost/battle-grid/home.html
```

<br>
Enjoy!

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPL-2.0 license](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
