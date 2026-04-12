--
-- PostgreSQL database dump
--

\restrict p9hDOtdUy2kxA6GODtSyoeR6LMWVupw3p6BjkewrC6ZM3dkbWoIQpTtMljIurOU

-- Dumped from database version 17.8 (a48d9ca)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- Name: CourseLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CourseLevel" AS ENUM (
    'BEGINNER',
    'PRE_INTERMEDIATE',
    'INTERMEDIATE',
    'UPPER_INTERMEDIATE',
    'ADVANCED'
);


--
-- Name: ExamAnswer; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ExamAnswer" AS ENUM (
    'variantA',
    'variantB',
    'variantC',
    'variantD'
);


--
-- Name: HomeworkSubStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HomeworkSubStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: PaidVia; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaidVia" AS ENUM (
    'PAYME',
    'CLICK',
    'CASH'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPERADMIN',
    'ADMIN',
    'MENTOR',
    'ASSISTANT',
    'STUDENT'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" uuid NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    scope text,
    password text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: invitation; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.invitation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    email text NOT NULL,
    role text,
    status text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "inviterId" uuid NOT NULL
);


--
-- Name: jwks; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.jwks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "publicKey" text NOT NULL,
    "privateKey" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone
);


--
-- Name: member; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "organizationId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    role text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: organization; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.organization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    "createdAt" timestamp with time zone NOT NULL,
    metadata text
);


--
-- Name: project_config; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.project_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    endpoint_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    trusted_origins jsonb NOT NULL,
    social_providers jsonb NOT NULL,
    email_provider jsonb,
    email_and_password jsonb,
    allow_localhost boolean NOT NULL
);


--
-- Name: session; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" uuid NOT NULL,
    "impersonatedBy" text,
    "activeOrganizationId" text
);


--
-- Name: user; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role text,
    banned boolean,
    "banReason" text,
    "banExpires" timestamp with time zone
);


--
-- Name: verification; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.verification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: AssignedCourse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AssignedCourse" (
    "userId" integer NOT NULL,
    "courseId" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Course; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Course" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    about text NOT NULL,
    price numeric(10,2) NOT NULL,
    banner text NOT NULL,
    "introVideo" text,
    level public."CourseLevel" NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "categoryId" integer NOT NULL,
    "mentorId" integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


--
-- Name: CourseCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CourseCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CourseCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."CourseCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: CourseCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."CourseCategory_id_seq" OWNED BY public."CourseCategory".id;


--
-- Name: Exam; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Exam" (
    id integer NOT NULL,
    question text NOT NULL,
    "variantA" text NOT NULL,
    "variantB" text NOT NULL,
    "variantC" text NOT NULL,
    "variantD" text NOT NULL,
    answer public."ExamAnswer" NOT NULL,
    "sectionId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ExamResult; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ExamResult" (
    id integer NOT NULL,
    "sectionId" integer NOT NULL,
    "userId" integer NOT NULL,
    passed boolean NOT NULL,
    corrects integer NOT NULL,
    wrongs integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: ExamResult_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ExamResult_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ExamResult_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ExamResult_id_seq" OWNED BY public."ExamResult".id;


--
-- Name: Exam_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Exam_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Exam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Exam_id_seq" OWNED BY public."Exam".id;


--
-- Name: Homework; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Homework" (
    id integer NOT NULL,
    task text NOT NULL,
    file text NOT NULL,
    "lessonId" text NOT NULL,
    "updateAt" timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: HomeworkSubmission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HomeworkSubmission" (
    id integer NOT NULL,
    text text NOT NULL,
    file text NOT NULL,
    reason text NOT NULL,
    status public."HomeworkSubStatus" DEFAULT 'PENDING'::public."HomeworkSubStatus" NOT NULL,
    "homeworkId" integer NOT NULL,
    "userId" integer NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: HomeworkSubmission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."HomeworkSubmission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: HomeworkSubmission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."HomeworkSubmission_id_seq" OWNED BY public."HomeworkSubmission".id;


--
-- Name: Homework_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Homework_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Homework_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Homework_id_seq" OWNED BY public."Homework".id;


--
-- Name: LastActivity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LastActivity" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseId" text NOT NULL,
    "sectionId" integer NOT NULL,
    "lessonId" text NOT NULL,
    url text NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: LastActivity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LastActivity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LastActivity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LastActivity_id_seq" OWNED BY public."LastActivity".id;


--
-- Name: LessonFile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LessonFile" (
    id integer NOT NULL,
    file text NOT NULL,
    note text NOT NULL,
    "lessonId" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: LessonFile_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LessonFile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LessonFile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LessonFile_id_seq" OWNED BY public."LessonFile".id;


--
-- Name: LessonView; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LessonView" (
    "lessonId" text NOT NULL,
    "userId" integer NOT NULL,
    view boolean DEFAULT false NOT NULL
);


