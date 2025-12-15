<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quote {{ $quote->quote_no }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111; }
        .row { display:flex; justify-content:space-between; }
        .muted { color:#666; }
        table { width:100%; border-collapse:collapse; margin-top:12px; }
        th, td { border:1px solid #ddd; padding:8px; text-align:left; }
        th { background:#f5f5f5; }
        .totals { margin-top:12px; width: 40%; margin-left:auto; }
        .totals td { border:none; padding:4px 0; }
        .right { text-align:right; }
        h1 { margin:0; font-size:18px; }
        h2 { margin:0; font-size:14px; }
    </style>
</head>
<body>
    <div class="row">
        <div>
            <h1>{{ $tenantName }}</h1>
            <div class="muted">Event Décor Rentals</div>
        </div>
        <div class="right">
            <h2>QUOTE</h2>
            <div><strong>{{ $quote->quote_no }}</strong></div>
            <div class="muted">{{ now()->format('M d, Y') }}</div>
        </div>
    </div>

    <hr>

    <div class="row">
        <div>
            <div><strong>Event Date:</strong> {{ optional($quote->event_date)->format('Y-m-d') ?? '-' }}</div>
            <div><strong>City:</strong> {{ $quote->city ?? '-' }}</div>
            <div><strong>Venue:</strong> {{ $quote->venue ?? '-' }}</div>
        </div>
        <div>
            <div><strong>Event Type:</strong> {{ $quote->event_type ?? '-' }}</div>
            <div><strong>Guests:</strong> {{ $quote->guest_count ?? '-' }}</div>
            <div><strong>Colors:</strong> {{ $quote->theme_colors ?? '-' }}</div>
        </div>
    </div>

    <div style="margin-top:10px;">
        <strong>Notes:</strong>
        <div class="muted">{{ $quote->notes ?? '-' }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Category</th>
                <th class="right">Qty</th>
                <th class="right">Unit</th>
                <th class="right">Line Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($quote->items as $it)
                <tr>
                    <td>{{ $it->name }}</td>
                    <td>{{ $it->category ?? '-' }}</td>
                    <td class="right">{{ $it->qty }}</td>
                    <td class="right">${{ number_format((float)$it->unit_price, 2) }}</td>
                    <td class="right">${{ number_format((float)$it->line_total, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="muted">No items yet (draft quote).</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td class="right muted">Subtotal:</td>
            <td class="right">${{ number_format((float)$quote->subtotal, 2) }}</td>
        </tr>
        <tr>
            <td class="right muted">Tax:</td>
            <td class="right">${{ number_format((float)$quote->tax, 2) }}</td>
        </tr>
        <tr>
            <td class="right"><strong>Total:</strong></td>
            <td class="right"><strong>${{ number_format((float)$quote->total, 2) }}</strong></td>
        </tr>
    </table>

    <p class="muted" style="margin-top:16px;">
        This quote is a draft and may change based on final venue walkthrough, inventory availability, and design details.
    </p>
</body>
</html>
