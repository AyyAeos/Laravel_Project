<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList; 
use Inertia\Inertia;
use Illuminate\Http\Request;


class DashboardController extends Controller
{
public function index() {
   $user = auth()->user();
   $lists = TaskList::where('user_id', $user->id)->get();
   $tasks = Task::whereHas('list', function($query) use ($user) {
   $query->where('user_id', $user->id);
   })->get();
   
   $stats = [
        'totalLists'=> $lists->count(),
        'totalTasks'=> $tasks->count(),
        'completed'=> $tasks->where('is_completed', true)->count(),
        'pendingTasks'=> $tasks->where('is_completed', false)->count(),
   ];

      return Inertia::render('dashboard', [
            'lists' => $lists,
            'stats' =>$stats,
            'tasks' => $tasks,

            'flash' => [
                'success'=>session('success'),
                'error'=>session('error')
            ]
            ]);


}
}