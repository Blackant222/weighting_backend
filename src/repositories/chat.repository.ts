import { supabase } from '../config/supabase';

export const saveChatMessage = async (userId: string, role: 'user' | 'model', text: string, imageUrl?: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      role,
      text,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const clearChatHistory = async (userId: string) => {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};
