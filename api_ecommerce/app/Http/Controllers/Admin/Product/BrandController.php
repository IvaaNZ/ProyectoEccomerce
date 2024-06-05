<?php

namespace App\Http\Controllers\Admin\Product;

use Illuminate\Http\Request;
use App\Models\Product\Brand;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $brands = Brand::where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $brands->total(),
            "brands" => $brands->map(function($brand) {
                return [
                    "id" => $brand->id,
                    "name" => $brand->name,
                    "status" => $brand->status,
                    'imagen' => $brand->imagen ? env('APP_URL').'storage/'.$brand->imagen : null,
                    "created_at" => $brand->created_at->format("Y-m-d h:i:s"),
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $isValida = Brand::where("name", $request->name)->first();
    if ($isValida) {
        return response()->json(["message" => 403]);
    }

    if($request->hasFile("image")){

        $path = Storage::putFile("brands",$request->file("image"));
        $request->request->add(["imagen" =>  $path]);
    }

    // Crear la marca con la ruta de la imagen si está disponible
    $brand = Brand::create([
        'name' => $request->name,
        'imagen' => $path,
        'status' => $request->status
    ]);

    return response()->json([
        "message" => 200,
        "brand" => [
            "id" => $brand->id,
            "name" => $brand->name,
            'imagen' => env('APP_URL').'storage/'.$brand->imagen,
            "status" => $brand->status,
            "created_at" => $brand->created_at->format("Y-m-d h:i:s"),
        ],
    ]);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $brand = Brand::findOrFail($id);

        return response()->json(["brand" => [
                    'id' => $brand->id,
                    'name' => $brand->title,
                    'status' => $brand->status,
                    'imagen' => env('APP_URL').'storage/'.$brand->imagen,
        ]]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
{
    $isValida = Brand::where("id","<>",$id)->where("name",$request->name)->first();
    if($isValida){
        return response()->json(["message" => 403]);
    }
    $brand = Brand::findOrFail($id);
    
    if($request->hasFile("image")){
        if($brand->imagen){
            Storage::delete($brand->imagen);
        }
        $path = Storage::putFile('brands',$request->file('image'));
        $request->request->add(['imagen' => $path]);
    }
    // if ($request->hasFile('portada')) {

    //     if ($product->imagen) {
    //         Storage::delete($product->imagen);
    //     }
        
    //     $path = Storage::putFile('products',$request->file('portada'));
    //     $request->request->add(['imagen' => $path]);
    // }
    $brand->update($request->all());
    
    return response()->json([
        "message" => 200,
        "brand" => [
            "id" => $brand->id,
            "name" => $brand->name,
            "status" => $brand->status,
            'imagen' => env('APP_URL').'storage/'.$brand->imagen,
            "created_at" => $brand->created_at->format("Y-m-d h:i:s"),
        ],
    ]);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();//IMPORTANTE VALIDACION
        return response()->json([
            "message" => 200,
        ]);
    }
}
