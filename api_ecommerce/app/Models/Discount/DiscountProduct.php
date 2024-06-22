<?php

namespace App\Models\Discount;

use Carbon\Carbon;
use App\Models\Product\Product;
use App\Models\Discount\Discount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DiscountProduct extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'product_id',
        'discount_id',
    ];

    public function setCreatedAtAttribute($value){

        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $this->attributes["created_at"] = Carbon::now();
    }
    
    public function setUpdatedAtAttribute($value){
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $this->attributes['updated_at'] = Carbon::now();
    }

    public function product(){
        return $this->belongsTo(Product::class);
    }

    public function discount(){
        return $this->belongsTo(Discount::class);
    }
    
}
