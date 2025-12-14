<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\SetCurrentTenant;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',          // 👈 add api routes
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

->withProviders([
        App\Providers\AuthServiceProvider::class,
    ])


    ->withMiddleware(function (Middleware $middleware): void {
        // 👇 important for Sanctum + SPA (Breeze React)
        $middleware->statefulApi();

        // WEB group
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            SetCurrentTenant::class,               // 👈 tenant for web
        ]);

        // API group
        $middleware->api(append: [
            SetCurrentTenant::class,               // 👈 tenant for api
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
