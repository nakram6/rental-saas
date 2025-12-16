<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function create(Request $request)
    {
        // if you have tenant in props already via middleware/share, it will be available in page.props.tenant
        return Inertia::render('Contact/Index');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:120'],
            'email'   => ['required', 'email', 'max:190'],
            'subject' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:4000'],
        ]);

        // Simple email to your main inbox (change to your business inbox)
        $to = config('mail.from.address');

        try {
            Mail::raw(
                "New Contact Message\n\nName: {$data['name']}\nEmail: {$data['email']}\nSubject: {$data['subject']}\n\nMessage:\n{$data['message']}\n",
                function ($m) use ($to, $data) {
                    $m->to($to)->subject("[Contact] {$data['subject']}");
                    $m->replyTo($data['email'], $data['name']);
                }
            );
        } catch (\Throwable $e) {
            return back()->withErrors([
                'form' => 'Email could not be sent. Please try again later.',
            ])->withInput();
        }

        return back()->with('success', 'Thanks! Your message has been sent.');
    }
}
