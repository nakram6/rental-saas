<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CatalogReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $publicUrl,
        public string $tenantName,
        public string $pdfBinary
    ) {}

    public function build()
    {
        return $this->subject("Item Catalog - {$this->tenantName}")
            ->view('emails.catalog', [
                'publicUrl' => $this->publicUrl,
                'tenantName' => $this->tenantName,
            ])
            ->attachData($this->pdfBinary, 'item-catalog.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
