<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'product_category';
    protected $connection = 'tokosf';

    protected $primaryKey = 'idproduct_category';
    public $timestamps = false;
}