--
-- Name: Lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lessons" (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    about text NOT NULL,
    video text NOT NULL,
    "sectionId" integer NOT NULL,
    updated_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: MentorProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MentorProfile" (
    id integer NOT NULL,
    about text NOT NULL,
    job text NOT NULL,
    experience integer NOT NULL,
    telegram text NOT NULL,
    instagram text NOT NULL,
    linkedin text NOT NULL,
    facebook text NOT NULL,
    github text NOT NULL,
    website text NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: MentorProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."MentorProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: MentorProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."MentorProfile_id_seq" OWNED BY public."MentorProfile".id;


--
-- Name: PurchasedCourse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PurchasedCourse" (
    "courseId" text NOT NULL,
    "userId" integer NOT NULL,
    amount numeric(10,2),
    "paidVia" public."PaidVia" NOT NULL,
    "purchasedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Question" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseId" text NOT NULL,
    text text NOT NULL,
    file text,
    read boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: QuestionAnswer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuestionAnswer" (
    id integer NOT NULL,
    "questionId" integer NOT NULL,
    "userId" integer NOT NULL,
    text text NOT NULL,
    file text,
    "updatedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: QuestionAnswer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."QuestionAnswer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: QuestionAnswer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."QuestionAnswer_id_seq" OWNED BY public."QuestionAnswer".id;


--
-- Name: Question_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Question_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Question_id_seq" OWNED BY public."Question".id;


--
-- Name: Rating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Rating" (
    id integer NOT NULL,
    rate integer NOT NULL,
    comment text NOT NULL,
    "courseId" text NOT NULL,
    "userId" integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Rating_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Rating_id_seq" OWNED BY public."Rating".id;


--
-- Name: SectionLesson; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SectionLesson" (
    id integer NOT NULL,
    name text NOT NULL,
    "courseId" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: SectionLesson_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."SectionLesson_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: SectionLesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."SectionLesson_id_seq" OWNED BY public."SectionLesson".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    phone text NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: CourseCategory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CourseCategory" ALTER COLUMN id SET DEFAULT nextval('public."CourseCategory_id_seq"'::regclass);


--
-- Name: Exam id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam" ALTER COLUMN id SET DEFAULT nextval('public."Exam_id_seq"'::regclass);


--
-- Name: ExamResult id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult" ALTER COLUMN id SET DEFAULT nextval('public."ExamResult_id_seq"'::regclass);


--
-- Name: Homework id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Homework" ALTER COLUMN id SET DEFAULT nextval('public."Homework_id_seq"'::regclass);


--
-- Name: HomeworkSubmission id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HomeworkSubmission" ALTER COLUMN id SET DEFAULT nextval('public."HomeworkSubmission_id_seq"'::regclass);


--
-- Name: LastActivity id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LastActivity" ALTER COLUMN id SET DEFAULT nextval('public."LastActivity_id_seq"'::regclass);


--
-- Name: LessonFile id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonFile" ALTER COLUMN id SET DEFAULT nextval('public."LessonFile_id_seq"'::regclass);


--
-- Name: MentorProfile id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorProfile" ALTER COLUMN id SET DEFAULT nextval('public."MentorProfile_id_seq"'::regclass);


--
-- Name: Question id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Question" ALTER COLUMN id SET DEFAULT nextval('public."Question_id_seq"'::regclass);


--
-- Name: QuestionAnswer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionAnswer" ALTER COLUMN id SET DEFAULT nextval('public."QuestionAnswer_id_seq"'::regclass);


--
-- Name: Rating id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Rating" ALTER COLUMN id SET DEFAULT nextval('public."Rating_id_seq"'::regclass);


--
-- Name: SectionLesson id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SectionLesson" ALTER COLUMN id SET DEFAULT nextval('public."SectionLesson_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invitation; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.invitation (id, "organizationId", email, role, status, "expiresAt", "createdAt", "inviterId") FROM stdin;
\.


