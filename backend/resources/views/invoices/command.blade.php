<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Invoice #{{ $command->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }

        h1,
        h2 {
            margin: 0 0 8px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            height: 90px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }

        th {
            background: #f5f5f5;
        }

        .totals td {
            border: none;
        }

        .right {
            text-align: right;
        }

        .small {
            font-size: 10px;
            color: #777;
        }

        .section {
            margin-bottom: 18px;
        }
    </style>
</head>

<body>
    <div class="header">
        <img class="logo" src="{{ public_path('images/logo/logoFooter.png') }}" alt="Giftoria" />
    </div>

    <div class="section">
        <h2>Invoice #{{ $command->id }}</h2>
        <div class="small">Generated {{ now()->format(format: 'Y-m-d H:i') }}</div>
        <h2>Order Summary</h2>
        <table>
            <tr>
                <th>Order Date</th>
                <td>{{ \Carbon\Carbon::parse($command->placed_at)->format('F d, Y H:i') }}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>{{ ucfirst($command->status) }}</td>
            </tr>
            <tr>
                <th>Customer</th>
                <td>{{ $command->customer_first_name . ' ' . $command->customer_last_name ?: 'N/A' }}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $command->customer_email ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    @if ($command->shipping_address)
        <div class="section">
            <h2>Shipping Address</h2>
            <p>{{ $command->shipping_address }}</p>
        </div>
    @endif

    @if ($command->desired_delivery_at)
        <div class="section">
            <h2>Desired Delivery Date</h2>
            <p>{{ \Carbon\Carbon::parse($command->desired_delivery_at)->format('F d, Y') }}</p>
        </div>
    @endif

    @if ($command->giftCardTemplate)
        <div class="section">
            <h2>Gift Card</h2>
            <table>
                <tr>
                    <th>Template</th>
                    <td>{{ $command->giftCardTemplate->title ?? 'Template' }}</td>
                </tr>
                <tr>
                    <th>Message</th>
                    <td>{{ $command->gift_card_message ?? '—' }}</td>
                </tr>
                <tr>
                    <th>Signature Type</th>
                    <td>{{ $command->giftCardTemplate->signature_type ?? '—' }}</td>
                </tr>
            </table>
        </div>
    @endif

    <div class="section">
        <h2>Items</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                </tr>
            </thead>
            <tbody>
                @php $grand = 0; @endphp
                @foreach ($command->commandProducts as $idx => $cp)
                    @php
                        $lineTotal = $cp->quantity * $cp->unit_price;
                        $grand += $lineTotal;
                    @endphp
                    <tr>
                        <td>{{ $idx + 1 }}</td>
                        <td>{{ $cp->product->name ?? 'Product' }}</td>
                        <td>{{ $cp->quantity }}</td>
                        <td class="right">{{ number_format($cp->unit_price, 2) }}</td>
                        <td class="right">{{ number_format($lineTotal, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="4" class="right">Grand Total</th>
                    <th class="right">{{ number_format($grand, 2) }}</th>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="small">This invoice was generated automatically and serves as proof of your order with Giftoria.</div>
</body>

</html>
