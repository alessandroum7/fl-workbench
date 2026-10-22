import Editor, { type OnMount } from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';
import '@/lib/monaco-setup';

interface Props {
    path: string;
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
}

function languageFor(fileName: string): string {
    return /\.(c|h)$/i.test(fileName) ? 'c' : 'plaintext';
}

function useIsDark(): boolean {
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );

    useEffect(() => {
        const observer = new MutationObserver(() =>
            setIsDark(document.documentElement.classList.contains('dark')),
        );
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

export function CodeEditor({ path, value, onChange, onSave }: Props) {
    const isDark = useIsDark();
    const onSaveRef = useRef(onSave);

    // El atajo se registra una sola vez; la ref evita que use un onSave viejo.
    useEffect(() => {
        onSaveRef.current = onSave;
    }, [onSave]);

    const handleMount: OnMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            onSaveRef.current();
        });
    };

    return (
        <Editor
            height="65vh"
            path={path}
            language={languageFor(path)}
            value={value}
            theme={isDark ? 'vs-dark' : 'vs'}
            onChange={(next) => onChange(next ?? '')}
            onMount={handleMount}
            loading={
                <div className="p-4 text-sm text-muted-foreground">
                    Cargando editor...
                </div>
            }
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 4,
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    );
}
