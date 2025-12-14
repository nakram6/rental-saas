<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\CatalogReportMail;
use Illuminate\Support\Str;

class CatalogReportController extends Controller
{
    private function demoItems(): array
    {
        return [
            ['id'=>1,'name'=>'White Velvet Sofa','category'=>'Sofas','price'=>180,'image'=>'/images/catalog/sofa-white.jpg'],
            ['id'=>2,'name'=>'Gold Round Arch','category'=>'Backdrops','price'=>220,'image'=>'/images/catalog/arch-gold.jpg'],
            ['id'=>3,'name'=>'Crystal Centerpiece','category'=>'Table Decor','price'=>35,'image'=>'/images/catalog/centerpiece.jpg'],
        ];
    }

    /**
     * DomPDF prefers local filesystem paths for images.
     * Convert "/images/..." into "/full/path/to/public/images/..."
     * and safely handle missing files.
     */
    private function buildPdfItems(array $items): array
    {
        return collect($items)->map(function ($i) {
            $rel = $i['image'] ?? null; // e.g. "/images/catalog/sofa-white.jpg"

            if ($rel) {
                $abs = public_path(ltrim($rel, '/')); // DomPDF-safe local path
                $i['image_abs'] = file_exists($abs) ? $abs : null;
            } else {
                $i['image_abs'] = null;
            }

            return $i;
        })->values()->toArray();
    }

    public function index()
    {
        return Inertia::render('Reports/Catalog', [
            'items' => $this->demoItems(),
        ]);
    }

    public function publicCatalog(string $token)
    {
        return Inertia::render('Public/CatalogShare', [
            'items' => $this->demoItems(),
            'token' => $token,
        ]);
    }

    public function sendEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $tenant = app()->bound('currentTenant') ? app('currentTenant') : null;
        $tenantName = $tenant?->name ?? 'Harbour Decor Rentals';

        // Public URL (share link)
        $token = Str::random(32); // later store token in DB with tenant_id + expiry
        $publicUrl = route('public.catalog', $token);

        // Prepare items for PDF (DomPDF-safe image paths)
        $items = $this->buildPdfItems($this->demoItems());

        // Render PDF to binary
        $pdfBinary = Pdf::loadView('pdf.catalog', [
            'items' => $items,
            'tenantName' => $tenantName,
        ])->output();

        // Send email with link + PDF attachment
        Mail::to($request->email)->send(
            new CatalogReportMail($publicUrl, $tenantName, $pdfBinary)
        );

        return back()->with('success', 'Catalog sent (link + PDF)!');
    }
}
