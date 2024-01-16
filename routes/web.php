<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;


try {
    $uiRoutes = include('ui_route.php');

    if ($uiRoutes) {
        foreach ($uiRoutes as $r) {
            $path = preg_replace('/:([^\/]+)/', '{$1}', $r['path']);
            Route::get($path, function () {
                return view('frontend');
            });
        }
    } else {
        Route::get('/', function () {
            return 'Seja bem vindo!';
        });
    }
} catch (\Exception $e) {

}
