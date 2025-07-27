import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    is_completed: boolean;
    list_id: number;
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
    };
    lists: List[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function TaskIndex({ tasks, lists, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [showToast, setShowToast] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
    } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: lists[0]?.id || '',
        is_completed: false,
    });

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Editing task : ', editingTask);
        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                    setEditingTask(null);
                },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
            });
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list_id,
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };

    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

    return (
        <AppLayout>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white animate-in fade-in slide-in-from-top-5`}
                    >
                        {toastType === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={data.title} onChange={(e) => setData('title', e.target.value)} required />

                                    <Label>Description</Label>
                                    <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />

                                    <Label>Due Date</Label>
                                    <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />

                                    <Label>List</Label>
                                    <select
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                        value={data.list_id}
                                        onChange={(e) => setData('list_id', parseInt(e.target.value))}
                                    >
                                        {lists.map((list) => (
                                            <option key={list.id} value={list.id}>
                                                {list.title}
                                            </option>
                                        ))}
                                    </select>

                                    <Label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_completed}
                                            onChange={(e) => setData('is_completed', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span>Completed</span>
                                    </Label>

                                    <Button type="submit" disabled={processing}>
                                        {editingTask ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.data.map((task) => (
                        <Card key={task.id} className="transition-colors hover:bg-accent/50">
                            <CardHeader className="flex items-center justify-between pb-2">
                                 <CardTitle className={`text-lg font-medium ${task.is_completed ? 'line-through text-muted-foreground' : 'text-red-500'}`}>
      {task.title}
    </CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(task.id)}
                                        className="text-destructive hover:text-destructive/90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{task.description || 'No description'}</p>
                                {task.due_date && <p className="mt-2 text-xs text-muted-foreground">Due: {task.due_date}</p>}
                                {task.list_id && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        List: {lists.find((list) => list.id === task.list_id)?.title || 'Unknown'}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
