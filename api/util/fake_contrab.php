<?php
    date_default_timezone_set('America/Manaus');
    $now = new DateTime();
    $alarme = "02/07/2019 13:17";
    $data = new DateTime($alarme);
    $on = true;

    while ($on) {
        echo "verificando alarme;<br>";
        $data2 = new DateTime($now->format("d/m/Y H:i"));
        if ($data2->getTimestamp() >= $data->getTimestamp() && $data2->getTimestamp() <= $data->modify("+1 minutes")->getTimestamp()) {
            $on = false;
            echo "Alarme despertado!";
        }
        sleep(2000);
    }
?>