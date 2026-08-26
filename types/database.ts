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
        PostgrestVersion: "14.17"
    }
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
                    extensions?: Json
                    operationName?: string
                    query?: string
                    variables?: Json
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
            applications: {
                Row: {
                    applied_on: string
                    created_at: string
                    id: number
                    job_id: number
                    remark: string | null
                    status: Database["public"]["Enums"]["application_status"]
                    student_id: number
                    updated_at: string
                }
                Insert: {
                    applied_on?: string
                    created_at?: string
                    id?: never
                    job_id: number
                    remark?: string | null
                    status?: Database["public"]["Enums"]["application_status"]
                    student_id: number
                    updated_at?: string
                }
                Update: {
                    applied_on?: string
                    created_at?: string
                    id?: never
                    job_id?: number
                    remark?: string | null
                    status?: Database["public"]["Enums"]["application_status"]
                    student_id?: number
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "applications_job_id_fkey"
                        columns: ["job_id"]
                        isOneToOne: false
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "applications_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "students"
                        referencedColumns: ["id"]
                    },
                ]
            }
            assessments: {
                Row: {
                    completed_at: string
                    created_at: string
                    id: number
                    max_score: number
                    score: number
                    student_id: number
                    summary: string | null
                    title: string
                    updated_at: string
                }
                Insert: {
                    completed_at: string
                    created_at?: string
                    id?: never
                    max_score: number
                    score: number
                    student_id: number
                    summary?: string | null
                    title: string
                    updated_at?: string
                }
                Update: {
                    completed_at?: string
                    created_at?: string
                    id?: never
                    max_score?: number
                    score?: number
                    student_id?: number
                    summary?: string | null
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "assessments_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "students"
                        referencedColumns: ["id"]
                    },
                ]
            }
            companies: {
                Row: {
                    contact_email: string | null
                    contact_no: string | null
                    created_at: string
                    description: string | null
                    id: number
                    industry: string | null
                    is_hiring: boolean
                    location: string | null
                    name: string
                    updated_at: string
                    website: string | null
                }
                Insert: {
                    contact_email?: string | null
                    contact_no?: string | null
                    created_at?: string
                    description?: string | null
                    id?: never
                    industry?: string | null
                    is_hiring?: boolean
                    location?: string | null
                    name: string
                    updated_at?: string
                    website?: string | null
                }
                Update: {
                    contact_email?: string | null
                    contact_no?: string | null
                    created_at?: string
                    description?: string | null
                    id?: never
                    industry?: string | null
                    is_hiring?: boolean
                    location?: string | null
                    name?: string
                    updated_at?: string
                    website?: string | null
                }
                Relationships: []
            }
            jobs: {
                Row: {
                    application_deadline: string | null
                    company_id: number
                    created_at: string
                    description: string
                    id: number
                    is_active: boolean
                    job_embedding: string | null
                    job_type: Database["public"]["Enums"]["job_type"]
                    location: string | null
                    max_backlogs: number | null
                    min_cgpa: number | null
                    preferred_courses: Database["public"]["Enums"]["course"][] | null
                    title: string
                    updated_at: string
                }
                Insert: {
                    application_deadline?: string | null
                    company_id: number
                    created_at?: string
                    description: string
                    id?: never
                    is_active?: boolean
                    job_embedding?: string | null
                    job_type: Database["public"]["Enums"]["job_type"]
                    location?: string | null
                    max_backlogs?: number | null
                    min_cgpa?: number | null
                    preferred_courses?: Database["public"]["Enums"]["course"][] | null
                    title: string
                    updated_at?: string
                }
                Update: {
                    application_deadline?: string | null
                    company_id?: number
                    created_at?: string
                    description?: string
                    id?: never
                    is_active?: boolean
                    job_embedding?: string | null
                    job_type?: Database["public"]["Enums"]["job_type"]
                    location?: string | null
                    max_backlogs?: number | null
                    min_cgpa?: number | null
                    preferred_courses?: Database["public"]["Enums"]["course"][] | null
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                ]
            }
            offers: {
                Row: {
                    application_id: number
                    created_at: string
                    id: number
                    internship_duration: number | null
                    is_ppo: boolean
                    joining_date: string | null
                    offered_on: string
                    role_offered: string
                    status: Database["public"]["Enums"]["offer_status"]
                    stipend: number | null
                    updated_at: string
                }
                Insert: {
                    application_id: number
                    created_at?: string
                    id?: never
                    internship_duration?: number | null
                    is_ppo?: boolean
                    joining_date?: string | null
                    offered_on?: string
                    role_offered: string
                    status?: Database["public"]["Enums"]["offer_status"]
                    stipend?: number | null
                    updated_at?: string
                }
                Update: {
                    application_id?: number
                    created_at?: string
                    id?: never
                    internship_duration?: number | null
                    is_ppo?: boolean
                    joining_date?: string | null
                    offered_on?: string
                    role_offered?: string
                    status?: Database["public"]["Enums"]["offer_status"]
                    stipend?: number | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "offers_application_id_fkey"
                        columns: ["application_id"]
                        isOneToOne: true
                        referencedRelation: "applications"
                        referencedColumns: ["id"]
                    },
                ]
            }
            students: {
                Row: {
                    active_backlogs: number
                    backlogs: number
                    cgpa: number | null
                    contact_no: string | null
                    course_name: Database["public"]["Enums"]["course"]
                    created_at: string
                    enrollment_year: number
                    full_name: string
                    graduation_year: number
                    id: number
                    pc_role: Database["public"]["Enums"]["pc_role"] | null
                    preferred_roles: string[] | null
                    profile_embedding: string | null
                    profile_remark: string | null
                    profile_status: Database["public"]["Enums"]["profile_status"]
                    resume_storage_path: string | null
                    roll_no: string
                    updated_at: string
                    user_id: number
                }
                Insert: {
                    active_backlogs?: number
                    backlogs?: number
                    cgpa?: number | null
                    contact_no?: string | null
                    course_name: Database["public"]["Enums"]["course"]
                    created_at?: string
                    enrollment_year: number
                    full_name: string
                    graduation_year: number
                    id?: never
                    pc_role?: Database["public"]["Enums"]["pc_role"] | null
                    preferred_roles?: string[] | null
                    profile_embedding?: string | null
                    profile_remark?: string | null
                    profile_status?: Database["public"]["Enums"]["profile_status"]
                    resume_storage_path?: string | null
                    roll_no: string
                    updated_at?: string
                    user_id: number
                }
                Update: {
                    active_backlogs?: number
                    backlogs?: number
                    cgpa?: number | null
                    contact_no?: string | null
                    course_name?: Database["public"]["Enums"]["course"]
                    created_at?: string
                    enrollment_year?: number
                    full_name?: string
                    graduation_year?: number
                    id?: never
                    pc_role?: Database["public"]["Enums"]["pc_role"] | null
                    preferred_roles?: string[] | null
                    profile_embedding?: string | null
                    profile_remark?: string | null
                    profile_status?: Database["public"]["Enums"]["profile_status"]
                    resume_storage_path?: string | null
                    roll_no?: string
                    updated_at?: string
                    user_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "students_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            test: {
                Row: {
                    id: number
                    message: string | null
                }
                Insert: {
                    id?: number
                    message?: string | null
                }
                Update: {
                    id?: number
                    message?: string | null
                }
                Relationships: []
            }
            users: {
                Row: {
                    created_at: string
                    email: string
                    id: number
                    is_active: boolean
                    last_login_at: string | null
                    password_hash: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    email: string
                    id?: never
                    is_active?: boolean
                    last_login_at?: string | null
                    password_hash: string
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    email?: string
                    id?: never
                    is_active?: boolean
                    last_login_at?: string | null
                    password_hash?: string
                    updated_at?: string
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
            application_status:
            | "APPLIED"
            | "SHORTLISTED"
            | "INTERVIEWING"
            | "OFFERED"
            | "REJECTED"
            course: "MCA" | "MSC"
            job_type: "REMOTE" | "ONSITE" | "HYBRID"
            offer_status: "PENDING" | "ACCEPTED" | "REJECTED"
            pc_role: "MEMBER" | "COORDINATOR"
            profile_status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED"
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
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {
            application_status: [
                "APPLIED",
                "SHORTLISTED",
                "INTERVIEWING",
                "OFFERED",
                "REJECTED",
            ],
            course: ["MCA", "MSC"],
            job_type: ["REMOTE", "ONSITE", "HYBRID"],
            offer_status: ["PENDING", "ACCEPTED", "REJECTED"],
            pc_role: ["MEMBER", "COORDINATOR"],
            profile_status: ["DRAFT", "PENDING_APPROVAL", "APPROVED"],
        },
    },
} as const
