<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>{{ $invoice->invoice_no }}</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; }
    .muted { color:#666; }
    .box { border:1px solid #e5e7eb; border-radius:10px; padding:12px; }
    table { width:100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding:8px; border-bottom: 1px solid #eee; text-align:left; }
    th { background:#f6f7f9; font-size: 11px; text-transform: uppercase; letter-spacing: .03em; }
    .right { text-align:right; }
    .total { font-size: 14px; font-weight: bold; }
  </style>
</head>
<body>

<div class="row" style="align-items:center;">
  <div>
    <img src="{{ public_path('images/brand/logo.png') }}" style="height:55px;" alt="Logo">
  </div>

  <div class="right">
    <div style="font-size:16px; font-weight:700;">{{ $invoice->invoice_no }}</div>
    <div class="muted">Issue: {{ $invoice->issue_date }}</div>
    <div class="muted">Due: {{ $invoice->due_date ?? '-' }}</div>
    <div class="muted">Status: {{ $invoice->status }}</div>
  </div>
</div>

<div style="margin-top:6px;" class="muted">
  Harbour Decor Rentals • 123 Your Street, Toronto, ON • +1 (416) 555-1234 • info@harbourdecor.test
</div>
  <div class="row">
    <div>
      <h2 style="margin:0;">Harbour Decor Rentals</h2>
      <div class="muted">Invoice</div>
    </div>
    <div class="right">
      <div><strong>{{ $invoice->invoice_no }}</strong></div>
      <div class="muted">Issue: {{ $invoice->issue_date }}</div>
      <div class="muted">Due: {{ $invoice->due_date ?? '-' }}</div>
      <div class="muted">Status: {{ $invoice->status }}</div>
    </div>
  </div>

  <div style="height:10px;"></div>

  <div class="box">
    <div class="muted">Customer</div>
    <div><strong>Customer #{{ $invoice->customer_id }}</strong></div>
    @if($invoice->booking_id)
      <div class="muted">Booking: {{ $invoice->booking_id }}</div>
    @endif
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:18%;">Category</th>
        <th>Description</th>
        <th class="right" style="width:10%;">Qty</th>
        <th class="right" style="width:18%;">Unit</th>
        <th class="right" style="width:18%;">Line Total</th>
      </tr>
    </thead>
    <tbody>
      @foreach($invoice->lines as $line)
        <tr>
          <td>{{ $line->category }}</td>
          <td>{{ $line->description }}</td>
          <td class="right">{{ number_format((float)$line->qty, 2) }}</td>
          <td class="right">{{ number_format((float)$line->unit_price, 2) }}</td>
          <td class="right">{{ number_format((float)$line->line_total, 2) }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>

  <div style="height:10px;"></div>

  <div class="row">
    <div style="width:55%;">
      @if($invoice->notes)
        <div class="box">
          <div class="muted">Notes</div>
          <div>{{ $invoice->notes }}</div>
        </div>
      @endif
    </div>

    <div style="width:40%;">
      <div class="box">
        <div class="row"><div class="muted">Subtotal</div><div class="right">{{ number_format((float)$invoice->subtotal, 2) }}</div></div>
        <div class="row"><div class="muted">Discount</div><div class="right">- {{ number_format((float)$invoice->discount, 2) }}</div></div>
        <div class="row"><div class="muted">Tax</div><div class="right">{{ number_format((float)$invoice->tax, 2) }}</div></div>
        <hr style="border:none;border-top:1px solid #eee;margin:10px 0;">
        <div class="row total"><div>Total</div><div class="right">{{ number_format((float)$invoice->total, 2) }}</div></div>
      </div>
    </div>
  </div>

</body>
</html>
