import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/projects');
    };

    return (
        <>
            <Head title="Nuevo proyecto" />

            <div className="mx-auto w-full max-w-xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Nuevo proyecto
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Después de crearlo vas a poder agregarle archivos.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description">
                            Descripción (opcional)
                        </Label>
                        <textarea
                            id="description"
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Crear proyecto'}
                        </Button>
                        <Button type="button" variant="ghost" asChild>
                            <Link href="/projects">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
