import { supabase } from './supabase';

export async function getSessionUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return null;
  }
  return data.session?.user ?? null;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, preferred_name, role, membership_status, is_active')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }
  return data as unknown as { id: string; full_name: string; preferred_name: string | null; role: string; membership_status: string; is_active: boolean };
}
