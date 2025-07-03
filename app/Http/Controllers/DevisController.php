<?php

namespace App\Http\Controllers;

use App\Models\Devis;
use Illuminate\Http\Request;

class DevisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $devis = Devis::where('company_id', auth()->user()->company_id)->get();

        return inertia('Devis/Index', [
            'devis' => $devis,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Devis $devis)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Devis $devis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Devis $devis)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Devis $devis)
    {
        //
    }
}
