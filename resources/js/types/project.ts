export interface ProjectFile {
    id: number;
    name: string;
    content: string;
}

export interface ProjectDetail {
    id: number;
    name: string;
    description: string | null;
}

export interface ProjectLimits {
    max_files: number;
    max_content: number;
}
