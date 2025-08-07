export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.12 (cd3cf9e)'
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          content: string | null
          created_at: string
          event_id: string | null
          id: number
          project_id: string | null
          publication_id: string | null
        }
        Insert: {
          author_id: string
          content?: string | null
          created_at?: string
          event_id?: string | null
          id?: number
          project_id?: string | null
          publication_id?: string | null
        }
        Update: {
          author_id?: string
          content?: string | null
          created_at?: string
          event_id?: string | null
          id?: number
          project_id?: string | null
          publication_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'random_projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_publication_id_fkey'
            columns: ['publication_id']
            isOneToOne: false
            referencedRelation: 'publications'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_publication_id_fkey'
            columns: ['publication_id']
            isOneToOne: false
            referencedRelation: 'random_publications'
            referencedColumns: ['id']
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_attendees_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_attendees_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      events: {
        Row: {
          active: boolean
          attendees: number
          author_id: string
          content: string
          created_at: string
          event_date: string
          geo_department: string
          geo_district: string
          id: string
          image_url: string | null
          impression_count: number
          published_at: string
          title: string
          updated_at: string
          visibility: Database['public']['Enums']['visibility']
        }
        Insert: {
          active?: boolean
          attendees?: number
          author_id: string
          content: string
          created_at?: string
          event_date: string
          geo_department: string
          geo_district: string
          id?: string
          image_url?: string | null
          impression_count?: number
          published_at: string
          title: string
          updated_at?: string
          visibility?: Database['public']['Enums']['visibility']
        }
        Update: {
          active?: boolean
          attendees?: number
          author_id?: string
          content?: string
          created_at?: string
          event_date?: string
          geo_department?: string
          geo_district?: string
          id?: string
          image_url?: string | null
          impression_count?: number
          published_at?: string
          title?: string
          updated_at?: string
          visibility?: Database['public']['Enums']['visibility']
        }
        Relationships: [
          {
            foreignKeyName: 'events_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'events_geo_department_fkey'
            columns: ['geo_department']
            isOneToOne: false
            referencedRelation: 'geo_pe_departments'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'events_geo_district_fkey'
            columns: ['geo_district']
            isOneToOne: false
            referencedRelation: 'geo_pe_districts'
            referencedColumns: ['code']
          },
        ]
      }
      geo_pe_departments: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
        Relationships: []
      }
      geo_pe_districts: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'group_members_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'groups'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'group_members_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'random_groups'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'group_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      groups: {
        Row: {
          active: boolean
          created_at: string
          description: string
          geo_department: string
          geo_district: string
          id: string
          image_url: string | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          geo_department: string
          geo_district: string
          id?: string
          image_url?: string | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          geo_department?: string
          geo_district?: string
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'groups_geo_department_fkey'
            columns: ['geo_department']
            isOneToOne: false
            referencedRelation: 'geo_pe_departments'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'groups_geo_district_fkey'
            columns: ['geo_district']
            isOneToOne: false
            referencedRelation: 'geo_pe_districts'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'groups_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          apellido_materno: string | null
          apellido_paterno: string | null
          avatar_url: string | null
          bio: string | null
          celular: string | null
          country_code: string | null
          created_at: string
          geo_department: string | null
          geo_district: string | null
          id: string
          nombres: string | null
          numero_documento: string | null
          profile_completed: boolean
          tipo_documento: string | null
          updated_at: string
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          avatar_url?: string | null
          bio?: string | null
          celular?: string | null
          country_code?: string | null
          created_at?: string
          geo_department?: string | null
          geo_district?: string | null
          id: string
          nombres?: string | null
          numero_documento?: string | null
          profile_completed?: boolean
          tipo_documento?: string | null
          updated_at?: string
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          avatar_url?: string | null
          bio?: string | null
          celular?: string | null
          country_code?: string | null
          created_at?: string
          geo_department?: string | null
          geo_district?: string | null
          id?: string
          nombres?: string | null
          numero_documento?: string | null
          profile_completed?: boolean
          tipo_documento?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_geo_department_fkey'
            columns: ['geo_department']
            isOneToOne: false
            referencedRelation: 'geo_pe_departments'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'profiles_geo_district_fkey'
            columns: ['geo_district']
            isOneToOne: false
            referencedRelation: 'geo_pe_districts'
            referencedColumns: ['code']
          },
        ]
      }
      project_votes: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
          vote_type: Database['public']['Enums']['project_vote_type']
          votes_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
          vote_type: Database['public']['Enums']['project_vote_type']
          votes_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
          vote_type?: Database['public']['Enums']['project_vote_type']
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: 'project_votes_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_votes_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'random_projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          active: boolean
          author_id: string
          content: string
          created_at: string
          geo_department: string
          geo_district: string
          id: string
          image_url: string | null
          impression_count: number
          ioarr_type: Database['public']['Enums']['ioarr_type']
          is_megaproject: boolean
          published_at: string
          title: string
          updated_at: string
          visibility: Database['public']['Enums']['visibility']
        }
        Insert: {
          active?: boolean
          author_id: string
          content: string
          created_at?: string
          geo_department: string
          geo_district: string
          id?: string
          image_url?: string | null
          impression_count?: number
          ioarr_type: Database['public']['Enums']['ioarr_type']
          is_megaproject?: boolean
          published_at: string
          title: string
          updated_at?: string
          visibility?: Database['public']['Enums']['visibility']
        }
        Update: {
          active?: boolean
          author_id?: string
          content?: string
          created_at?: string
          geo_department?: string
          geo_district?: string
          id?: string
          image_url?: string | null
          impression_count?: number
          ioarr_type?: Database['public']['Enums']['ioarr_type']
          is_megaproject?: boolean
          published_at?: string
          title?: string
          updated_at?: string
          visibility?: Database['public']['Enums']['visibility']
        }
        Relationships: [
          {
            foreignKeyName: 'projects_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_geo_department_fkey'
            columns: ['geo_department']
            isOneToOne: false
            referencedRelation: 'geo_pe_departments'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'projects_geo_district_fkey'
            columns: ['geo_district']
            isOneToOne: false
            referencedRelation: 'geo_pe_districts'
            referencedColumns: ['code']
          },
        ]
      }
      publication_sources: {
        Row: {
          active: boolean
          created_at: string
          feed_url: string | null
          id: string
          image_icon_url: string
          name: string
          website_url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          feed_url?: string | null
          id?: string
          image_icon_url: string
          name: string
          website_url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          feed_url?: string | null
          id?: string
          image_icon_url?: string
          name?: string
          website_url?: string
        }
        Relationships: []
      }
      publication_votes: {
        Row: {
          id: string
          publication_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          id?: string
          publication_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          id?: string
          publication_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'publication_votes_publication_id_fkey'
            columns: ['publication_id']
            isOneToOne: false
            referencedRelation: 'publications'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'publication_votes_publication_id_fkey'
            columns: ['publication_id']
            isOneToOne: false
            referencedRelation: 'random_publications'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'publication_votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      publications: {
        Row: {
          active: boolean
          author_id: string | null
          content: string
          created_at: string
          downvotes: number
          external_sources_url: string | null
          feed_post_hash: string | null
          id: string
          image_url: string | null
          impression_count: number
          published_at: string
          source_id: string | null
          title: string
          updated_at: string
          upvotes: number
          visibility: Database['public']['Enums']['visibility']
        }
        Insert: {
          active?: boolean
          author_id?: string | null
          content: string
          created_at?: string
          downvotes?: number
          external_sources_url?: string | null
          feed_post_hash?: string | null
          id?: string
          image_url?: string | null
          impression_count?: number
          published_at: string
          source_id?: string | null
          title: string
          updated_at?: string
          upvotes?: number
          visibility?: Database['public']['Enums']['visibility']
        }
        Update: {
          active?: boolean
          author_id?: string | null
          content?: string
          created_at?: string
          downvotes?: number
          external_sources_url?: string | null
          feed_post_hash?: string | null
          id?: string
          image_url?: string | null
          impression_count?: number
          published_at?: string
          source_id?: string | null
          title?: string
          updated_at?: string
          upvotes?: number
          visibility?: Database['public']['Enums']['visibility']
        }
        Relationships: [
          {
            foreignKeyName: 'publications_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'publications_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'publication_sources'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      random_groups: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          geo_department: string | null
          geo_district: string | null
          id: string | null
          image_url: string | null
          name: string | null
          owner_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          geo_department?: string | null
          geo_district?: string | null
          id?: string | null
          image_url?: string | null
          name?: string | null
          owner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          geo_department?: string | null
          geo_district?: string | null
          id?: string | null
          image_url?: string | null
          name?: string | null
          owner_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'groups_geo_department_fkey'
            columns: ['geo_department']
            isOneToOne: false
            referencedRelation: 'geo_pe_departments'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'groups_geo_district_fkey'
            columns: ['geo_district']
            isOneToOne: false
            referencedRelation: 'geo_pe_districts'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'groups_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      random_projects: {
        Row: {
          active: boolean | null
          author_id: string | null
          content: string | null
          created_at: string | null
          geo_department: string | null
          geo_district: string | null
          id: string | null
          image_url: string | null
          impression_count: number | null
          ioarr_type: Database['public']['Enums']['ioarr_type'] | null
          published_at: string | null
          title: string | null
          updated_at: string | null
          visibility: Database['public']['Enums']['visibility'] | null
        }
        Insert: {
          active?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          geo_department?: string | null
          geo_district?: string | null
          id?: string | null
          image_url?: string | null
          impression_count?: number | null
          ioarr_type?: Database['public']['Enums']['ioarr_type'] | null
          published_at?: string | null
          title?: string | null
          updated_at?: string | null
          visibility?: Database['public']['Enums']['visibility'] | null
        }
        Update: {
          active?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          geo_department?: string | null
          geo_district?: string | null
          id?: string | null
          image_url?: string | null
          impression_count?: number | null
          ioarr_type?: Database['public']['Enums']['ioarr_type'] | null
          published_at?: string | null
          title?: string | null
          updated_at?: string | null
          visibility?: Database['public']['Enums']['visibility'] | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_geo_department_fkey'
            columns: ['geo_department']
            isOneToOne: false
            referencedRelation: 'geo_pe_departments'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'projects_geo_district_fkey'
            columns: ['geo_district']
            isOneToOne: false
            referencedRelation: 'geo_pe_districts'
            referencedColumns: ['code']
          },
        ]
      }
      random_publications: {
        Row: {
          active: boolean | null
          author_id: string | null
          content: string | null
          created_at: string | null
          downvotes: number | null
          external_sources_url: string | null
          feed_post_hash: string | null
          id: string | null
          image_url: string | null
          impression_count: number | null
          published_at: string | null
          source_id: string | null
          title: string | null
          updated_at: string | null
          upvotes: number | null
          visibility: Database['public']['Enums']['visibility'] | null
        }
        Insert: {
          active?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          external_sources_url?: string | null
          feed_post_hash?: string | null
          id?: string | null
          image_url?: string | null
          impression_count?: number | null
          published_at?: string | null
          source_id?: string | null
          title?: string | null
          updated_at?: string | null
          upvotes?: number | null
          visibility?: Database['public']['Enums']['visibility'] | null
        }
        Update: {
          active?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          external_sources_url?: string | null
          feed_post_hash?: string | null
          id?: string | null
          image_url?: string | null
          impression_count?: number | null
          published_at?: string | null
          source_id?: string | null
          title?: string | null
          updated_at?: string | null
          upvotes?: number | null
          visibility?: Database['public']['Enums']['visibility'] | null
        }
        Relationships: [
          {
            foreignKeyName: 'publications_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'publications_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'publication_sources'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      get_event_attendance_summary: {
        Args: { event_id: string }
        Returns: {
          attendees_count: number
          user_is_attending: boolean
        }[]
      }
      get_project_vote_summary: {
        Args: { project_id: string }
        Returns: {
          golden_votes: number
          silver_votes: number
          times_user_has_votes: number
        }[]
      }
      get_votes_left: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      toggle_event_attendance: {
        Args: { p_event_id: string }
        Returns: undefined
      }
      vote_for_project: {
        Args: { project_id: string; votes_count: number }
        Returns: undefined
      }
    }
    Enums: {
      ioarr_type:
      | 'investment'
      | 'optimization'
      | 'extension'
      | 'repair'
      | 'replacement'
      project_vote_type: 'golden' | 'silver'
      visibility: 'draft' | 'public' | 'private'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
    DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
    DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      ioarr_type: [
        'investment',
        'optimization',
        'extension',
        'repair',
        'replacement',
      ],
      project_vote_type: ['golden', 'silver'],
      visibility: ['draft', 'public', 'private'],
    },
  },
} as const;
