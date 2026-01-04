<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Redirecting to SADAD</title>
</head>
<body onload="document.forms[0].submit()">
    <form method="POST" action="{{ $url }}">
        @foreach($data as $key => $value)
            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
        @endforeach
    </form>
    <p>Redirecting to payment...</p>
</body>
</html>
