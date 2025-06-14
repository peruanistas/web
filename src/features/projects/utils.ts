import { db } from '@db/client';
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

export async function getVotesLeft(): Promise<number> {
    try {
        const response = await db.rpc('get_votes_left');
        return response.data!;
    } catch (error) {
        console.error('Error obtaining remaining votes:', error);
    }
    return 0;
}

export async function voteForProject(project_id: string, votes_count: number) {
    // Note: the database function automatically handles the vote type
    return db.rpc('vote_for_project', { project_id, votes_count });
}

type VotesSummary = {
    golden_votes: number;
    silver_votes: number;
};

export function votesEffectivePoints(votesSummary: VotesSummary) {
    return votesSummary.golden_votes * 2 + votesSummary.silver_votes;
}
