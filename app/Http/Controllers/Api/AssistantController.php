<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

use App\Models\AssistantSession;
use App\Models\AssistantMessage;

use App\Services\AvailabilityService;
use App\Services\QuoteService;

class AssistantController extends Controller
{
    public function chat(Request $request)
    {
        $data = $request->validate([
            'message' => ['required','string','max:2000'],
            'history' => ['nullable','array'],
            'tenantName' => ['nullable','string','max:120'],
            'sessionId' => ['nullable','integer'],

            // ✅ meta (shared tool payload)
            'meta' => ['nullable','array'],

            // ✅ Availability meta
            'meta.date' => ['nullable','date'],
            'meta.start_time' => ['nullable','date_format:H:i'],
            'meta.end_time' => ['nullable','date_format:H:i'],

            // ✅ Quote meta
            'meta.event_date' => ['nullable','date'],
            'meta.city' => ['nullable','string','max:120'],
            'meta.venue' => ['nullable','string','max:180'],
            'meta.event_type' => ['nullable','string','max:80'],
            'meta.guest_count' => ['nullable','integer','min:1','max:5000'],
            'meta.theme_colors' => ['nullable','string','max:120'],
            'meta.budget' => ['nullable','numeric','min:0','max:999999'],
            'meta.notes' => ['nullable','string','max:2000'],
        ]);

        $tenantName = $data['tenantName'] ?? 'Event Decor Rentals';

        // ✅ Find or create session
        $session = null;
        if (!empty($data['sessionId'])) {
            $session = AssistantSession::find($data['sessionId']);
        }

        if (!$session) {
            $session = AssistantSession::create([
                'tenant_name' => $tenantName,
                'source' => 'public',
            ]);
        }

        $userText = $data['message'];

        // ✅ Log user message (always)
        AssistantMessage::create([
            'assistant_session_id' => $session->id,
            'role' => 'user',
            'content' => $userText,
        ]);

        /**
         * ✅ TOOL MODE: Availability check
         * message="__CHECK_AVAILABILITY__" + meta.date (+ optional times)
         */
        if ($userText === '__CHECK_AVAILABILITY__') {
            $meta = $data['meta'] ?? [];

            if (empty($meta['date'])) {
                $reply = "Sure — what’s the event date (YYYY-MM-DD)? (Optional: start & end time too)";
            } else {
                $tenant = app('currentTenant');
                if (!$tenant) {
                    $reply = "Sorry — I couldn't detect the tenant. Please refresh and try again.";
                } else {
                    /** @var AvailabilityService $svc */
                    $svc = app(AvailabilityService::class);

                    $date = $meta['date'];
                    $start = $meta['start_time'] ?? null;
                    $end = $meta['end_time'] ?? null;

                    $res = $svc->check($tenant->id, $date, $start, $end);

                    if ($res['available']) {
                        $reply = "✅ Yes — we’re available on {$date}" . ($start && $end ? " ({$start}–{$end})" : "") . ".";
                    } else {
                        $reply = "❌ Sorry — that slot is not available on {$date}" . ($start && $end ? " ({$start}–{$end})" : "") . ".";
                        $suggested = $svc->nextAvailableDates($tenant->id, $date);
                        if (!empty($suggested)) {
                            $reply .= " Next available dates: " . implode(', ', $suggested) . ".";
                        }
                    }

                    $reply .= " Want a quick quote? Tell me guest count, colors/theme, and your budget.";
                }
            }

            // ✅ Log assistant message
            AssistantMessage::create([
                'assistant_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $reply,
            ]);

            return response()->json([
                'reply' => $reply,
                'sessionId' => $session->id,
                'intent' => 'availability',
            ]);
        }

        /**
         * ✅ TOOL MODE: Create Draft Quote + PDF
         * message="__CREATE_DRAFT_QUOTE__" + meta.event_date (+ other fields)
         */
        if ($userText === '__CREATE_DRAFT_QUOTE__') {
            $meta = $data['meta'] ?? [];

            $tenant = app('currentTenant');
            if (!$tenant) {
                $reply = "Sorry — I couldn't detect the tenant. Please refresh and try again.";

                AssistantMessage::create([
                    'assistant_session_id' => $session->id,
                    'role' => 'assistant',
                    'content' => $reply,
                ]);

                return response()->json([
                    'reply' => $reply,
                    'sessionId' => $session->id,
                    'intent' => 'quote',
                ], 422);
            }

            if (empty($meta['event_date'])) {
                $reply = "Sure — what’s your event date (YYYY-MM-DD)?";

                AssistantMessage::create([
                    'assistant_session_id' => $session->id,
                    'role' => 'assistant',
                    'content' => $reply,
                ]);

                return response()->json([
                    'reply' => $reply,
                    'sessionId' => $session->id,
                    'intent' => 'quote',
                ]);
            }

            /** @var QuoteService $quotes */
            $quotes = app(QuoteService::class);

            $quote = $quotes->createDraft($tenant->id, [
                'event_date'   => $meta['event_date'] ?? null,
                'city'         => $meta['city'] ?? null,
                'venue'        => $meta['venue'] ?? null,
                'event_type'   => $meta['event_type'] ?? null,
                'guest_count'  => $meta['guest_count'] ?? null,
                'theme_colors' => $meta['theme_colors'] ?? null,
                'budget'       => $meta['budget'] ?? null,
                'notes'        => $meta['notes'] ?? null,

                // starter placeholder line
                'items' => [
                    [
                        'name' => 'Event Decor Package (Draft)',
                        'qty' => 1,
                        'unit_price' => (float)($meta['budget'] ?? 0),
                        'category' => 'Package',
                    ],
                ],
            ], $request->user()?->id);

            $quote = $quotes->generatePdf($quote, $tenant->name ?? $tenantName);

            $pdfUrl = asset('storage/' . $quote->pdf_path);

            $reply =
                "📄 **Draft quote created!**\n\n" .
                "Quote #: {$quote->quote_no}\n" .
                "PDF: {$pdfUrl}\n\n" .
                "Want to refine items (stage, backdrop, florals, centerpieces) or proceed to booking?";

            AssistantMessage::create([
                'assistant_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $reply,
            ]);

            return response()->json([
                'reply' => $reply,
                'sessionId' => $session->id,
                'intent' => 'quote_created',
                'quote_id' => $quote->id,
                'pdf' => $pdfUrl,
            ]);
        }

        // ----------------------------------------
        // Normal OpenAI flow
        // ----------------------------------------
        $systemPrompt = <<<SYS
You are a virtual assistant for {$tenantName}, an event decor rental business.

STRICT RULES:
- Answer ONLY event decor / booking related questions
- If asked unrelated questions (politics, general knowledge), politely redirect to event planning
- Keep replies short, friendly, and professional
- Always try to collect: date, city, venue, guest count, theme colors, budget
- Suggest next actions: check availability, browse catalog, request quote
SYS;

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($data['history'] ?? [] as $m) {
            if (!is_array($m)) continue;
            $role = ($m['role'] ?? '') === 'user' ? 'user' : 'assistant';
            $text = trim((string)($m['text'] ?? ''));
            if ($text !== '') {
                $messages[] = ['role' => $role, 'content' => $text];
            }
        }

        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => array_merge($messages, [
                    ['role' => 'user', 'content' => $userText],
                ]),
                'temperature' => 0.4,
                'max_tokens' => 220,
            ]);

            $reply = trim($response->choices[0]->message->content ?? 'Sorry, please try again.');

            AssistantMessage::create([
                'assistant_session_id' => $session->id,
                'role' => 'assistant',
                'content' => $reply,
            ]);

            return response()->json([
                'reply' => $reply,
                'sessionId' => $session->id,
            ]);
        } catch (\Throwable $e) {
            Log::warning('Assistant error', ['error' => $e->getMessage()]);

            return response()->json([
                'reply' => 'We’re getting a lot of requests right now. Please try again in a moment.',
                'error' => 'rate_limited',
                'sessionId' => $session->id,
            ], 429);
        }
    }
}
