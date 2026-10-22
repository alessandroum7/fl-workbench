import { router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProjectFile } from '@/types/project';

/* ---------- Crear archivo ---------- */

interface NewFileFormProps {
    projectId: number;
    disabled: boolean;
    onCreated: (name: string) => void;
}

export function NewFileForm({
    projectId,
    disabled,
    onCreated,
}: NewFileFormProps) {
    const form = useForm({ name: '', content: '' });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(`/projects/${projectId}/files`, {
            preserveScroll: true,
            onSuccess: () => {
                onCreated(form.data.name);
                form.reset();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-2 rounded-lg border p-3">
            <Label htmlFor="new-file-name" className="text-xs">
                Nuevo archivo
            </Label>
            <div className="flex gap-2">
                <Input
                    id="new-file-name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    placeholder="utils.c"
                    disabled={disabled}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={disabled || form.processing}
                    aria-label="Crear archivo"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {form.errors.name && (
                <p className="text-xs text-red-600">{form.errors.name}</p>
            )}
            {disabled && (
                <p className="text-xs text-muted-foreground">
                    Alcanzaste el máximo de archivos del proyecto.
                </p>
            )}
        </form>
    );
}

/* ---------- Renombrar archivo ---------- */

interface RenameFileDialogProps {
    file: ProjectFile | null;
    onClose: () => void;
    onRenamed: (newName: string) => void;
}

function RenameForm({
    file,
    onClose,
    onRenamed,
}: {
    file: ProjectFile;
    onClose: () => void;
    onRenamed: (newName: string) => void;
}) {
    const form = useForm({ name: file.name });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.put(`/files/${file.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onRenamed(form.data.name);
                onClose();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>Renombrar archivo</DialogTitle>
                <DialogDescription>
                    Extensiones permitidas: .l, .y, .c, .h y .txt.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-1.5">
                <Label htmlFor="rename-file">Nombre</Label>
                <Input
                    id="rename-file"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    autoFocus
                />
                {form.errors.name && (
                    <p className="text-sm text-red-600">{form.errors.name}</p>
                )}
            </div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Guardando...' : 'Renombrar'}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function RenameFileDialog({
    file,
    onClose,
    onRenamed,
}: RenameFileDialogProps) {
    return (
        <Dialog
            open={file !== null}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent>
                {file && (
                    <RenameForm
                        key={file.id}
                        file={file}
                        onClose={onClose}
                        onRenamed={onRenamed}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

/* ---------- Eliminar archivo ---------- */

interface DeleteFileDialogProps {
    file: ProjectFile | null;
    onClose: () => void;
}

export function DeleteFileDialog({ file, onClose }: DeleteFileDialogProps) {
    const [deleting, setDeleting] = useState(false);

    const confirm = () => {
        if (!file) {
            return;
        }
        setDeleting(true);
        router.delete(`/files/${file.id}`, {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () => setDeleting(false),
        });
    };

    return (
        <Dialog
            open={file !== null}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar archivo?</DialogTitle>
                    <DialogDescription>
                        Se eliminará <strong>{file?.name}</strong>. Esta acción
                        no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Volver
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={confirm}
                        disabled={deleting}
                    >
                        {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
