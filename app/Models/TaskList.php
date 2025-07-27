<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskList extends Model
{
    //tasklist table not exist
    protected $table = 'lists';

    protected $fillable = [
        'title',
        'description',
        'user_id'
    ];

    public function tasks() : HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function users() : BelongsTo
    {
        return $this->BelongsTo(User::class);
    }

}
