<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $table = 'product';
    protected $connection = 'tokosf';

    protected $primaryKey = 'idproduct';
    public $timestamps = false;
    protected $guarded = ['idproduct'];


    public function category()
    {
        return $this->belongsTo(Categories::class, 'idproduct_category', 'idproduct_category');
    }
}

