<?php

namespace App\Mail;

use App\Models\Command;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
// PDF facade will be available after installing barryvdh/laravel-dompdf


class CommandReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public Command $command;

    public function __construct(Command $command)
    {
        // Preload needed relations for template
        $this->command = $command->load([
            'commandProducts.product',
            'giftCardTemplate'
        ]);
    }

    public function build()
    {
        // If PDF facade exists, generate invoice PDF and attach.
        $mail = $this->subject('Your Giftoria Order Was Received')
            ->markdown('emails.command_received');

        if (class_exists('Barryvdh\\DomPDF\\Facade\\Pdf')) {
            try {
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('invoices.command', [
                    'command' => $this->command
                ]);
                $mail->attachData($pdf->output(), 'invoice-' . $this->command->id . '.pdf', [
                    'mime' => 'application/pdf'
                ]);
            } catch (\Exception $e) {
                Log::warning('Invoice PDF generation failed', [
                    'command_id' => $this->command->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $mail;
    }
}
