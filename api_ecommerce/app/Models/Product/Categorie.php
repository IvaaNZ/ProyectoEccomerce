<?php

namespace App\Models\Product;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Categorie extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'name',
        'icon',
        'imagen',
        'categorie_second_id',
        'categorie_third_id',
        'position',
        'type_category',
        'status',
    ];

    public function setCreatedAtAttribute($value){

        date_default_timezone_set('America/Argentina/Buenos_Aires');
        $this->attributes["created_at"] = Carbon::now();
    }
    
    public function setUpdatedAtAttribute($value){
        $this->attributes['updated_at'] = Carbon::now();
    }

    function categorie_second(){
        return $this->belongsTo(Categorie::class, 'categorie_second_id');
    }

    function categorie_third(){
        return $this->belongsTo(Categorie::class, 'categorie_third_id');
    }
}

