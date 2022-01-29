<?php
namespace App\Utils;

class Logger
{
    public static function log($data, $sfx = '_1')
    {
        $file = __dir__.'/../../var/dbgLog/dbg-' . date('Ymd') . $sfx . '.log';
        #$file = 'dbg-' . date('Ymd') . $sfx . '.log';
        $f = fopen($file, 'a+');
        fwrite($f, date('Y-m-d H:i:s') . "\n");
        fwrite($f, print_r($data, 1) . "\n\n");
        fclose($f);
    }
}