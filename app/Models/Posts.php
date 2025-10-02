<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use HasUuids;

    protected $fillable = ['title', 'image', 'description', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
