<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SADAD Payment</title>
    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
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
            <input type="hidden" name="MOBILE_NO" value="{{ $data['MOBILE_NO'] }}">
            <input type="hidden" name="EMAIL" value="{{ $data['EMAIL'] }}">
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

    <link href="https://sadadqa.com/jslib/cards.min.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="https://sadadqa.com/jslib/cards.min.js?v=59"></script>
    <script type="text/javascript" src="https://sadadqa.com/jslib/sadadmain.js?v=59"></script>

    <script>
        // For Hosted/Redirect Payment mode
        window.afterChecksumSubmit = function(response) {
            console.log('afterChecksumSubmit called - Hosted Payment mode');
            
            // Replace body with form and auto-submit to SADAD
            document.body.innerHTML = response;
            
            setTimeout(function() {
                const form = document.getElementById('sadadFinalForm');
                if (form) {
                    console.log('Submitting to SADAD gateway:', form.action);
                    form.submit();
                }
            }, 100);
        };

        // SADAD initialization
        if($('#sadad_cc_container').length>0){
            var tmpAttrErr = '';
            if(!$('#sadad_cc_container').attr('data-cbfunc') || $.trim($('#sadad_cc_container').attr('data-cbfunc'))==''){
                tmpAttrErr = 'Callback function attribute is not set.<br>';
            }
            
            if(tmpAttrErr != ''){
                $('#sadad_cc_container').html('<div id="sadadErrs" style="display:block;">' + tmpAttrErr + '</div>');
            }
        } else {
            alert('Please set the container element.');
        }

        window.sadadGetChecksum = function() {
            console.log('sadadGetChecksum called');
            console.log('Form data:', $('#sadadFinalForm').serialize());
            
            $.ajax({
                type: "POST",
                url: "/sadad/checksum",
                data: $('#sadadFinalForm').serialize(),
                timeout: 30000, // 30 second timeout
                success: function(response) {
                    console.log('Checksum success, response length:', response.length);
                    console.log('Response HTML:', response.substring(0, 500));
                    
                    // Check if afterChecksumSubmit exists
                    if (typeof afterChecksumSubmit === 'function') {
                        console.log('Calling afterChecksumSubmit');
                        try {
                            afterChecksumSubmit(response);
                            console.log('afterChecksumSubmit executed');
                        } catch (e) {
                            console.error('afterChecksumSubmit error:', e);
                            // Fallback
                            document.body.innerHTML = response;
                            setTimeout(() => {
                                const finalForm = document.getElementById('sadadFinalForm');
                                if (finalForm) {
                                    console.log('Submitting form to:', finalForm.action);
                                    finalForm.submit();
                                }
                            }, 100);
                        }
                    } else {
                        // Fallback: manually handle the response
                        console.log('afterChecksumSubmit not found, handling manually');
                        document.body.innerHTML = response;
                        setTimeout(() => {
                            const finalForm = document.getElementById('sadadFinalForm');
                            if (finalForm) {
                                console.log('Submitting form to:', finalForm.action);
                                finalForm.submit();
                            } else {
                                console.error('sadadFinalForm not found in response');
                            }
                        }, 100);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Checksum AJAX error:', {
                        status: status,
                        error: error,
                        statusCode: xhr.status,
                        responseText: xhr.responseText
                    });
                    if (xhr.status === 502) {
                        alert('Server temporarily unavailable. Please try again in a moment.');
                    } else {
                        alert('Payment error: ' + error + ' (Status: ' + xhr.status + ')');
                    }
                }
            });
        };
    </script>
</body>
</html>