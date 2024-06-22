<?php

namespace App\Models\Discount;

use Carbon\Carbon;
use App\Models\Product\Brand;
use App\Models\Discount\Discount;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DiscountBrand extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'brand_id',
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

    public function brand(){
        return $this->belongsTo(Brand::class);
    }

    public function discount(){
        return $this->belongsTo(Discount::class);
    }
}
