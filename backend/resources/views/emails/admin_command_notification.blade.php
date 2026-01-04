@php
use Illuminate\Support\Carbon;
@endphp

# Email header with logo
<div style="text-align:center;margin-bottom:20px;">
  <img src="https://giftoria.me/images/logo/logoFooter.png" alt="Giftoria" style="height:60px;">
</div>
<x-mail::message>
# New Order Received (ID #{{ $command->id }})

A new order has been placed by **{{ $command->name ?: 'Guest' }}**.

**Placed At:** {{ Carbon::parse($command->placed_at)->format('d/m/Y H:i') }}  
**Status:** {{ ucfirst($command->status) }}  
**Payment:** {{ strtoupper($command->payment_method) }}  
**Total:** {{ number_format($command->total, 2) }}

@isset($command->customer_email)
**Customer Email:** {{ $command->customer_email }}  
@endisset
@isset($command->customer_phone)
**Customer Phone:** {{ $command->customer_phone }}  
@endisset

@if($command->has_gift_card)
> Gift Card Included: Template #{{ $command->gift_card_template_id ?? 'custom' }}
@endif

## Items
@foreach($command->commandProducts as $cp)
- {{ $cp->product->name }} (x{{ $cp->quantity }}) — {{ number_format($cp->line_total,2) }}
  @php($cf = is_array($cp->custom_fields) ? $cp->custom_fields : (json_decode($cp->custom_fields ?? '[]', true) ?: []))
  @foreach($cf as $field)
    - {{ $field['name'] }}: {{ $field['value'] }}
  @endforeach
@endforeach

**Order Total:** {{ number_format($command->total,2) }}

@isset($command->desired_delivery_at)
**Desired Delivery:** {{ Carbon::parse($command->desired_delivery_at)->format('d/m/Y') }}
@endisset

@isset($command->shipping_address)
**Shipping Address:**  
{!! nl2br(e($command->shipping_address)) !!}
@endisset

---
You are receiving this notification because you are configured as an order admin.

Thanks,
Giftoria System
</x-mail::message>
