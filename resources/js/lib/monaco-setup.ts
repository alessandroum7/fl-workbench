import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';

const globalScope = globalThis as typeof globalThis & {
    MonacoEnvironment?: monaco.Environment;
};

globalScope.MonacoEnvironment = {
    getWorker: () => new EditorWorker(),
};

loader.config({ monaco });