--
-- Data for Name: jwks; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.jwks (id, "publicKey", "privateKey", "createdAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.member (id, "organizationId", "userId", role, "createdAt") FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.organization (id, name, slug, logo, "createdAt", metadata) FROM stdin;
\.


--
-- Data for Name: project_config; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.project_config (id, name, endpoint_id, created_at, updated_at, trusted_origins, social_providers, email_provider, email_and_password, allow_localhost) FROM stdin;
1213845a-c405-4847-8250-f6e4c2514f0a	LMS-PROJECT	ep-royal-scene-agft7jbo	2026-01-19 18:53:49.828+00	2026-01-19 18:53:49.828+00	[]	[{"id": "google", "isShared": true}]	{"type": "shared"}	{"enabled": true, "disableSignUp": false, "emailVerificationMethod": "otp", "requireEmailVerification": false, "autoSignInAfterVerification": true, "sendVerificationEmailOnSignIn": false, "sendVerificationEmailOnSignUp": false}	t
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy", "activeOrganizationId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role, banned, "banReason", "banExpires") FROM stdin;
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY neon_auth.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssignedCourse; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AssignedCourse" ("userId", "courseId", created_at) FROM stdin;
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Course" (id, name, about, price, banner, "introVideo", level, published, "categoryId", "mentorId", created_at, "updatedAt") FROM stdin;
24909d16-5bf0-424f-b414-c229de89b2ef	HTML, CSS va JavaScript: Noldan Web Dasturlash	Veb-sayt yaratishni o‘rganmoqchimisiz? Ushbu kurs orqali siz HTML, CSS va JavaScript asoslarini noldan o‘rganasiz. Kurs davomida siz sahifalar yaratish, dizayn qilish va interaktiv funksiyalar qo‘shishni o‘rganasiz. Har bir modul amaliy mashg‘ulotlar bilan mustahkamlanadi. Kurs yakunida siz to‘liq ishlaydigan shaxsiy web loyiha yaratib chiqasiz.	99.00	https://res.cloudinary.com/du7ykjtlh/image/upload/v1774940203/courses/1774940203186-frontend_banner.png.png	https://res.cloudinary.com/du7ykjtlh/video/upload/v1774940204/courses/1774940203187-HTMLda%20dasturlash%20%20%200.%20Kurs%20haqida.mp4.mp4	BEGINNER	t	1	1	2026-03-31 06:56:45.234	2026-03-31 06:56:45.234
05c368ce-cf47-45f5-b73c-eb6674196373	Full Stack Developer	this course will be available for students	120000.00	https://res.cloudinary.com/du7ykjtlh/image/upload/v1775103340/courses/1775103339709-Rectangle%2016%20%282%29.png.png	https://res.cloudinary.com/du7ykjtlh/video/upload/v1775103341/courses/1775103340023-muhammadAli_speech.mp4.mp4	INTERMEDIATE	t	4	1	2026-04-02 04:15:42.143	2026-04-02 04:15:42.143
d18a79f4-a344-43d2-9af7-20fa8cfc2d1e	nbkcxvhdfguvhdvuygrf	 xcdfbjvcn nxczv	299000.00	https://res.cloudinary.com/du7ykjtlh/image/upload/v1775105281/courses/1775105280531-image%205%20%282%29.png.png	https://res.cloudinary.com/du7ykjtlh/video/upload/v1775105281/courses/1775105280531-1773222654814-410457.mp4.mp4	BEGINNER	t	3	3	2026-04-02 04:48:02.32	2026-04-02 04:48:02.32
\.


--
-- Data for Name: CourseCategory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CourseCategory" (id, name, created_at) FROM stdin;
3	Grafik Dizayn	2026-01-22 06:47:21.129
6	Kiberxavsizlik	2026-01-22 07:12:20.396
1	Frontend	2026-01-26 13:17:08.9
2	Backend	2026-01-22 06:47:36.119
4	Sun'iy Intellekt	2026-01-22 06:47:07.362
5	English	2026-01-25 10:58:53.764
\.


--
-- Data for Name: Exam; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Exam" (id, question, "variantA", "variantB", "variantC", "variantD", answer, "sectionId", "createdAt") FROM stdin;
\.


--
-- Data for Name: ExamResult; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ExamResult" (id, "sectionId", "userId", passed, corrects, wrongs, created_at) FROM stdin;
\.


