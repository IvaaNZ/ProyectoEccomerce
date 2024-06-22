<?php

namespace App\Http\Resources\Ecommerce\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductEcommerceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $discount_g = null;

        // Crear una colección de descuentos
        $discount_collect = collect([]);

        // Obtener descuento del producto
        $discount_product = $this->resource->discount;
        if ($discount_product) {
            $discount_collect->push($discount_product);
        }

        // Obtener descuento de la categoría
        $discount_categorie = $this->resource->categorie_first ? $this->resource->categorie_first->discount : null;
        if ($discount_categorie) {
            $discount_collect->push($discount_categorie);
        }

        // Obtener descuento de la marca
        $discount_brand = $this->resource->brand ? $this->resource->brand->discount : null;
        if ($discount_brand) {
            $discount_collect->push($discount_brand);
        }

        // Ordenar y obtener el mayor descuento
        if ($discount_collect->count() > 0) {
            $discount_g = $discount_collect->sortByDesc('discount')->first();
        }

        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'slug' => $this->resource->slug,
            'sku' => $this->resource->sku,
            'price_ars' => $this->resource->price_ars,
            'price_usd' => $this->resource->price_usd,
            'description' => $this->resource->description,
            'resumen' => $this->resource->resumen,
            'imagen' => env('APP_URL').'storage/'.$this->resource->imagen,
            'status' => $this->resource->status,
            'tags' => $this->resource->tags ? json_decode($this->resource->tags) : [],
            'brand_id' => $this->resource->brand_id,
            'brand' => $this->resource->brand ? [
                'id' => $this->resource->brand->id,
                'name' => $this->resource->brand->name,
            ] : NULL,
            'categorie_first_id' => $this->resource->categorie_first_id,
            'categorie_first' => $this->resource->categorie_first ? [
                'id' => $this->resource->categorie_first->id,
                'name' => $this->resource->categorie_first->name,
            ] : NULL,
            'categorie_second_id' => $this->resource->categorie_second_id,
            'categorie_second' => $this->resource->categorie_second ? [
                'id' => $this->resource->categorie_second->id,
                'name' => $this->resource->categorie_second->name,
            ] : NULL,
            'categorie_third_id' => $this->resource->categorie_third_id,
            'categorie_third' => $this->resource->categorie_third ? [
                'id' => $this->resource->categorie_third->id,
                'name' => $this->resource->categorie_third->name,
            ] : NULL,
            'stock' => $this->resource->stock,
            'created_at' => $this->resource->created_at->format('Y-m-d h:i:s'),
            'images' => $this->resource->images->map(function($image){
                return [
                    'id' => $image->id,
                    'imagen' => env('APP_URL').'storage/'.$image->imagen,
                ];
            }),
            'discount_g' => $discount_g,
            'discount_collect' => $discount_collect,
        ];
    }
}

