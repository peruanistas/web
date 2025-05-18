import type { Enums } from '@db/schema';

export const IOARR_TYPE_NAMES = {
    'investment': 'Inversión',
    'optimization': 'Optimización',
    'extension': 'Ampliación',
    'repair': 'Reparación',
    'replacement': 'Reposición',
};

export function formatIoaarType(type: Enums<'ioarr_type'>) {
    return IOARR_TYPE_NAMES[type] || type;
}