--
-- Data for Name: Homework; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Homework" (id, task, file, "lessonId", "updateAt", created_at) FROM stdin;
\.


--
-- Data for Name: HomeworkSubmission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HomeworkSubmission" (id, text, file, reason, status, "homeworkId", "userId", "updatedAt", created_at) FROM stdin;
\.


--
-- Data for Name: LastActivity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LastActivity" (id, "userId", "courseId", "sectionId", "lessonId", url, updated_at) FROM stdin;
\.


--
-- Data for Name: LessonFile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LessonFile" (id, file, note, "lessonId", created_at) FROM stdin;
\.


--
-- Data for Name: LessonView; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LessonView" ("lessonId", "userId", view) FROM stdin;
\.


--
-- Data for Name: Lessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Lessons" (id, name, about, video, "sectionId", updated_at, created_at) FROM stdin;
9b7752fc-1de4-4988-bb79-357d28ced879	1-dars: HTML bilan tanishuv	HTML nima ekanligi, u qanday ishlashi va veb-sahifa tuzilishidagi roli tushuntiriladi. Shuningdek HTML fayl qanday yaratilishi ko‘rsatiladi.	https://res.cloudinary.com/du7ykjtlh/video/upload/v1774941576/lessons_videos/rqpmijtfus3soyong4wm.mp4	17	\N	2026-03-31 07:19:37.422
a81a1a54-964f-446c-9e4d-2e05789db3b6	2-dars: HTML hujjat strukturasi	<!DOCTYPE html>, <html>, <head>, <body> kabi asosiy teglar va sahifaning to‘liq strukturasi tushuntiriladi.	https://res.cloudinary.com/du7ykjtlh/video/upload/v1774941664/lessons_videos/s7inzckzdrcbmknpoyph.mp4	17	\N	2026-03-31 07:21:05.777
05801bae-7130-4574-9018-4fa9872363da	1-dars: CSS bilan tanishuv	CSS nima va u HTML bilan qanday ishlashi tushuntiriladi.	https://res.cloudinary.com/du7ykjtlh/video/upload/v1774941794/lessons_videos/udeba0cay8geie1ystsu.mp4	18	\N	2026-03-31 07:23:15.3
ecad07ee-01af-4b11-9036-ad0fbd581db4	2-dars: CSS selektorlar	Element, class va id selektorlar yordamida elementlarni tanlash.	https://res.cloudinary.com/du7ykjtlh/video/upload/v1774941889/lessons_videos/k3vucefekste3uo1opxr.mp4	18	\N	2026-03-31 07:24:50.919
6a410aa3-a183-4929-b85a-6a3c7905695a	Hech kimga bermaysiz seni O'zbekiston	perfect lesson	https://res.cloudinary.com/du7ykjtlh/video/upload/v1775103345/lessons_videos/rejnokmvzae9crceevjv.mp4	21	\N	2026-04-02 04:15:46.314
e1fcf7a0-bf61-45da-97fb-23870e4dfe34	v cvfjgnb	x cmnv fdjgb	https://res.cloudinary.com/du7ykjtlh/video/upload/v1775105287/lessons_videos/adxbo1vbjyawi5qjxygd.mp4	22	\N	2026-04-02 04:48:07.984
dd462318-344d-4b6c-a6f6-ae8249ecd07c	c gfjb	salok	https://res.cloudinary.com/du7ykjtlh/video/upload/v1775105290/lessons_videos/hqgkow2l1renohncxmpc.mp4	23	\N	2026-04-02 04:48:11.742
c5c97971-a7b3-449a-8d28-98e36b86d08e	xcvgfhr	cvfg	https://res.cloudinary.com/du7ykjtlh/video/upload/v1775105295/lessons_videos/i2vs1upigsinpwpjmqki.mp4	24	\N	2026-04-02 04:48:16.854
\.


