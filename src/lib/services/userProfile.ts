import { supabase } from '@/lib/supabase';
import { toastStore } from '@/lib/stores/toast';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  age?: number;
  location?: string;
  bio?: string;
  preferences: {
    music: string[];
    movies: string[];
    books: string[];
    podcasts: string[];
    genres: string[];
  };
  taste_vector?: number[];
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  music: string[];
  movies: string[];
  books: string[];
  podcasts: string[];
  genres: string[];
}

class UserProfileService {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async createUserProfile(userId: string, email: string): Promise<UserProfile | null> {
    try {
      const defaultProfile = {
        user_id: userId,
        email,
        preferences: {
          music: [],
          movies: [],
          books: [],
          podcasts: [],
          genres: []
        }
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user profile:', error);
        toastStore.add({
          type: 'error',
          title: 'Profile Update Failed',
          message: 'Unable to update your profile. Please try again.'
        });
        return false;
      }

      toastStore.add({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.'
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      // Get current profile
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile) {
        return false;
      }

      // Merge preferences
      const updatedPreferences = {
        ...currentProfile.preferences,
        ...preferences
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({
          preferences: updatedPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  async addPreference(userId: string, category: keyof UserPreferences, item: string): Promise<boolean> {
    try {
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile) {
        return false;
      }

      const currentItems = currentProfile.preferences[category] || [];
      if (!currentItems.includes(item)) {
        const updatedItems = [...currentItems, item];
        
        const { error } = await supabase
          .from('user_profiles')
          .update({
            preferences: {
              ...currentProfile.preferences,
              [category]: updatedItems
            },
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Error adding preference:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error adding preference:', error);
      return false;
    }
  }

  async removePreference(userId: string, category: keyof UserPreferences, item: string): Promise<boolean> {
    try {
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile) {
        return false;
      }

      const currentItems = currentProfile.preferences[category] || [];
      const updatedItems = currentItems.filter(i => i !== item);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          preferences: {
            ...currentProfile.preferences,
            [category]: updatedItems
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing preference:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing preference:', error);
      return false;
    }
  }

  async updateTasteVector(userId: string, tasteVector: number[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          taste_vector: tasteVector,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating taste vector:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating taste vector:', error);
      return false;
    }
  }

  async findTasteTwins(userId: string, limit: number = 5): Promise<UserProfile[]> {
    try {
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile || !currentProfile.taste_vector) {
        return [];
      }

      // For now, return random profiles - in production, you'd implement similarity matching
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', userId)
        .not('taste_vector', 'is', null)
        .limit(limit);

      if (error) {
        console.error('Error finding taste twins:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error finding taste twins:', error);
      return [];
    }
  }
}

export const userProfileService = new UserProfileService();