<?php

namespace App\Http\Controllers\Admin\Coupon;

use Illuminate\Http\Request;
use App\Models\Coupon\Coupon;
use App\Models\Product\Brand;
use App\Models\Product\Product;
use App\Models\Product\Categorie;
use App\Models\Coupon\CouponBrand;
use App\Http\Controllers\Controller;
use App\Models\Coupon\CouponProduct;
use App\Models\Coupon\CouponCategorie;
use App\Http\Resources\Coupon\CouponResource;
use App\Http\Resources\Coupon\CouponCollection;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $coupons = Coupon::where('code','like','%'.$request->search.'%')->orderBy('id','desc')->paginate(25);

        return response()->json([
            "total" => $coupons->total(),
            'coupons' => CouponCollection::make($coupons),
        ]);
    }

    public function config(){

        $products = Product::where('status',2)
        ->orderBy('id','desc')
        ->get();

        $categories = Categorie::where('status',1)
        ->where('categorie_second_id',NULL)
        ->where('categorie_third_id',NULL)
        ->orderBy('id','desc')
        ->get();

        $brands = Brand::where('status',1)
        ->orderBy('id','desc')
        ->get();

        return response()->json([
            'products' => $products->map(function($product){
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'slug' => $product->slug,
                    'imagen' => env('APP_URL').'storage/'.$product->imagen,
                ];
            }),
            'categories' => $categories->map(function($categorie){
                return [
                    'id' => $categorie->id,
                    'name' => $categorie->name,
                    'imagen' => env('APP_URL').'storage/'.$categorie->imagen,
                ];
            }),
            'brands' => $brands->map(function($brand){
                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'imagen' => env('APP_URL').'storage/'.$brand->imagen,
                ];
            }),
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exist = Coupon::where('code',$request->code)->first();

        if ($is_exist) {
            return response()->json([
                "message" => 403,
                'message_text' => 'El cupón ya existe, digite otro por favor.',
            ]);
        }

        $COUPONES = Coupon::create($request->all());

        foreach ($request->product_selected as $key => $product_select) {
            CouponProduct::create([
                'coupon_id' => $COUPONES->id,
                'product_id' => $product_select['id'],
            ]);
        }

        foreach ($request->categorie_selected as $key => $categorie_select) {
            CouponCategorie::create([
                'coupon_id' => $COUPONES->id,
                'categorie_id' => $categorie_select['id'],
            ]);
        }

        foreach ($request->brand_selected as $key => $brand_select) {
            CouponBrand::create([
                'coupon_id' => $COUPONES->id,
                'brand_id' => $brand_select['id'],
            ]);
        }
        return response()->json([
            'message' => 200,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $COUPONES = Coupon::findOrFail($id);

        return response()->json([
            'coupon' => CouponResource::make($COUPONES),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exist = Coupon::where('code',$request->code)->where('id','<>',$id)->first();

        if ($is_exist) {
            return response()->json([
                "message" => 403,
                'message_text' => 'El cupón ya existe, digite otro por favor.',
            ]);
        }

        $COUPONES = Coupon::findOrFail($id);

        $COUPONES->update($request->all());

        foreach ($COUPONES->categories as $key => $categorie) {
            $categorie->delete();
        }
        foreach ($COUPONES->products as $key => $product) {
            $product->delete();
        }
        foreach ($COUPONES->brands as $key => $brand) {
            $brand->delete();
        }

        foreach ($request->product_selected as $key => $product_select) {
            CouponProduct::create([
                'coupon_id' => $COUPONES->id,
                'product_id' => $product_select['id'],
            ]);
        }

        foreach ($request->categorie_selected as $key => $categorie_select) {
            CouponCategorie::create([
                'coupon_id' => $COUPONES->id,
                'product_id' => $categorie_select['id'],
            ]);
        }

        foreach ($request->brand_selected as $key => $brand_select) {
            CouponBrand::create([
                'coupon_id' => $COUPONES->id,
                'product_id' => $brand_select['id'],
            ]);
        }
        return response()->json([
            'message' => 200,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $COUPONES = Coupon::findOrFail($id);

        $COUPONES->delete();

        return response()->json([
            'message' => 200,
        ]);
    }
}