--
-- Data for Name: MentorProfile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MentorProfile" (id, about, job, experience, telegram, instagram, linkedin, facebook, github, website, "userId") FROM stdin;
1	Backend mentor, 5+ years experience	Senior Backend Developer	5	https://t.me/Abrorbek	https://instagram.com/abrorbek	https://linkedin.com/in/abrorbek	https://facebook.com/abrorbek06	https://github.com/abrorbek	https://mywebsite.com	2
3	Mengilov  Axrorbek	Full Stack developer	4	http://localhost:5174/dashboard	http://localhost:5174/dashboard	http://localhost:5174/dashboard	http://localhost:5174/dashboard	http://localhost:5174/dashboard	https://tuit.uz/	1
2	Full-Stack mentor, 3+ years experience	Senior Backend Developer	4	https://t.me/sirojiddin2006	https://instagram.com/axrorbek_mengilov7	https://linkedin.com/in/sirojiddin	https://facebook.com/sirojiddin1	https://github.com/username	https://mywebsite.com	3
\.


--
-- Data for Name: PurchasedCourse; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PurchasedCourse" ("courseId", "userId", amount, "paidVia", "purchasedAt") FROM stdin;
05c368ce-cf47-45f5-b73c-eb6674196373	9	120000.00	PAYME	2026-04-02 04:33:15.676
d18a79f4-a344-43d2-9af7-20fa8cfc2d1e	9	299000.00	PAYME	2026-04-02 05:48:56.301
24909d16-5bf0-424f-b414-c229de89b2ef	9	99.00	CLICK	2026-04-02 06:15:45.198
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Question" (id, "userId", "courseId", text, file, read, "readAt", "updatedAt", created_at) FROM stdin;
\.


--
-- Data for Name: QuestionAnswer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuestionAnswer" (id, "questionId", "userId", text, file, "updatedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Rating; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Rating" (id, rate, comment, "courseId", "userId", created_at) FROM stdin;
1	5	Bu kurs menga juda yoqdi qoyil!	bf17466-fd23-4fe6-85e0-1bcac7c257ab	4	2026-01-23 13:53:25.773
3	5	Judayam zor kurs ekan!	6a384598-a7d1-4b4b-be38-5ffc657eb64c	4	2026-01-23 14:01:12.696
4	5	Judayam zor!	6a384598-a7d1-4b4b-be38-5ffc657eb64c	4	2026-01-23 14:01:23.728
5	5	Judayam zor!	bf17466-fd23-4fe6-85e0-1bcac7c257ab	4	2026-01-23 14:01:39.239
6	5	Judayam foydali kurs!	db0b9988-e7db-48c5-b9b4-40d14fa3403f	8	2026-01-26 13:34:01.062
\.


--
-- Data for Name: SectionLesson; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SectionLesson" (id, name, "courseId", created_at) FROM stdin;
17	Kirish. HTML  Asoslari.	24909d16-5bf0-424f-b414-c229de89b2ef	2026-03-31 07:18:35.358
18	CSS va Stillar	24909d16-5bf0-424f-b414-c229de89b2ef	2026-03-31 07:21:42.183
19	JavaScript Asoslari	24909d16-5bf0-424f-b414-c229de89b2ef	2026-03-31 07:25:15.535
20	Amaliy Loyiha	24909d16-5bf0-424f-b414-c229de89b2ef	2026-03-31 07:25:48.255
21	Salom dunyo	05c368ce-cf47-45f5-b73c-eb6674196373	2026-04-02 04:15:42.802
22	scbdhjfvbdfhdf	d18a79f4-a344-43d2-9af7-20fa8cfc2d1e	2026-04-02 04:48:02.88
23	xc dfjg	d18a79f4-a344-43d2-9af7-20fa8cfc2d1e	2026-04-02 04:48:08.618
24	nvdfvdf	d18a79f4-a344-43d2-9af7-20fa8cfc2d1e	2026-04-02 04:48:12.089
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, name, surname, phone, "isVerified", password, role, created_at) FROM stdin;
7	Olimjon	Murtazoyev	+998885790309	t	$2b$10$D8UXshANhlu9cbzKeA1Ja.r1lJhsJLF71s8FNcMPeapU0xgEnhdKy	STUDENT	2026-01-26 16:04:49.971
12	Ali	Soliyev	+998995992648	t	$2b$10$jxliTsPvjWQqAoKNbAretOTo13MHuUbDkZdx93jorUejsvGNvAuVe	STUDENT	2026-03-06 07:32:45.677
2	Abrorbek	Soatmurotov	+998507703050	t	$2b$10$hygJZwNh/nfzsJq8cKtKn.gXdnHdGjXqdlDVFomF3QQrRygj5V4Pu	MENTOR	2026-01-20 15:44:49.986
4	Aziz	Soqqiyev	+998938964506	t	$2b$10$c/H2GFmN4HbaWK.yrTRSsO1r5ZcEGzJNYbkTWfZsqnGZAZ2EBo.My	STUDENT	2026-01-23 13:51:33.447
5	Javlon	Rahmatullayev	+998931900714	t	$2b$10$MTM2h0iHwt3F2YpSHsIYueWVxmt1LPDQGCE2.1npRJqv6GF2wHlr6	STUDENT	2026-01-25 11:22:29.051
8	Anvar	Sattorov	+998975661099	t	$2b$10$wXtTgWbQLwXDypUsNlfnP.JHAmzhK/r28qD5W2lpazbMQRkLf5qEe	STUDENT	2026-01-26 13:25:13.848
10	Rustam	Mo'minov	+998905457605	t	$2b$10$9MD1oTrgj1kxyoxNFtwd9.hVFIhkhnL14quEtLXpG6CBSbTwnJkDa	STUDENT	2026-02-15 07:11:43.723
9	Mike	Tyson	+998938812261	t	$2b$10$emvW25OsynNOyL2W0GoxvOlx5OG5AmRfB/UW.KR5x6NGcaBggzq6O	STUDENT	2026-02-25 11:41:54.31
1	Sirojiddin	Oyosboyev	+998883700025	t	$2b$10$SFn/p7wtYzpiCYBKxuSgEOnEjmFi0jRkYx27NNsB09Ax/zo2R74Na	ADMIN	2026-01-21 10:56:58.535
3	Sirojiddin	Oyosboyev	+998502302261	t	$2b$10$veOCulWUCMcMP2DTmhSBPu67Yndqp.yZqfVQWjn5ZCzKlzhlUQtYS	MENTOR	2026-01-24 17:57:09.342
\.


