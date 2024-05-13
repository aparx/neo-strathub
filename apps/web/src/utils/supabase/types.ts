export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      arena: {
        Row: {
          created_at: string
          game_id: number
          id: number
          metadata: Json
          name: string
          outdated: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: number
          metadata?: Json
          name: string
          outdated?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: number
          metadata?: Json
          name?: string
          outdated?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arena_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          created_at: string
          id: number
          message: string | null
          performer_id: string | null
          team_id: string | null
          type: Database["public"]["Enums"]["audit_log_type"] | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          performer_id?: string | null
          team_id?: string | null
          type?: Database["public"]["Enums"]["audit_log_type"] | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          performer_id?: string | null
          team_id?: string | null
          type?: Database["public"]["Enums"]["audit_log_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_performer_id_fkey"
            columns: ["performer_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprint: {
        Row: {
          arena_id: number
          book_id: string
          created_at: string
          id: string
          name: string
          tags: string[] | null
          updated_at: string
          visibility: Database["public"]["Enums"]["bp_visibility"]
        }
        Insert: {
          arena_id: number
          book_id: string
          created_at?: string
          id?: string
          name: string
          tags?: string[] | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["bp_visibility"]
        }
        Update: {
          arena_id?: number
          book_id?: string
          created_at?: string
          id?: string
          name?: string
          tags?: string[] | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["bp_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_arena_id_fkey"
            columns: ["arena_id"]
            isOneToOne: false
            referencedRelation: "arena"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blueprint_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["id"]
          },
        ]
      }
      blueprint_stage: {
        Row: {
          blueprint_id: string
          created_at: string
          data: Json
          id: string
          stage: number
          updated_at: string
        }
        Insert: {
          blueprint_id: string
          created_at?: string
          data?: Json
          id?: string
          stage: number
          updated_at?: string
        }
        Update: {
          blueprint_id?: string
          created_at?: string
          data?: Json
          id?: string
          stage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_stage_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "blueprint"
            referencedColumns: ["id"]
          },
        ]
      }
      book: {
        Row: {
          created_at: string
          id: string
          name: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          boolean_value: boolean | null
          date_value: string | null
          name: string
          numeric_value: number | null
          text_value: string | null
          type: Database["public"]["Enums"]["config_value_type"] | null
        }
        Insert: {
          boolean_value?: boolean | null
          date_value?: string | null
          name: string
          numeric_value?: number | null
          text_value?: string | null
          type?: Database["public"]["Enums"]["config_value_type"] | null
        }
        Update: {
          boolean_value?: boolean | null
          date_value?: string | null
          name?: string
          numeric_value?: number | null
          text_value?: string | null
          type?: Database["public"]["Enums"]["config_value_type"] | null
        }
        Relationships: []
      }
      game: {
        Row: {
          alias: string | null
          created_at: string
          hidden: boolean
          icon: string
          id: number
          metadata: Json
          name: string
        }
        Insert: {
          alias?: string | null
          created_at?: string
          hidden?: boolean
          icon: string
          id?: number
          metadata?: Json
          name: string
        }
        Update: {
          alias?: string | null
          created_at?: string
          hidden?: boolean
          icon?: string
          id?: number
          metadata?: Json
          name?: string
        }
        Relationships: []
      }
      game_object: {
        Row: {
          game_id: number
          id: number
          metadata: Json | null
          name: string | null
          type: Database["public"]["Enums"]["game_object_type"]
          url: string
        }
        Insert: {
          game_id: number
          id?: number
          metadata?: Json | null
          name?: string | null
          type: Database["public"]["Enums"]["game_object_type"]
          url: string
        }
        Update: {
          game_id?: number
          id?: number
          metadata?: Json | null
          name?: string | null
          type?: Database["public"]["Enums"]["game_object_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_object_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
        ]
      }
      plan: {
        Row: {
          config: Json
          created_at: string
          id: number
          is_default: boolean
          name: string
          pricing: number
          pricing_interval: Database["public"]["Enums"]["pay_interval"] | null
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: number
          is_default?: boolean
          name: string
          pricing: number
          pricing_interval?: Database["public"]["Enums"]["pay_interval"] | null
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: number
          is_default?: boolean
          name?: string
          pricing?: number
          pricing_interval?: Database["public"]["Enums"]["pay_interval"] | null
          updated_at?: string
        }
        Relationships: []
      }
      player_slot_assign: {
        Row: {
          created_at: string
          member_id: number
          slot_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          member_id: number
          slot_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          member_id?: number
          slot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_slot_assign_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_slot_assign_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "team_player_slot"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["profile_role"]
          updated_at: string
          username: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
          username: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["profile_role"]
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string
          game_id: number
          id: string
          name: string
          plan_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          game_id: number
          id?: string
          name: string
          plan_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          game_id?: number
          id?: string
          name?: string
          plan_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "game"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member: {
        Row: {
          created_at: string
          id: number
          profile_id: string
          role_id: number
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id: string
          role_id: number
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string
          role_id?: number
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "team_member_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_role: {
        Row: {
          flags: number
          id: number
          name: string
        }
        Insert: {
          flags?: number
          id?: number
          name: string
        }
        Update: {
          flags?: number
          id?: number
          name?: string
        }
        Relationships: []
      }
      team_player_slot: {
        Row: {
          color: string
          created_at: string
          id: string
          slot_index: number | null
          team_id: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          slot_index?: number | null
          team_id: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          slot_index?: number | null
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_player_slot_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_select_audit_log: {
        Args: {
          entry: unknown
        }
        Returns: boolean
      }
      can_select_blueprint: {
        Args: {
          target: unknown
        }
        Returns: boolean
      }
      can_select_book: {
        Args: {
          book: unknown
        }
        Returns: boolean
      }
      can_select_team_member: {
        Args: {
          target: unknown
        }
        Returns: boolean
      }
      create_book: {
        Args: {
          book_name: string
          target_team_id: string
          performer_id: string
        }
        Returns: string
      }
      create_team: {
        Args: {
          team_name: string
          target_plan_id: number
          target_game_id: number
        }
        Returns: string
      }
    }
    Enums: {
      audit_log_type: "create" | "update" | "delete" | "info"
      bp_visibility: "public" | "private" | "unlisted"
      config_value_type: "boolean" | "numeric" | "date" | "text"
      game_object_type: "character" | "gadget" | "floor"
      pay_interval: "monthly" | "yearly"
      profile_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

