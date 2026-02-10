<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SADAD Payment</title>
    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script defer src="https://sadadqa.com/jslib/sadad.js"></script>
</head>
<body>
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1>Complete Your Payment</h1>
        <form id="sadadFinalForm" method="post">
            <input type="hidden" name="merchant_id" value="{{ $data['merchant_id'] }}">
            <input type="hidden" name="ORDER_ID" value="{{ $data['ORDER_ID'] }}">
            <input type="hidden" name="TXN_AMOUNT" value="{{ $data['TXN_AMOUNT'] }}">
            <input type="hidden" name="WEBSITE" value="{{ $data['WEBSITE'] }}">
            <input type="hidden" name="CALLBACK_URL" value="{{ $data['CALLBACK_URL'] }}">
            <input type="hidden" name="txnDate" value="{{ $data['txnDate'] }}">
            <input type="hidden" name="VERSION" value="{{ $data['VERSION'] }}">
            <input type="hidden" name="signature" value="{{ $data['signature'] }}">
            @foreach($data as $key => $value)
                @if(str_starts_with($key, 'productdetail'))
                    <input type="hidden" name="{{ $key }}" value="{{ $value }}">
                @endif
            @endforeach
        </form>

        <div id="sadad_cc_container"
             data-i-color="#531232"
             data-cbfunc="sadadGetChecksum"
             style="min-height: 400px; border: 1px solid #ddd; padding: 20px;">
        </div>
    </div>

    <script>
        window.sadadGetChecksum = function() {
            const form = document.getElementById('sadadFinalForm');
            const formData = new FormData(form);

            fetch('/sadad/checksum', {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
                const finalForm = document.getElementById('sadadFinalForm');
                if (finalForm) {
                    finalForm.submit();
                }
            })
            .catch(error => {
                console.error('Checksum error:', error);
                alert('Payment error occurred');
            });
        };
    </script>
</body>
</html>