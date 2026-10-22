import { usePage } from '@inertiajs/react';

type Flash = { success?: string; error?: string };

export function FlashMessage() {
    const { flash } = usePage().props as { flash?: Flash };

    if (!flash?.success && !flash?.error) {
        return null;
    }

    const isError = !flash.success;

    return (
        <div
            className={
                isError
                    ? 'rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800'
                    : 'rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800'
            }
        >
            {flash.success ?? flash.error}
        </div>
    );
}
