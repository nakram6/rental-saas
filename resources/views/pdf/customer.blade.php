<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111; }
    .header { display:flex; justify-content:space-between; margin-bottom: 14px; }
    .brand { font-size: 18px; font-weight: 700; }
    .muted { color:#666; }
    .card { border:1px solid #e5e7eb; border-radius:10px; padding:12px; }
    table { width:100%; border-collapse: collapse; }
    td { padding:6px 0; vertical-align: top; }
    .label { width: 140px; color:#555; }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="brand">{{ $company['name'] ?? 'Company' }}</div>
      <div class="muted">{{ $company['address'] ?? '' }}</div>
      <div class="muted">{{ $company['phone'] ?? '' }} @if(!empty($company['email'])) • {{ $company['email'] }} @endif</div>
    </div>

    <div style="text-align:right">
      <div><strong>Customer Profile</strong></div>
      <div class="muted">Generated: {{ now()->format('Y-m-d') }}</div>
      <div class="muted">Customer ID: {{ $customer->id }}</div>
    </div>
  </div>

  <div class="card">
    <table>
      <tr><td class="label">Name</td><td><strong>{{ $customer->name }}</strong></td></tr>
      <tr><td class="label">Email</td><td>{{ $customer->email ?? '-' }}</td></tr>
      <tr><td class="label">Phone</td><td>{{ $customer->phone ?? '-' }}</td></tr>
      <tr><td class="label">City</td><td>{{ $customer->city ?? '-' }}</td></tr>
      <tr><td class="label">Address</td><td>{{ $customer->address ?? '-' }}</td></tr>
      <tr><td class="label">Status</td><td>{{ $customer->status ?? 'Active' }}</td></tr>
      <tr><td class="label">Notes</td><td>{{ $customer->notes ?? '-' }}</td></tr>
    </table>
  </div>

</body>
</html>
