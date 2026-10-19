export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      events: {
        Row: {
          art: string
          description: string
          id: string
          sort_order: number
          surface: string
          tournament_id: string
        }
        Insert: {
          art: string
          description: string
          id: string
          sort_order: number
          surface: string
          tournament_id: string
        }
        Update: {
          art?: string
          description?: string
          id?: string
          sort_order?: number
          surface?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      game_reviews: {
        Row: {
          author: string
          avatar_src: string
          game_id: string
          id: string
          liked: boolean
          likes: number
          rating: number | null
          sort_order: number
          text: string
          time_label: string
        }
        Insert: {
          author: string
          avatar_src: string
          game_id: string
          id: string
          liked?: boolean
          likes?: number
          rating?: number | null
          sort_order: number
          text: string
          time_label: string
        }
        Update: {
          author?: string
          avatar_src?: string
          game_id?: string
          id?: string
          liked?: boolean
          likes?: number
          rating?: number | null
          sort_order?: number
          text?: string
          time_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_reviews_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          about: string
          badges: string[]
          gallery: string[]
          genres: string[]
          hero_src: string
          id: string
          image_src: string
          in_catalog: boolean
          platforms: string[]
          rating: number
          reviews_count: number
          socials: string[]
          sort_order: number
          statuses: string[]
          title: string
        }
        Insert: {
          about: string
          badges?: string[]
          gallery?: string[]
          genres?: string[]
          hero_src: string
          id: string
          image_src: string
          in_catalog?: boolean
          platforms?: string[]
          rating: number
          reviews_count: number
          socials?: string[]
          sort_order: number
          statuses?: string[]
          title: string
        }
        Update: {
          about?: string
          badges?: string[]
          gallery?: string[]
          genres?: string[]
          hero_src?: string
          id?: string
          image_src?: string
          in_catalog?: boolean
          platforms?: string[]
          rating?: number
          reviews_count?: number
          socials?: string[]
          sort_order?: number
          statuses?: string[]
          title?: string
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          events: number
          medal_count: number
          metric: string
          period: string
          player_id: string
          points: number
          position: number
          streak: number
        }
        Insert: {
          events: number
          medal_count: number
          metric: string
          period: string
          player_id: string
          points: number
          position: number
          streak: number
        }
        Update: {
          events?: number
          medal_count?: number
          metric?: string
          period?: string
          player_id?: string
          points?: number
          position?: number
          streak?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      medals: {
        Row: {
          art: string
          id: string
          label: string
          reward_points: number
          sort_order: number
          sparkle: boolean
        }
        Insert: {
          art: string
          id: string
          label: string
          reward_points: number
          sort_order: number
          sparkle?: boolean
        }
        Update: {
          art?: string
          id?: string
          label?: string
          reward_points?: number
          sort_order?: number
          sparkle?: boolean
        }
        Relationships: []
      }
      mission_steps: {
        Row: {
          mission_id: string
          position: number
          text: string
        }
        Insert: {
          mission_id: string
          position: number
          text: string
        }
        Update: {
          mission_id?: string
          position?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_steps_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          category: string
          description: string
          ended: boolean
          featured: boolean
          highlighted: boolean
          home_position: number | null
          id: string
          image_src: string
          reward_points: number
          sort_order: number
          title: string
        }
        Insert: {
          category: string
          description: string
          ended?: boolean
          featured?: boolean
          highlighted?: boolean
          home_position?: number | null
          id: string
          image_src: string
          reward_points: number
          sort_order: number
          title: string
        }
        Update: {
          category?: string
          description?: string
          ended?: boolean
          featured?: boolean
          highlighted?: boolean
          home_position?: number | null
          id?: string
          image_src?: string
          reward_points?: number
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          body: Json
          category: string
          id: string
          image_src: string
          published_at: string
          read_minutes: number
          sort_order: number
          title: string
        }
        Insert: {
          body: Json
          category: string
          id: string
          image_src: string
          published_at: string
          read_minutes: number
          sort_order: number
          title: string
        }
        Update: {
          body?: Json
          category?: string
          id?: string
          image_src?: string
          published_at?: string
          read_minutes?: number
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      player_medals: {
        Row: {
          claimed: boolean
          medal_id: string
          player_id: string
        }
        Insert: {
          claimed?: boolean
          medal_id: string
          player_id: string
        }
        Update: {
          claimed?: boolean
          medal_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_medals_medal_id_fkey"
            columns: ["medal_id"]
            isOneToOne: false
            referencedRelation: "medals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_medals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_missions: {
        Row: {
          mission_id: string
          player_id: string
        }
        Insert: {
          mission_id: string
          player_id: string
        }
        Update: {
          mission_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_missions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar_src: string
          days_at_rank: number
          events: number
          historic_rank: number
          id: string
          level: string
          medal_count: number
          name: string
          points: number
          streak: number
        }
        Insert: {
          avatar_src: string
          days_at_rank: number
          events: number
          historic_rank: number
          id: string
          level: string
          medal_count: number
          name: string
          points: number
          streak: number
        }
        Update: {
          avatar_src?: string
          days_at_rank?: number
          events?: number
          historic_rank?: number
          id?: string
          level?: string
          medal_count?: number
          name?: string
          points?: number
          streak?: number
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          player_id: string
          position: number
          tournament_id: string
        }
        Insert: {
          player_id: string
          position: number
          tournament_id: string
        }
        Update: {
          player_id?: string
          position?: number
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_prizes: {
        Row: {
          amount: number | null
          position: number
          tournament_id: string
        }
        Insert: {
          amount?: number | null
          position: number
          tournament_id: string
        }
        Update: {
          amount?: number | null
          position?: number
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_prizes_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          about: string
          banner_src: string
          capacity: number
          format: string
          game: string
          hero_src: string
          host: string
          id: string
          image_src: string
          joined: number
          mode: string | null
          official: boolean
          prize_amount: number
          prize_currency: string
          sort_order: number
          starts_at: string
          starts_in_seconds: number
          title: string
        }
        Insert: {
          about: string
          banner_src: string
          capacity: number
          format: string
          game: string
          hero_src: string
          host: string
          id: string
          image_src: string
          joined: number
          mode?: string | null
          official?: boolean
          prize_amount: number
          prize_currency: string
          sort_order: number
          starts_at: string
          starts_in_seconds: number
          title: string
        }
        Update: {
          about?: string
          banner_src?: string
          capacity?: number
          format?: string
          game?: string
          hero_src?: string
          host?: string
          id?: string
          image_src?: string
          joined?: number
          mode?: string | null
          official?: boolean
          prize_amount?: number
          prize_currency?: string
          sort_order?: number
          starts_at?: string
          starts_in_seconds?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
