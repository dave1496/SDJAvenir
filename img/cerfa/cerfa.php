<?php

  /*
   * GET VARIABLES
   */
  
  $image = imagecreatefromjpeg("cerfa.jpg");
  $noir = imagecolorallocate($image, 0, 0, 0);
  $font = "arial.ttf";
  $logement = 600;
  $infoPayment = 260;
  $logement1 = 570;
  $fontSize = 15;

  $ref = $_GET['ref'];
  $name = $_GET['name'];
  $address = $_GET['address'];
  $postalCode = $_GET['postalCode'];
  $city = $_GET['city'];
  $amount = floatval($_GET['amount']);
  $date = $_GET['date'];
  $paymentType = $_GET['paymentType'];
  $sign = $_GET['sign'];

  $mdp = 'BarYohai33';
  $check_sign = hash('sha256', $mdp.$ref.$name.$address.$postalCode.$city.$amount.$date.$paymentType);

  /*
   * FUNCS   
   */

  function num2Letters($number) {

    $units2Letters = array('', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf');
    $tens2Letters = array('', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt');

    $units = $number % 10;
    $tens = ($number % 100 - $units) / 10;
    $hundreds = ($number % 1000 - $number % 100) / 100;

    if ($number == 0) {

      return 'zéro';

    } else {

      // Traitement des unités

      $unitsOut = ($units == 1 and $tens > 0 and $tens != 8 ? 'et-' : '') + $units2Letters[$units];

      // Traitement des dizaines

      if ($tens == 1 and $units > 0) {

        $tensOut = $units2Letters[10 + $units];
        $unitsOut = '';

      } else if ($tens == 7 || $tens == 9) {

        $tensOut = $tens2Letters[$tens] + '-' + ($tens == 7 and $units == 1 ? 'et-' : '') + $units2Letters[10 + $units];
        $unitsOut = '';

      } else {

        $tensOut = $tens2Letters[$tens];

      }

      $tensOut += ($units == 0 and $tens == 8 ? 's' : '');

      // Traitement des centaines

      $hundredsOut = ($hundreds > 1 ? $units2Letters[$hundreds] + '-' : '') + ($hundreds > 0 ? 'cent' : '') + ($hundreds > 1 and $tens == 0 and $units == 0 ? 's' : '');

      // Retour du total

      return $hundredsOut + ($hundredsOut and $tensOut ? '-' : '') + $tensOut + ($hundredsOut and $unitsOut or $tensOut and $unitsOut ? '-' : '') + $unitsOut;
    }

  }

  /*
   * EDIT IMAGE
   */  

  if ($sign == $check_sign) {
   
    header ("Content-type: image/jpeg");

    /*
     * Numéro d'ordre
     */

    imagettftext($image, $fontSize, 0, 920, 105, $noir, $font, $ref);

    /*
     * EDIT Nom,Prenom,Adresse
     */

    imagettftext($image, $fontSize, 0, $logement, 330, $noir, $font, $name);
    imagettftext($image, $fontSize, 0, $logement, 370, $noir, $font, $address);
    imagettftext($image, $fontSize, 0,$logement, 410, $noir, $font, $postalCode." ".$city);

    /*
     * EDIT Sum,Date,Payment
     */

    imagettftext($image, $fontSize, 0, $infoPayment, 354, $noir, $font, $amount.' €');
    imagettftext($image, $fontSize, 0, $infoPayment, 380, $noir, $font, $date);
    imagettftext($image, $fontSize, 0, $infoPayment, 403, $noir, $font, $paymentType);

    /*
     * Number to letter
     */

    imagettftext($image, $fontSize, 0,118, 453, $noir, $font, $amount.' Euro(s)');

    /*
     * Numéro d'ordre
     */

    imagettftext($image, $fontSize, 0, 920,910, $noir, $font, $ref);

    /*
     * EDIT Nom,Prenom,Adresse
     */

    imagettftext($image, $fontSize, 0, $logement1,1321, $noir, $font, $name);
    imagettftext($image, $fontSize, 0, $logement1, 1361, $noir, $font, $address);
    imagettftext($image, $fontSize, 0, $logement1, 1400, $noir, $font, $postalCode." ".$city);

    /*
     * EDIT Sum,Date,Payment
     */
    imagettftext($image, $fontSize, 0, $infoPayment, 1343, $noir, $font, $amount.' €');
    imagettftext($image, $fontSize, 0, $infoPayment, 1388, $noir, $font, $date);
    imagettftext($image, $fontSize, 0, $infoPayment, 1432, $noir, $font, $paymentType);

    /*
     * Number to letter
     */

    imagettftext($image, $fontSize, 0,238, 1486, $noir, $font, $amount.' Euro(s)');

    /*
     *Date
     */

     imagettftext($image, $fontSize, 0,680, 1510, $noir, $font, $date); 


    /*
     * END
     */

    imagejpeg($image);

  } else {

    echo "Sign Error";

  }

?>