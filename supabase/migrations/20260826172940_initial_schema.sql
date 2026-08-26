create extension if not exists vector
with schema extensions;

-- Enums
create type public.course as enum (
    'MCA',
    'MSC'
);

create type public.pc_role as enum (
    'MEMBER',
    'COORDINATOR'
);

create type public.profile_status as enum (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED'
);

create type public.job_type as enum (
    'REMOTE',
    'ONSITE',
    'HYBRID'
);

create type public.application_status as enum (
    'APPLIED',
    'SHORTLISTED',
    'INTERVIEWING',
    'OFFERED',
    'REJECTED'
);

create type public.offer_status as enum (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);

-- Tables
create table public.users (
    id bigint generated always as identity primary key,

    email text not null unique,
    password_hash text not null,

    is_active boolean not null default true,
    last_login_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.students (
    id bigint generated always as identity primary key,

    user_id bigint not null unique
        references public.users(id)
        on delete cascade,

    full_name text not null,
    roll_no text not null unique,
    contact_no text,

    course_name public.course not null,

    enrollment_year integer not null,
    graduation_year integer not null,

    cgpa double precision,
    backlogs integer not null default 0,
    active_backlogs integer not null default 0,

    preferred_roles text[],

    resume_storage_path text,

    profile_status public.profile_status
        not null default 'DRAFT',

    profile_remark text,

    pc_role public.pc_role,

    profile_embedding extensions.vector(1536),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint students_cgpa_check
        check (cgpa is null or (cgpa >= 0 and cgpa <= 10)),

    constraint students_backlogs_check
        check (backlogs >= 0),

    constraint students_active_backlogs_check
        check (active_backlogs >= 0),

    constraint students_active_backlogs_total_check
        check (active_backlogs <= backlogs),

    constraint students_year_check
        check (graduation_year >= enrollment_year)
);

create table public.companies (
    id bigint generated always as identity primary key,

    name text not null,
    location text,
    contact_email text,
    contact_no text,
    website text,

    is_hiring boolean not null default true,

    industry text,
    description text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.jobs (
    id bigint generated always as identity primary key,

    company_id bigint not null
        references public.companies(id)
        on delete restrict,

    title text not null,
    description text not null,

    preferred_courses public.course[],

    is_active boolean not null default true,

    job_type public.job_type not null,

    location text,

    min_cgpa double precision,
    max_backlogs integer,

    application_deadline date,

    job_embedding extensions.vector(1536),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint jobs_min_cgpa_check
        check (
            min_cgpa is null
            or (min_cgpa >= 0 and min_cgpa <= 10)
        ),

    constraint jobs_max_backlogs_check
        check (
            max_backlogs is null
            or max_backlogs >= 0
        )
);

create table public.assessments (
    id bigint generated always as identity primary key,

    student_id bigint not null
        references public.students(id)
        on delete cascade,

    title text not null,
    summary text,

    score integer not null,
    max_score integer not null,

    completed_at timestamptz not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint assessments_score_check
        check (score >= 0),

    constraint assessments_max_score_check
        check (max_score > 0),

    constraint assessments_score_max_check
        check (score <= max_score)
);

create table public.applications (
    id bigint generated always as identity primary key,

    student_id bigint not null
        references public.students(id)
        on delete cascade,

    job_id bigint not null
        references public.jobs(id)
        on delete cascade,

    applied_on date not null default current_date,

    status public.application_status
        not null default 'APPLIED',

    remark text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint applications_student_job_unique
        unique (student_id, job_id)
);

create table public.offers (
    id bigint generated always as identity primary key,

    application_id bigint not null unique
        references public.applications(id)
        on delete cascade,

    role_offered text not null,

    stipend integer,

    is_ppo boolean not null default false,

    internship_duration integer,

    joining_date date,
    offered_on date not null default current_date,

    status public.offer_status
        not null default 'PENDING',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint offers_stipend_check
        check (stipend is null or stipend >= 0),

    constraint offers_internship_duration_check
        check (
            internship_duration is null
            or internship_duration > 0
        )
);

-- Indexes
create index idx_students_user_id
    on public.students(user_id);

create index idx_students_pc_role
    on public.students(pc_role);

create index idx_assessments_student_id
    on public.assessments(student_id);

create index idx_jobs_company_id
    on public.jobs(company_id);

create index idx_jobs_is_active
    on public.jobs(is_active);

create index idx_applications_student_id
    on public.applications(student_id);

create index idx_applications_job_id
    on public.applications(job_id);

create index idx_applications_status
    on public.applications(status);

create index idx_offers_application_id
    on public.offers(application_id);

create index idx_students_profile_embedding
    on public.students
    using hnsw (profile_embedding extensions.vector_cosine_ops);

create index idx_jobs_job_embedding
    on public.jobs
    using hnsw (job_embedding extensions.vector_cosine_ops);
