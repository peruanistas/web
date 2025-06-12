import { db } from '@db/client';

export async function checkGroupMembership(groupId: string, userId: string): Promise<boolean> {
  const { data, error } = await db
    .from('group_members')
    .select('group_id')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { 
    throw new Error(`Error checking membership: ${error.message}`);
  }

  return !!data;
}

export async function joinGroup(groupId: string, userId: string): Promise<void> {
  const { error } = await db
    .from('group_members')
    .insert([
      {
        group_id: groupId,
        user_id: userId,
        role: 'member'
      }
    ]);

  if (error) {
    throw new Error(`Error joining group: ${error.message}`);
  }
}

export async function leaveGroup(groupId: string, userId: string): Promise<void> {
  const { error } = await db
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Error leaving group: ${error.message}`);
  }
}