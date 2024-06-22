<?php

namespace App\Http\Controllers\Ecommerce;

use Carbon\Carbon;
use App\Models\Slider;
use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Models\Discount\Discount;
use App\Models\Product\Categorie;
use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceResource;
use App\Http\Resources\Ecommerce\Product\ProductEcommerceCollection;

class HomeController extends Controller
{
    //
    public function home(Request $request){

        $sliders_principal = Slider::where('status',1)->where('type_slider',1)->orderBy('id','desc')->get();

        //->orderBy('id','desc')

        $categories_randoms = Categorie::withCount(['product_categorie_firsts'])
        ->where('categorie_second_id', NULL)
        ->where('categorie_third_id', NULL)
        ->inRandomOrder()->limit(5)
        ->get();

        $product_trending_new = Product::where('status',2)->inRandomOrder()->limit(8)->get();
        $product_trending_featured = Product::where('status',2)->inRandomOrder()->limit(8)->get();
        $product_trending_topsellers = Product::where('status',2)->inRandomOrder()->limit(8)->get();

        $sliders_secundario = Slider::where('status',1)->where('type_slider',2)->orderBy('id','asc')->get();

        $product_electronics = Product::where('status',2)->where('categorie_first_id',1)->inRandomOrder()->limit(6)->get();

        $products_new_arrival = Product::where('status',2)->whereIn('categorie_first_id',$categories_randoms->pluck('id'))->inRandomOrder()->get();
        
        $sliders_products = Slider::where('status',1)->where('type_slider',3)->orderBy('id','asc')->get();

        $product_last_discounts = Product::where('status',2)->inRandomOrder()->limit(3)->get();
        $product_last_featured = Product::where('status',2)->inRandomOrder()->limit(3)->get();
        $product_last_selling = Product::where('status',2)->inRandomOrder()->limit(3)->get();


        //Discount Flash

        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $DISCOUNT_FLASH = Discount::where('type_campaing',2)->where('status',1)
        ->where('start_date','<=',today())
        ->where('end_date','>=',today())
        ->first();

        $DISCOUNT_FLASH_PRODUCTS = collect([]);

        if ($DISCOUNT_FLASH) {

            foreach ($DISCOUNT_FLASH->products as $key => $aux_product) {
                
                $DISCOUNT_FLASH_PRODUCTS->push(ProductEcommerceResource::make($aux_product->product));
            }

            foreach ($DISCOUNT_FLASH->categories as $key => $aux_categorie) {
                
                $products_of_categories = Product::where('status',2)->where('categorie_first_id', $aux_categorie->categorie_id)->get();
                foreach ($products_of_categories as $key => $product) {
                    $DISCOUNT_FLASH_PRODUCTS->push(ProductEcommerceResource::make($product));
                }
            }
            //
            foreach ($DISCOUNT_FLASH->brands as $key => $aux_brand) {
                $products_of_brands = Product::where('status',2)->where('brand_id', $aux_brand->brand_id)->get();
                foreach ($products_of_brands as $key => $product) {
                    $DISCOUNT_FLASH_PRODUCTS->push(ProductEcommerceResource::make($product));
                }
            }

            $DISCOUNT_FLASH->end_date_format = Carbon::parse($DISCOUNT_FLASH->end_date)->format('M d Y H:i:s');
        }


        return response()->json([
            'sliders_principal' => $sliders_principal->map(function($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'label' => $slider->label,
                    'subtitle' => $slider->subtitle,
                    'imagen' => $slider->imagen ? env('APP_URL').'storage/'.$slider->imagen : NULL,
                    'link' => $slider->link,
                    'color' => $slider->color,
                    'status' => $slider->status,
                    'type_slider' => $slider->type_slider,
                    'price_original' => $slider->price_original,
                    'price_campaing' => $slider->price_campaing,
                ];
            }),
            'categories_randoms' => $categories_randoms->map(function($categorie){
                return [
                    'id' => $categorie->id,
                    'name' => $categorie->name,
                    'products_count' => $categorie->product_categorie_firsts_count,
                    'imagen' => env('APP_URL').'storage/'.$categorie->imagen,
                ];
            }),
            'product_trending_new' => ProductEcommerceCollection::make($product_trending_new),
            'product_trending_featured' => ProductEcommerceCollection::make($product_trending_featured),
            'product_trending_topsellers' => ProductEcommerceCollection::make($product_trending_topsellers),
            'sliders_secundario' => $sliders_secundario->map(function($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'label' => $slider->label,
                    'subtitle' => $slider->subtitle,
                    'imagen' => $slider->imagen ? env('APP_URL').'storage/'.$slider->imagen : NULL,
                    'link' => $slider->link,
                    'color' => $slider->color,
                    'status' => $slider->status,
                    'type_slider' => $slider->type_slider,
                    'price_original' => $slider->price_original,
                    'price_campaing' => $slider->price_campaing,
                ];
            }),
            'product_electronics' => ProductEcommerceCollection::make($product_electronics),
            'products_new_arrival' => ProductEcommerceCollection::make($products_new_arrival),
            'sliders_products' => $sliders_products->map(function($slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'label' => $slider->label,
                    'subtitle' => $slider->subtitle,
                    'imagen' => $slider->imagen ? env('APP_URL').'storage/'.$slider->imagen : NULL,
                    'link' => $slider->link,
                    'color' => $slider->color,
                    'status' => $slider->status,
                    'type_slider' => $slider->type_slider,
                    'price_original' => $slider->price_original,
                    'price_campaing' => $slider->price_campaing,
                ];
            }),
            'product_last_discounts' => ProductEcommerceCollection::make($product_last_discounts),
            'product_last_featured' => ProductEcommerceCollection::make($product_last_featured),
            'product_last_selling' => ProductEcommerceCollection::make($product_last_selling),
            'discount_flash' => $DISCOUNT_FLASH,
            'discount_flash_products' => $DISCOUNT_FLASH_PRODUCTS,
        ]);
    }

    public function menus(Request $request){

        $categories_menus = Categorie::where('categorie_second_id', NULL)
        ->where('categorie_third_id', NULL)
        ->orderBy('position','desc')
        ->get();

        return response()->json([
            'categories_menus' => $categories_menus->map(function($departament) {
                return [
                    'id' => $departament->id,
                    'name' => $departament->name,
                    'icon' => $departament->icon,
                    'categories' => $departament->categorie_seconds->map(function($categorie) {
                        return [
                            'id' => $categorie->id,
                            'name' => $categorie->name,
                            'imagen' => $categorie->imagen ? env('APP_URL').'storage/'.$categorie->imagen : NULL,
                            'subcategories' => $categorie->categorie_seconds->map(function($subcategorie) {
                                return [
                                    'id' => $subcategorie->id,
                                    'name' => $subcategorie->name,
                                    'imagen' => $subcategorie->imagen ? env('APP_URL').'storage/'.$subcategorie->imagen : NULL,
                                ];
                            })
                        ];
                    })
                ];
            }),
        ]);

    }
}
