<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Devis {{ $devis->numero }}</title>
    <style>
        @page {
            margin: 2cm;

            @bottom-center {
                content: "Page " counter(page) " sur " counter(pages);
                font-size: 10px;
                color: #666;
            }
        }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .header h1 {
            font-size: 28px;
            color: #1e40af;
            margin: 0;
            font-weight: bold;
        }

        .header .numero {
            font-size: 16px;
            color: #6b7280;
            margin-top: 5px;
        }

        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }

        .info-left,
        .info-right {
            display: table-cell;
            width: 48%;
            vertical-align: top;
        }

        .info-right {
            text-align: right;
        }

        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .info-box h3 {
            margin: 0 0 15px 0;
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
        }

        .info-box p {
            margin: 5px 0;
            font-size: 11px;
        }

        .chantier-section {
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
        }

        .chantier-section h3 {
            margin: 0 0 10px 0;
            color: #1e40af;
            font-size: 14px;
        }

        .prestations-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-size: 11px;
        }

        .prestations-table thead {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
        }

        .prestations-table th {
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
        }

        .prestations-table th:nth-child(2),
        .prestations-table th:nth-child(3),
        .prestations-table th:nth-child(4),
        .prestations-table th:nth-child(5) {
            text-align: center;
        }

        .prestations-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
        }

        .prestations-table tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .prestations-table tbody tr:hover {
            background: #f1f5f9;
        }

        .prestations-table td:nth-child(2),
        .prestations-table td:nth-child(3),
        .prestations-table td:nth-child(4),
        .prestations-table td:nth-child(5) {
            text-align: center;
        }

        .description-detail {
            font-style: italic;
            color: #6b7280;
            font-size: 10px;
            margin-top: 3px;
        }

        .totals-section {
            margin-top: 30px;
            display: table;
            width: 100%;
        }

        .totals-left {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }

        .totals-right {
            display: table-cell;
            width: 40%;
            vertical-align: top;
        }

        .totals-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        .totals-table td {
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
        }

        .totals-table .total-label {
            background: #f8fafc;
            font-weight: bold;
            text-align: right;
        }

        .totals-table .total-value {
            text-align: right;
            font-weight: bold;
        }

        .total-ttc {
            background: #1e40af !important;
            color: white !important;
            font-size: 14px;
        }

        .notes-section {
            background: #fffbeb;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }

        .notes-section h4 {
            margin: 0 0 10px 0;
            color: #92400e;
            font-size: 12px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #6b7280;
            text-align: center;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .status-brouillon {
            background: #f3f4f6;
            color: #374151;
        }

        .status-envoye {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-signe {
            background: #dcfce7;
            color: #166534;
        }

        .status-refuse {
            background: #fee2e2;
            color: #dc2626;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>DEVIS</h1>
        <div class="numero">N° {{ $devis->numero }}</div>
        <div style="margin-top: 10px;">
            <span class="status-badge status-{{ $devis->status }}">{{ ucfirst($devis->status) }}</span>
        </div>
    </div>

    <div class="info-section">
        <div class="info-left">
            <div class="info-box">
                <h3>📍 Client</h3>
                <p><strong>{{ $devis->client->name }}</strong></p>
                @if ($devis->client->address)
                    <p>{{ $devis->client->address }}</p>
                @endif
                @if ($devis->client->postal_code || $devis->client->city)
                    <p>{{ $devis->client->postal_code }} {{ $devis->client->city }}</p>
                @endif
                @if ($devis->client->phone)
                    <p>📞 {{ $devis->client->phone }}</p>
                @endif
                @if ($devis->client->email)
                    <p>✉️ {{ $devis->client->email }}</p>
                @endif
            </div>
        </div>

        <div class="info-right">
            <div class="info-box">
                <h3>📄 Informations devis</h3>
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($devis->created_at)->format('d/m/Y') }}</p>
                @if ($devis->date_intervention)
                    <p><strong>Intervention prévue:</strong>
                        {{ \Carbon\Carbon::parse($devis->date_intervention)->format('d/m/Y') }}</p>
                @endif
                <p><strong>Validité:</strong> 30 jours</p>
                @if ($devis->date_envoi)
                    <p><strong>Envoyé le:</strong> {{ \Carbon\Carbon::parse($devis->date_envoi)->format('d/m/Y') }}</p>
                @endif
            </div>
        </div>
    </div>

    @if ($devis->chantier_name || $devis->chantier_address)
        <div class="chantier-section">
            <h3>🏗️ Chantier: {{ $devis->chantier_name }}</h3>
            @if ($devis->chantier_address)
                <p>{!! nl2br(e($devis->chantier_address)) !!}</p>
            @endif
        </div>
    @endif

    <table class="prestations-table">
        <thead>
            <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 12%;">Quantité</th>
                <th style="width: 10%;">Unité</th>
                <th style="width: 14%;">Prix unitaire HT</th>
                <th style="width: 14%;">Total HT</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($devis->lignes as $ligne)
                <tr>
                    <td>
                        <strong>{{ $ligne->description }}</strong>
                        @if ($ligne->description_detail)
                            <div class="description-detail">{{ $ligne->description_detail }}</div>
                        @endif
                    </td>
                    <td>{{ number_format($ligne->quantity, 2, ',', ' ') }}</td>
                    <td>{{ $ligne->unit }}</td>
                    <td>{{ number_format($ligne->unit_price, 2, ',', ' ') }} €</td>
                    <td>{{ number_format($ligne->total, 2, ',', ' ') }} €</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-section">
        <div class="totals-left">
            @if ($devis->notes)
                <div class="notes-section">
                    <h4>📝 Notes et conditions</h4>
                    <p>{!! nl2br(e($devis->notes)) !!}</p>
                </div>
            @endif
        </div>

        <div class="totals-right">
            <table class="totals-table">
                <tr>
                    <td class="total-label">Total HT :</td>
                    <td class="total-value">{{ number_format($devis->total_ht, 2, ',', ' ') }} €</td>
                </tr>
                <tr>
                    <td class="total-label">TVA (20%) :</td>
                    <td class="total-value">{{ number_format($devis->total_ht * 0.2, 2, ',', ' ') }} €</td>
                </tr>
                <tr class="total-ttc">
                    <td class="total-label">Total TTC :</td>
                    <td class="total-value">{{ number_format($devis->total_ttc, 2, ',', ' ') }} €</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        <p>Conditions de paiement : 30 jours fin de mois</p>
        <p>Devis valable 30 jours - TVA non applicable, art. 293 B du CGI</p>
        <p>En cas d'acceptation, merci de nous retourner ce devis signé avec la mention "Bon pour accord"</p>
    </div>
</body>

</html>
