<?php

namespace App\Models\Discount;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Models\Discount\DiscountCategorie;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discount extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'code',
        'type_campaing',
        'type_discount',
        'discount',
        'discount_type',
        'status',
        'start_date',
        'end_date',
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
        return $this->hasMany(DiscountProduct::class);
    }
    
    public function categories(){
        return $this->hasMany(DiscountCategorie::class);
    }

    public function brands(){
        return $this->hasMany(DiscountBrand::class);
    }
}
