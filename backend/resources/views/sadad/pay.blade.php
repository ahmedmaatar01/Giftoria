<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SADAD Payment</title>
    
    <!-- jQuery 3.7.1 as required by SADAD SDK -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    
    <!-- Bootstrap -->
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
             data-i-color="#967740"
             data-cbfunc="sadadGetChecksum"
             style="min-height: 400px; border: 1px solid #ddd; padding: 20px;">
        </div>
    </div>

    <!-- SADAD SDK: Only load sadad.js - it will load cards.min.js and sadadmain.js automatically -->
    <script type="text/javascript" src="https://sadadqa.com/jslib/sadad.js"></script>

    <script>
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
                dataType: 'html',
                timeout: 30000,
                success: function(response) {
                    console.log('Checksum HTML received');
                    
                    // Call afterChecksumSubmit with HTML response as required by SADAD
                    if (typeof afterChecksumSubmit === 'function') {
                        afterChecksumSubmit(response);
                    } else {
                        console.error('afterChecksumSubmit not defined');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Checksum AJAX error:', {
                        status: status,
                        error: error,
                        statusCode: xhr.status,
                        responseText: xhr.responseText
                    });
                    alert('Payment error: ' + error);
                }
            });
        };

    </script>
</body>
</html>