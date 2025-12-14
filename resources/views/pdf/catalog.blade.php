<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Catalog</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color:#0f172a; }
        .brand { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
        .title { font-size:22px; font-weight:700; }
        .sub { color:#475569; font-size:12px; margin-top:4px; }
        .grid { display:flex; flex-wrap:wrap; gap:12px; }
        .card { width: 48%; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; }
        .img { width:100%; height:180px; object-fit:cover; display:block; }
        .p { padding:12px; }
        .name { font-weight:700; font-size:14px; }
        .meta { color:#64748b; font-size:12px; margin-top:2px; }
        .price { margin-top:10px; font-weight:700; }
        .badge { float:right; font-size:11px; padding:4px 8px; border-radius:999px; background:#fff7ed; color:#9a3412; border:1px solid #fed7aa; }
        .footer { margin-top:18px; font-size:10px; color:#64748b; }
    </style>
</head>
<body>
    <div class="brand">
        <div>
            <div class="title">{{ $tenantName ?? 'Harbour Decor Rentals' }} — Item Catalog</div>
            <div class="sub">Generated on {{ now()->format('M d, Y') }}</div>
        </div>
        <div style="font-size:11px;color:#64748b;">{{ $tenantEmail ?? '' }}</div>
    </div>

    <div class="grid">
        @foreach($items as $item)
            <div class="card">
                @if(!empty($item['image_abs']))
    <img class="img" src="{{ $item['image_abs'] }}" alt="">
@endif
                <div class="p">
                    <span class="badge">Rental</span>
                    <div class="name">{{ $item['name'] }}</div>
                    <div class="meta">{{ $item['category'] ?? '' }}</div>
                    <div class="price">${{ number_format($item['price'] ?? 0, 0) }}</div>
                </div>
            </div>
        @endforeach
    </div>

    <div class="footer">
        This catalog is for viewing/quoting only. Prices and availability may change.
    </div>
</body>
</html>
