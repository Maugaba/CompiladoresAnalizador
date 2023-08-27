<?php
$persona = array(
    "nombre" => "Maria",
    "edad" => 30,
    "profesion" => "Abogada",
    "hobbies" => array("Leer", "Bailar", "Cocinar")
);

echo "Nombre: " . $persona["nombre"] . "\n";
echo "Edad: " . $persona["edad"] . " anios\n";
echo "Profesion: " . $persona["profesion"] . "\n";
echo "Hobbies:\n";
foreach ($persona["hobbies"] as $hobby) {
    echo "- " . $hobby . "\n";
}

function factorial($n) {
    if ($n <= 1) {
        return 1;
    } else {
        return $n * factorial($n - 1);
    }
}

$numero = 5;
$numerocondecimal = 5.05;
$decision = false;
echo "El factorial de $numero es " . factorial($numero) . "\n";

echo "Contando hasta 10:\n";
$i = 1;
while ($i <= 10) {
    echo "$i ";
    $i++;
    $decision = true;
}
echo "\n";

$numero_par = 4;
if ($numero_par % 2 == 0) {
    echo "$numero_par es un numero par.\n";
} else {
    echo "$numero_par es un numero impar.\n";
}

echo "Fin del ejemplo.\n";

$nombre = "Bing";

define("SALUDO", "Hola");

echo SALUDO . $nombre . "\n";

function suma($a, $b) {
  return $a + $b;
}

$resultado = suma(3, 5);
echo "La suma de 3 y 5 es " . $resultado . "\n";

$colores = array("rojo", "verde", "azul");

for ($i = 0; $i < count($colores); $i++) {
  echo "El color en la posicion " . $i . " es " . $colores[$i] . "\n";
}

foreach ($colores as $color) {
  echo "El color es " . $color . "\n";
}

$edades = array("Ana" => 25, "Luis" => 30, "Pedro" => 35);

foreach ($edades as $nombre => $edad) {
  echo "El nombre es " . $nombre . " y la edad es " . $edad . "\n";
}

class Persona {
  private $nombre;
  private $edad;

  public function __construct($nombre, $edad) {
    $this->nombre = $nombre;
    $this->edad = $edad;
  }

  public function getNombre() {
    return $this->nombre;
  }

  public function getEdad() {
    return $this->edad;
  }

  public function setNombre($nombre) {
    $this->nombre = $nombre;
  }

  public function setEdad($edad) {
    $this->edad = $edad;
  }
}

$persona = new Persona("Juan", 40);

echo "El nombre de la persona es " . $persona->getNombre() . "\n";
echo "La edad de la persona es " . $persona->getEdad() . "\n";

$persona->setNombre("Carlos");
$persona->setEdad(45);

echo "El nombre de la persona es " . $persona->getNombre() . "\n";
echo "La edad de la persona es " . $persona->getEdad() . "\n";

class Estudiante extends Persona {
  private $carrera;

  public function __construct($nombre, $edad, $carrera) {
    parent::__construct($nombre, $edad);
    $this->carrera = $carrera;
  }

  public function getCarrera() {
    return $this->carrera;
  }

  public function setCarrera($carrera) {
    $this->carrera = $carrera;
  }
}

$estudiante = new Estudiante("Maria", 20, "Informatica");

echo "El nombre del estudiante es " . $estudiante->getNombre() . "\n

?>