--
-- Name: CourseCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."CourseCategory_id_seq"', 8, true);


--
-- Name: ExamResult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ExamResult_id_seq"', 13, true);


--
-- Name: Exam_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Exam_id_seq"', 13, true);


--
-- Name: HomeworkSubmission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."HomeworkSubmission_id_seq"', 4, true);


--
-- Name: Homework_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Homework_id_seq"', 5, true);


--
-- Name: LastActivity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LastActivity_id_seq"', 3, true);


--
-- Name: LessonFile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LessonFile_id_seq"', 5, true);


--
-- Name: MentorProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."MentorProfile_id_seq"', 4, true);


--
-- Name: QuestionAnswer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."QuestionAnswer_id_seq"', 3, true);


--
-- Name: Question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Question_id_seq"', 8, true);


--
-- Name: Rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Rating_id_seq"', 6, true);


--
-- Name: SectionLesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."SectionLesson_id_seq"', 24, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 12, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: invitation invitation_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT invitation_pkey PRIMARY KEY (id);


--
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.jwks
    ADD CONSTRAINT jwks_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization organization_slug_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.organization
    ADD CONSTRAINT organization_slug_key UNIQUE (slug);


--
-- Name: project_config project_config_endpoint_id_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_endpoint_id_key UNIQUE (endpoint_id);


--
-- Name: project_config project_config_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.project_config
    ADD CONSTRAINT project_config_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT session_token_key UNIQUE (token);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: AssignedCourse AssignedCourse_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssignedCourse"
    ADD CONSTRAINT "AssignedCourse_pkey" PRIMARY KEY ("userId", "courseId");


--
-- Name: CourseCategory CourseCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CourseCategory"
    ADD CONSTRAINT "CourseCategory_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: ExamResult ExamResult_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_pkey" PRIMARY KEY (id);


--
-- Name: Exam Exam_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_pkey" PRIMARY KEY (id);


--
-- Name: HomeworkSubmission HomeworkSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HomeworkSubmission"
    ADD CONSTRAINT "HomeworkSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Homework Homework_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Homework"
    ADD CONSTRAINT "Homework_pkey" PRIMARY KEY (id);


--
-- Name: LessonFile LessonFile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonFile"
    ADD CONSTRAINT "LessonFile_pkey" PRIMARY KEY (id);


--
-- Name: LessonView LessonView_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonView"
    ADD CONSTRAINT "LessonView_pkey" PRIMARY KEY ("lessonId", "userId");


--
-- Name: Lessons Lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_pkey" PRIMARY KEY (id);


