export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          apellido_materno: string
          apellido_paterno: string
          celular: string
          created_at: string
          geo_department: string
          geo_district: string
          id: string
          nombres: string
          numero_documento: string
          profile_completed: boolean
          tipo_documento: string
          updated_at: string
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          celular?: string | null
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
          celular?: string | null
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
      [_ in never]: never
    }
    Enums: {
      ioarr_type:
        | 'investment'
        | 'optimization'
        | 'extension'
        | 'repair'
        | 'replacement'
      visibility: 'draft' | 'public' | 'private'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
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
      visibility: ['draft', 'public', 'private'],
    },
  },
} as const;
