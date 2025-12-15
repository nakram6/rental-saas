<?php

namespace App\Services;

use App\Models\Booking;
use Carbon\Carbon;

class AvailabilityService
{
    /**
     * Check availability for a given date and optional time window.
     */
    public function check(
        int $tenantId,
        string $date,
        ?string $startTime = null,
        ?string $endTime = null
    ): array {
        $day = Carbon::parse($date)->toDateString();

        $query = Booking::query()
            ->whereDate('event_date', $day)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereHas('user', function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            });

        // DATE-ONLY CHECK
        if (!$startTime || !$endTime) {
            $exists = $query->exists();

            return [
                'available' => !$exists,
                'conflicts_count' => $exists ? 1 : 0,
                'mode' => 'date_only',
            ];
        }

        // DATE + TIME CHECK
        $start = Carbon::parse($startTime)->format('H:i:s');
        $end   = Carbon::parse($endTime)->format('H:i:s');

        $conflicts = (clone $query)
            ->where(function ($q) use ($start, $end) {
                $q->whereNull('start_time')
                  ->orWhereNull('end_time')
                  ->orWhere(function ($qq) use ($start, $end) {
                      $qq->where('start_time', '<', $end)
                         ->where('end_time', '>', $start);
                  });
            })
            ->count();

        return [
            'available' => $conflicts === 0,
            'conflicts_count' => $conflicts,
            'mode' => 'date_time',
        ];
    }

    /**
     * Suggest next available dates.
     */
    public function nextAvailableDates(
        int $tenantId,
        string $fromDate,
        int $daysToScan = 14
    ): array {
        $start = Carbon::parse($fromDate)->startOfDay();
        $dates = [];

        for ($i = 0; $i < $daysToScan; $i++) {
            $d = $start->copy()->addDays($i)->toDateString();
            $res = $this->check($tenantId, $d);

            if ($res['available']) {
                $dates[] = $d;
                if (count($dates) >= 5) break;
            }
        }

        return $dates;
    }
}
