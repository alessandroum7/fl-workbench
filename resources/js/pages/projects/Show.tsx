import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, FileCode2, Pencil, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CodeEditor } from '@/components/code-editor';
import { FlashMessage } from '@/components/flash-message';
import {
    DeleteFileDialog,
    NewFileForm,
    RenameFileDialog,
} from '@/components/projects/file-dialogs';
import { Button } from '@/components/ui/button';
import type {
    ProjectDetail,
    ProjectFile,
    ProjectLimits,
} from '@/types/project';

interface Props {
    project: ProjectDetail;
    files: ProjectFile[];
    limits: ProjectLimits;
}

export default function Show({ project, files, limits }: Props) {
    const [selectedName, setSelectedName] = useState<string | null>(
        files[0]?.name ?? null,
    );
    const [drafts, setDrafts] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [renameTarget, setRenameTarget] = useState<ProjectFile | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProjectFile | null>(null);

    // Si el archivo seleccionado ya no existe (borrado/renombrado), usa el primero.
    const selected =
        files.find((f) => f.name === selectedName) ?? files[0] ?? null;
    const draft = selected ? drafts[selected.id] : undefined;
    const currentContent = draft ?? selected?.content ?? '';
    const isDirty =
        selected !== null && draft !== undefined && draft !== selected.content;

    const isFileDirty = (file: ProjectFile) =>
        drafts[file.id] !== undefined && drafts[file.id] !== file.content;

    const save = () => {
        if (!selected || !isDirty) {
            return;
        }

        const fileId = selected.id;
        setSaving(true);
        setSaveError(null);

        router.put(
            `/files/${fileId}`,
            { content: currentContent },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () =>
                    setDrafts((prev) => {
                        const next = { ...prev };
                        delete next[fileId];
                        return next;
                    }),
                onError: (errors) =>
                    setSaveError(
                        errors.content ??
                            errors.name ??
                            'No se pudo guardar el archivo.',
                    ),
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <>
            <Head title={project.name} />

            <div className="mx-auto w-full max-w-7xl space-y-4 p-6">
                <div>
                    <Link
                        href="/projects"
                        className="mb-1 inline-flex items-center text-sm text-muted-foreground hover:underline"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Mis proyectos
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {project.name}
                    </h1>
                    {project.description && (
                        <p className="text-sm text-muted-foreground">
                            {project.description}
                        </p>
                    )}
                </div>

                <FlashMessage />

                <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
                    <aside className="space-y-3">
                        <div className="rounded-lg border">
                            <div className="flex items-center justify-between border-b px-3 py-2 text-sm font-medium">
                                <span>Archivos</span>
                                <span className="text-xs text-muted-foreground">
                                    {files.length}/{limits.max_files}
                                </span>
                            </div>
                            <ul className="divide-y">
                                {files.map((file) => (
                                    <li
                                        key={file.id}
                                        className={`flex items-center gap-1 px-2 py-1.5 ${
                                            selected?.id === file.id
                                                ? 'bg-accent'
                                                : ''
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedName(file.name)
                                            }
                                            className="min-w-0 flex-1 truncate text-left text-sm"
                                        >
                                            {file.name}
                                            {isFileDirty(file) && (
                                                <span className="ml-1 text-amber-600">
                                                    ●
                                                </span>
                                            )}
                                        </button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            aria-label={`Renombrar ${file.name}`}
                                            onClick={() =>
                                                setRenameTarget(file)
                                            }
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-red-600"
                                            aria-label={`Eliminar ${file.name}`}
                                            onClick={() =>
                                                setDeleteTarget(file)
                                            }
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <NewFileForm
                            projectId={project.id}
                            disabled={files.length >= limits.max_files}
                            onCreated={setSelectedName}
                        />
                    </aside>

                    <section className="space-y-2">
                        {selected ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <FileCode2 className="h-4 w-4" />
                                        {selected.name}
                                        {isDirty && (
                                            <span className="text-xs font-normal text-amber-600">
                                                sin guardar
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground">
                                            {currentContent.length.toLocaleString(
                                                'es-AR',
                                            )}{' '}
                                            /{' '}
                                            {limits.max_content.toLocaleString(
                                                'es-AR',
                                            )}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={save}
                                            disabled={!isDirty || saving}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {saving
                                                ? 'Guardando...'
                                                : 'Guardar'}
                                        </Button>
                                    </div>
                                </div>

                                {saveError && (
                                    <p className="text-sm text-red-600">
                                        {saveError}
                                    </p>
                                )}

                                <div className="overflow-hidden rounded-lg border">
                                    <CodeEditor
                                        path={selected.name}
                                        value={currentContent}
                                        onChange={(value) =>
                                            setDrafts((prev) => ({
                                                ...prev,
                                                [selected.id]: value,
                                            }))
                                        }
                                        onSave={save}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Ctrl+S (o Cmd+S) para guardar.
                                </p>
                            </>
                        ) : (
                            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                                Este proyecto no tiene archivos. Creá uno desde
                                el panel de la izquierda.
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <RenameFileDialog
                file={renameTarget}
                onClose={() => setRenameTarget(null)}
                onRenamed={(newName) => {
                    if (renameTarget && renameTarget.id === selected?.id) {
                        setSelectedName(newName);
                    }
                }}
            />
            <DeleteFileDialog
                file={deleteTarget}
                onClose={() => setDeleteTarget(null)}
            />
        </>
    );
}
