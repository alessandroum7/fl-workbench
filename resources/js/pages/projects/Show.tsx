import { Head, Link } from '@inertiajs/react';

interface ProjectFile {
    id: number;
    name: string;
    content: string;
}

interface Props {
    project: { id: number; name: string; description: string | null };
    files: ProjectFile[];
}

export default function Show({ project, files }: Props) {
    return (
        <>
            <Head title={project.name} />
            <div className="mx-auto max-w-3xl space-y-4 p-6">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <ul className="list-disc pl-5 text-sm">
                    {files.map((file) => (
                        <li key={file.id}>
                            {file.name} ({file.content.length} caracteres)
                        </li>
                    ))}
                </ul>
                <Link href="/projects" className="text-sm underline">
                    Volver
                </Link>
            </div>
        </>
    );
}
