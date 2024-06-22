<?php

namespace App\Models\Coupon;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coupon extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'code',
        'type_discount',
        'discount',
        'type_count',
        'num_use',
        'type_coupon',
        'status',
    ];

    public function setCreatedAtAttribute($value){

        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $this->attributes["created_at"] = Carbon::now();
    }
    
    public function setUpdatedAtAttribute($value){
        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $this->attributes['updated_at'] = Carbon::now();
    }

    public function products(){
        return $this->hasMany(CouponProduct::class);
    }
    
    public function categories(){
        return $this->hasMany(CouponCategorie::class);
    }

    public function brands(){
        return $this->hasMany(CouponBrand::class);
    }
}
