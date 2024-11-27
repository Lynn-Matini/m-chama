'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './groups.module.css';

export default function GroupsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    contribution_amount: '',
    contribution_frequency: 'monthly'
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          router.push('/login');
          return;
        }
        if (!session) {
          console.log('No active session found');
          router.push('/login');
          return;
        }
        fetchGroups();
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      }
    };

    checkSession();
  }, [router, supabase]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          role,
          chama_groups (*)
        `);

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      // First create the group
      const { data: groupData, error: groupError } = await supabase
        .from('chama_groups')
        .insert({
          name: newGroup.name,
          description: newGroup.description,
          contribution_amount: newGroup.contribution_amount,
          contribution_frequency: newGroup.contribution_frequency
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Then add the current user as an admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      // Refresh the groups list
      await fetchGroups();
      setShowCreateModal(false);
      setNewGroup({
        name: '',
        description: '',
        contribution_amount: '',
        contribution_frequency: 'monthly'
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Groups</h1>
        <button 
          className={styles.createButton}
          onClick={() => setShowCreateModal(true)}
        >
          Create New Group
        </button>
      </div>

      <div className={styles.groupsGrid}>
        {groups.map((group) => (
          <div key={group.group_id} className={styles.groupCard}>
            <h2>{group.chama_groups.name}</h2>
            <p>{group.chama_groups.description}</p>
            <div className={styles.groupMeta}>
              <span>Role: {group.role}</span>
              <span>
                Contribution: KES {group.chama_groups.contribution_amount} 
                ({group.chama_groups.contribution_frequency})
              </span>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className={styles.inputGroup}>
                <label>Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Contribution Amount (KES)</label>
                <input
                  type="number"
                  value={newGroup.contribution_amount}
                  onChange={(e) => setNewGroup({...newGroup, contribution_amount: e.target.value})}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Contribution Frequency</label>
                <select
                  value={newGroup.contribution_frequency}
                  onChange={(e) => setNewGroup({...newGroup, contribution_frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}