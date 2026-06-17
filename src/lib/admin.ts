import { supabase } from './supabase';

export type NewsPost = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
};

export type EventItem = {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string | null;
  status: 'draft' | 'published' | 'cancelled';
  visibility: 'public' | 'members' | 'committee';
};

export type GalleryPhoto = {
  id: number;
  album_id: number;
  title: string | null;
  caption: string | null;
  storage_path: string;
  uploaded_at: string;
};

export type DocumentItem = {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  storage_path: string;
  visibility: 'members' | 'committee' | 'admin';
  uploaded_at: string;
};

export type MemberProfile = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  role: 'member' | 'committee' | 'admin';
  membership_status: string;
  is_active: boolean;
  joined_at: string;
};

export async function fetchNewsPosts(): Promise<NewsPost[]> {
  const { data, error } = await supabase
    .from('news_articles')
    .select('id, title, slug, summary, body, status, published_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data as NewsPost[];
}

export async function upsertNewsPost(post: Partial<NewsPost> & { id?: number }) {
  const payload = {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    body: post.body,
    status: post.status,
    published_at: post.status === 'published' ? post.published_at || new Date().toISOString() : null
  };

  if (post.id) {
    const { data, error } = await supabase
      .from('news_articles')
      .update(payload)
      .eq('id', post.id)
      .select()
      .single();
    if (error) throw error;
    return data as NewsPost;
  }

  const { data, error } = await supabase.from('news_articles').insert([payload]).select().single();
  if (error) throw error;
  return data as NewsPost;
}

export async function deleteNewsPost(id: number) {
  const { error } = await supabase.from('news_articles').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleNewsStatus(id: number, publish: boolean) {
  const { data, error } = await supabase
    .from('news_articles')
    .update({
      status: publish ? 'published' : 'draft',
      published_at: publish ? new Date().toISOString() : null
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as NewsPost;
}

export async function fetchEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, location, start_time, end_time, status, visibility')
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data as EventItem[];
}

export async function upsertEvent(event: Partial<EventItem> & { id?: number }) {
  const payload = {
    title: event.title,
    description: event.description,
    location: event.location,
    start_time: event.start_time,
    end_time: event.end_time,
    visibility: event.visibility,
    status: event.status
  };

  if (event.id) {
    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', event.id)
      .select()
      .single();
    if (error) throw error;
    return data as EventItem;
  }

  const { data, error } = await supabase.from('events').insert([payload]).select().single();
  if (error) throw error;
  return data as EventItem;
}

export async function deleteEvent(id: number) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchGalleryAlbums() {
  const { data, error } = await supabase.from('gallery_albums').select('id, title, is_public, cover_photo_url').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('id, album_id, title, caption, storage_path, uploaded_at')
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data as GalleryPhoto[];
}

export async function uploadGalleryPhoto(file: File, albumId: number, title?: string, caption?: string) {
  const path = `gallery/${albumId}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage.from('gallery').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase.from('gallery_photos').insert([
    {
      album_id: albumId,
      title,
      caption,
      storage_path: path
    }
  ]).select().single();

  if (error) throw error;
  return data as GalleryPhoto;
}

export async function deleteGalleryPhoto(id: number) {
  const { data, error } = await supabase.from('gallery_photos').select('storage_path').eq('id', id).single();
  if (error || !data) throw error;
  await supabase.storage.from('gallery').remove([data.storage_path]);
  const { error: deleteError } = await supabase.from('gallery_photos').delete().eq('id', id);
  if (deleteError) throw deleteError;
}

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, description, filename, storage_path, visibility, uploaded_at')
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data as DocumentItem[];
}

export async function uploadDocument(file: File, visibility: DocumentItem['visibility'], description?: string) {
  const path = `documents/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase.from('documents').insert([
    {
      title: file.name,
      description,
      filename: file.name,
      storage_path: path,
      visibility
    }
  ]).select().single();

  if (error) throw error;
  return data as DocumentItem;
}

export async function deleteDocument(id: number) {
  const { data, error } = await supabase.from('documents').select('storage_path').eq('id', id).single();
  if (error || !data) throw error;
  await supabase.storage.from('documents').remove([data.storage_path]);
  const { error: deleteError } = await supabase.from('documents').delete().eq('id', id);
  if (deleteError) throw deleteError;
}

export async function fetchMembers(): Promise<MemberProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, preferred_name, role, membership_status, is_active, joined_at')
    .order('joined_at', { ascending: false });
  if (error) throw error;
  return data as MemberProfile[];
}

export async function updateMember(id: string, updates: Partial<MemberProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as MemberProfile;
}

export async function deleteMember(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}
