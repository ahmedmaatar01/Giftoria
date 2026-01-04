@component('mail::message')
# Thank You, {{ $command->customer_first_name ?? 'Valued' }} {{ $command->customer_last_name ?? 'Customer' }}!

We're delighted to confirm that your order has been received and is now being processed with care.

@component('mail::panel')
**Order Number:** #{{ $command->id }}  
**Order Date:** {{ \Carbon\Carbon::parse($command->placed_at)->format('F d, Y \a\t g:i A') }}  
**Status:** <span style="color: #d4a574; font-weight: bold;">{{ ucfirst($command->status) }}</span>  
**Total Amount:** ${{ number_format($command->total, 2) }}  
@endcomponent

@if($command->gift_card_message)
## Gift Card
@if($command->giftCardTemplate)
Template: {{ $command->giftCardTemplate->name }}  
@endif
Message: {{ $command->gift_card_message }}  
@if($command->gift_card_signature_type === 'text')
Signature: {{ $command->gift_card_signature }}  
@elseif($command->gift_card_signature_type === 'image')
Signature: (image attached in system)  
@endif
@endif

## Items
@foreach($command->commandProducts as $cp)
- {{ $cp->product->name }} (x{{ $cp->quantity }}) – {{ number_format($cp->unit_price,2) }} each (Line: {{ number_format($cp->line_total,2) }})
    @php($customFields = is_array($cp->custom_fields) ? $cp->custom_fields : (json_decode($cp->custom_fields, true) ?? []))
    @if(count($customFields))
    Custom:
    @foreach($customFields as $cf)
      • {{ is_array($cf['name'] ?? null) ? ($cf['name']['en'] ?? $cf['name']['ar'] ?? 'Field') : ($cf['name'] ?? 'Field') }}: {{ $cf['value'] }}
    @endforeach
    @endif
@endforeach

@if($command->shipping_address)
## Shipping Address
{{ $command->shipping_address }}
@endif

@if($command->desired_delivery_at)
**Desired Delivery Date:** {{ \Carbon\Carbon::parse($command->desired_delivery_at)->format('F d, Y') }}
@endif

---

If you have any questions about your order, feel free to reply to this email or contact our support team.

Thank you for choosing Giftoria. We're honored to be part of your special moments.

Best regards,  
**The Giftoria Team**
@endcomponent