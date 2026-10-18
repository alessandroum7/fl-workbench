import { Head, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Project {
    id: number;
    name: string;
    description: string | null;
    files_count: number;
    created_at: string;
}

interface Props {
    projects: Project[];
}

export default function Index({ projects }: Props) {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    return (
        <>
            <Head title="Mis proyectos" />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Mis proyectos
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Proyectos personales guardados en tu cuenta.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo proyecto
                        </Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        {flash.error}
                    </div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">
                                    Archivos
                                </TableHead>
                                <TableHead className="text-right">
                                    Creado
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-sm text-muted-foreground"
                                    >
                                        Todavía no tenés proyectos. Creá el
                                        primero.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                {project.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-muted-foreground">
                                            {project.description ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {project.files_count}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {new Date(
                                                project.created_at,
                                            ).toLocaleDateString('es-AR')}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
