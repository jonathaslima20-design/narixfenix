import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import { WhatsAppInstance } from './types';

export function useInstances() {
  const { user } = useAuth();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    setInstances((data ?? []) as WhatsAppInstance[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user?.id) return;
    const channelName = `user-instances-${user.id}-${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'whatsapp_instances', filter: `user_id=eq.${user.id}` },
        () => {
          refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refresh]);

  return { instances, loading, refresh };
}

export function instanceDisplayName(instance: WhatsAppInstance): string {
  return instance.label?.trim() || instance.phone_number || instance.instance_name || 'Instância';
}
