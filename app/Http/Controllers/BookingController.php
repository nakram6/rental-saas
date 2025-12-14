<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedDate = $request->query('date', now()->toDateString());

        $bookings = Booking::where('user_id', $request->user()->id)
            ->orderBy('event_date')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Bookings/Index', [
            'auth'         => ['user' => $request->user()],
            'bookings'     => $bookings,
            'selectedDate' => $selectedDate,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'event_date'   => ['required', 'date'],
            'start_time'   => ['nullable', 'date_format:H:i'],
            'end_time'     => ['nullable', 'date_format:H:i'],
            'client_name'  => ['required', 'string', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:255'],
            'event_type'   => ['nullable', 'string', 'max:255'],
            'guest_count'  => ['nullable', 'integer', 'min:1'],
            'notes'        => ['nullable', 'string'],
            'status'       => ['nullable', 'string', 'in:pending,confirmed,cancelled'],
        ]);

        $data['user_id'] = $request->user()->id;
        $data['status']  = $data['status'] ?? 'pending';

        Booking::create($data);

        return redirect()->route('bookings.index')
            ->with('success', 'Booking created.');
    }

    public function update(Request $request, Booking $booking): RedirectResponse
    {
        // Optional later: $this->authorize('update', $booking);

        $data = $request->validate([
            'event_date'   => ['required', 'date'],
            'start_time'   => ['nullable', 'date_format:H:i'],
            'end_time'     => ['nullable', 'date_format:H:i'],
            'client_name'  => ['required', 'string', 'max:255'],
            'client_phone' => ['nullable', 'string', 'max:255'],
            'event_type'   => ['nullable', 'string', 'max:255'],
            'guest_count'  => ['nullable', 'integer', 'min:1'],
            'notes'        => ['nullable', 'string'],
            'status'       => ['required', 'string', 'in:pending,confirmed,cancelled'],
        ]);

        $booking->update($data);

        return redirect()->back()->with('success', 'Booking updated.');
    }

    public function destroy(Request $request, Booking $booking): RedirectResponse
    {
        // Optional later: $this->authorize('delete', $booking);

        $booking->delete();

        return redirect()->back()->with('success', 'Booking deleted.');
    }
}
