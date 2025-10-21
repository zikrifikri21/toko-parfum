<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'SF Toko Parfum') }}</title>
    <meta name="description"
        content="SF Parfum - Toko parfum terpercaya yang menghadirkan koleksi parfum original, tahan lama, dan beraroma elegan. Temukan berbagai pilihan parfum pria dan wanita d">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="parfume, parfum, pewangi">

    <meta property="og:title" content="SF Parfum">
    <meta property="og:description"
        content="SF Parfum - Toko parfum terpercaya yang menghadirkan koleksi parfum original, tahan lama, dan beraroma elegan. Temukan berbagai pilihan parfum pria dan wanita d">
    <meta property="og:image" content="/favicon.ico'">
    <meta property="og:url" content="https://sf-toko.com">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="SF Toko Parfum">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="SF Parfum">
    <meta name="twitter:description"
        content="SF Parfum - Toko parfum terpercaya yang menghadirkan koleksi parfum original, tahan lama, dan beraroma elegan. Temukan berbagai pilihan parfum pria dan wanita d">
    <meta name="twitter:image" content="/favicon.ico">

    <meta name="author" content="SF Toko Parfum">
    <meta name="theme-color" content="#3B82F6">
    <link rel="canonical" href="">

    <link rel="manifest" href="/site.webmanifest">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=poppins:100,200,300,400,500,600,700,800,900&display=swap"
        rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-poppins antialiased">
    @inertia
</body>

</html>
