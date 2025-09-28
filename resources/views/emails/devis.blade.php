<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Devis {{ $devis->numero }}</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto;">
        <div style="white-space: pre-line; margin-bottom: 20px;">{{ $customMessage }}</div>

        <hr style="border: 1px solid #eee; margin: 20px 0;">

        <p style="color: #666; font-size: 12px;">
            Ce message a été envoyé automatiquement depuis {{ $devis->company->name }}.
        </p>
    </div>
</body>

</html>