--
-- Name: MentorProfile MentorProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorProfile"
    ADD CONSTRAINT "MentorProfile_pkey" PRIMARY KEY (id);


--
-- Name: PurchasedCourse PurchasedCourse_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchasedCourse"
    ADD CONSTRAINT "PurchasedCourse_pkey" PRIMARY KEY ("userId", "courseId");


--
-- Name: QuestionAnswer QuestionAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionAnswer"
    ADD CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: Rating Rating_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);


--
-- Name: SectionLesson SectionLesson_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SectionLesson"
    ADD CONSTRAINT "SectionLesson_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "account_userId_idx" ON neon_auth.account USING btree ("userId");


--
-- Name: invitation_email_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX invitation_email_idx ON neon_auth.invitation USING btree (email);


--
-- Name: invitation_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "invitation_organizationId_idx" ON neon_auth.invitation USING btree ("organizationId");


--
-- Name: member_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_organizationId_idx" ON neon_auth.member USING btree ("organizationId");


--
-- Name: member_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_userId_idx" ON neon_auth.member USING btree ("userId");


--
-- Name: organization_slug_uidx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE UNIQUE INDEX organization_slug_uidx ON neon_auth.organization USING btree (slug);


--
-- Name: session_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "session_userId_idx" ON neon_auth.session USING btree ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX verification_identifier_idx ON neon_auth.verification USING btree (identifier);


--
-- Name: Homework_lessonId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Homework_lessonId_key" ON public."Homework" USING btree ("lessonId");


--
-- Name: LastActivity_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LastActivity_userId_key" ON public."LastActivity" USING btree ("userId");


--
-- Name: MentorProfile_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "MentorProfile_userId_key" ON public."MentorProfile" USING btree ("userId");


--
-- Name: QuestionAnswer_questionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "QuestionAnswer_questionId_key" ON public."QuestionAnswer" USING btree ("questionId");


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: invitation invitation_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.invitation
    ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES neon_auth.organization(id) ON DELETE CASCADE;


--
-- Name: member member_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.member
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES neon_auth."user"(id) ON DELETE CASCADE;


--
-- Name: AssignedCourse AssignedCourse_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssignedCourse"
    ADD CONSTRAINT "AssignedCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssignedCourse AssignedCourse_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AssignedCourse"
    ADD CONSTRAINT "AssignedCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Course Course_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."CourseCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Course Course_mentorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamResult ExamResult_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."SectionLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamResult ExamResult_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ExamResult"
    ADD CONSTRAINT "ExamResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exam Exam_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."SectionLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HomeworkSubmission HomeworkSubmission_homeworkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HomeworkSubmission"
    ADD CONSTRAINT "HomeworkSubmission_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES public."Homework"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HomeworkSubmission HomeworkSubmission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HomeworkSubmission"
    ADD CONSTRAINT "HomeworkSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Homework Homework_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Homework"
    ADD CONSTRAINT "Homework_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LastActivity LastActivity_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LastActivity"
    ADD CONSTRAINT "LastActivity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LastActivity LastActivity_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LastActivity"
    ADD CONSTRAINT "LastActivity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LastActivity LastActivity_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LastActivity"
    ADD CONSTRAINT "LastActivity_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."SectionLesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LastActivity LastActivity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LastActivity"
    ADD CONSTRAINT "LastActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonFile LessonFile_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonFile"
    ADD CONSTRAINT "LessonFile_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonView LessonView_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonView"
    ADD CONSTRAINT "LessonView_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lessons"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonView LessonView_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LessonView"
    ADD CONSTRAINT "LessonView_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Lessons Lessons_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lessons"
    ADD CONSTRAINT "Lessons_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."SectionLesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MentorProfile MentorProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MentorProfile"
    ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchasedCourse PurchasedCourse_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchasedCourse"
    ADD CONSTRAINT "PurchasedCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchasedCourse PurchasedCourse_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PurchasedCourse"
    ADD CONSTRAINT "PurchasedCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionAnswer QuestionAnswer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionAnswer"
    ADD CONSTRAINT "QuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionAnswer QuestionAnswer_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestionAnswer"
    ADD CONSTRAINT "QuestionAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SectionLesson SectionLesson_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SectionLesson"
    ADD CONSTRAINT "SectionLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict p9hDOtdUy2kxA6GODtSyoeR6LMWVupw3p6BjkewrC6ZM3dkbWoIQpTtMljIurOU

