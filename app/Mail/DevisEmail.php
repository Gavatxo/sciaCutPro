<?php

namespace App\Mail;

use App\Models\Devis;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DevisEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public Devis $devis,
        public string $customSubject,
        public string $customMessage,
        public string $pdfContent
    ) {
    }

    public function build()
    {
        return $this->subject($this->customSubject)
                    ->view('emails.devis')
                    ->with([
                        'devis' => $this->devis,
                        'customMessage' => $this->customMessage
                    ])
                    ->attachData($this->pdfContent, "devis-{$this->devis->numero}.pdf", [
                        'mime' => 'application/pdf',
                    ]);
    }
}
