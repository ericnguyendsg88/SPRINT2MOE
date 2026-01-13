CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: account_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.account_status AS ENUM (
    'active',
    'inactive',
    'closed',
    'pending'
);


--
-- Name: billing_cycle; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.billing_cycle AS ENUM (
    'monthly',
    'quarterly',
    'biannually',
    'yearly'
);


--
-- Name: charge_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.charge_status AS ENUM (
    'outstanding',
    'overdue',
    'clear',
    'partially_paid'
);


--
-- Name: continuing_learning_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.continuing_learning_status AS ENUM (
    'active',
    'inactive',
    'completed'
);


--
-- Name: course_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.course_status AS ENUM (
    'active',
    'inactive'
);


--
-- Name: education_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.education_level AS ENUM (
    'primary',
    'secondary',
    'post_secondary',
    'tertiary',
    'postgraduate'
);


--
-- Name: enrollment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enrollment_status AS ENUM (
    'active',
    'completed',
    'withdrawn'
);


--
-- Name: in_school_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.in_school_status AS ENUM (
    'in_school',
    'not_in_school'
);


--
-- Name: rule_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rule_status AS ENUM (
    'active',
    'inactive'
);


--
-- Name: top_up_schedule_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.top_up_schedule_status AS ENUM (
    'scheduled',
    'processing',
    'completed',
    'failed'
);


--
-- Name: top_up_schedule_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.top_up_schedule_type AS ENUM (
    'batch',
    'individual'
);


--
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.transaction_status AS ENUM (
    'completed',
    'pending',
    'failed'
);


--
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.transaction_type AS ENUM (
    'top_up',
    'course_fee',
    'payment',
    'refund'
);


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: account_holders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_holders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nric text NOT NULL,
    name text NOT NULL,
    date_of_birth date NOT NULL,
    email text NOT NULL,
    phone text,
    residential_address text,
    mailing_address text,
    balance numeric(10,2) DEFAULT 0 NOT NULL,
    status public.account_status DEFAULT 'active'::public.account_status NOT NULL,
    in_school public.in_school_status DEFAULT 'in_school'::public.in_school_status NOT NULL,
    education_level public.education_level,
    continuing_learning public.continuing_learning_status,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    closed_at timestamp with time zone
);


--
-- Name: course_charges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_charges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    course_id uuid NOT NULL,
    course_name text NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    status public.charge_status DEFAULT 'outstanding'::public.charge_status NOT NULL,
    paid_date date,
    payment_method text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    amount_paid numeric DEFAULT 0 NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    provider text NOT NULL,
    billing_cycle public.billing_cycle DEFAULT 'monthly'::public.billing_cycle NOT NULL,
    fee numeric(10,2) NOT NULL,
    description text,
    status public.course_status DEFAULT 'active'::public.course_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    mode_of_training text DEFAULT 'online'::text,
    register_by date,
    course_run_start date,
    course_run_end date,
    intake_size integer DEFAULT 0,
    main_location text
);


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrollment_date date DEFAULT CURRENT_DATE NOT NULL,
    status public.enrollment_status DEFAULT 'active'::public.enrollment_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: page_layouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_layouts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_id text NOT NULL,
    session_id text NOT NULL,
    layout jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: top_up_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.top_up_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    min_age integer,
    max_age integer,
    min_balance numeric(10,2),
    max_balance numeric(10,2),
    in_school public.in_school_status,
    education_level public.education_level,
    continuing_learning public.continuing_learning_status,
    amount numeric(10,2) NOT NULL,
    status public.rule_status DEFAULT 'active'::public.rule_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    valid_from date,
    valid_to date
);


--
-- Name: top_up_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.top_up_schedules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public.top_up_schedule_type NOT NULL,
    scheduled_date date NOT NULL,
    scheduled_time time without time zone,
    executed_date timestamp with time zone,
    status public.top_up_schedule_status DEFAULT 'scheduled'::public.top_up_schedule_status NOT NULL,
    amount numeric(10,2) NOT NULL,
    rule_id uuid,
    rule_name text,
    eligible_count integer,
    processed_count integer,
    account_id uuid,
    account_name text,
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    type public.transaction_type NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    status public.transaction_status DEFAULT 'completed'::public.transaction_status NOT NULL,
    reference text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: account_holders account_holders_nric_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_holders
    ADD CONSTRAINT account_holders_nric_key UNIQUE (nric);


--
-- Name: account_holders account_holders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_holders
    ADD CONSTRAINT account_holders_pkey PRIMARY KEY (id);


--
-- Name: course_charges course_charges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_charges
    ADD CONSTRAINT course_charges_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_account_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_account_id_course_id_key UNIQUE (account_id, course_id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: page_layouts page_layouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_layouts
    ADD CONSTRAINT page_layouts_pkey PRIMARY KEY (id);


--
-- Name: top_up_rules top_up_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_up_rules
    ADD CONSTRAINT top_up_rules_pkey PRIMARY KEY (id);


--
-- Name: top_up_schedules top_up_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_up_schedules
    ADD CONSTRAINT top_up_schedules_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: page_layouts_page_session_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX page_layouts_page_session_idx ON public.page_layouts USING btree (page_id, session_id);


--
-- Name: account_holders update_account_holders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_account_holders_updated_at BEFORE UPDATE ON public.account_holders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_charges update_course_charges_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_course_charges_updated_at BEFORE UPDATE ON public.course_charges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses update_courses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: enrollments update_enrollments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: page_layouts update_page_layouts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_page_layouts_updated_at BEFORE UPDATE ON public.page_layouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: top_up_rules update_top_up_rules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_top_up_rules_updated_at BEFORE UPDATE ON public.top_up_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: top_up_schedules update_top_up_schedules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_top_up_schedules_updated_at BEFORE UPDATE ON public.top_up_schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_charges course_charges_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_charges
    ADD CONSTRAINT course_charges_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account_holders(id) ON DELETE CASCADE;


--
-- Name: course_charges course_charges_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_charges
    ADD CONSTRAINT course_charges_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account_holders(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: top_up_schedules top_up_schedules_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_up_schedules
    ADD CONSTRAINT top_up_schedules_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account_holders(id) ON DELETE SET NULL;


--
-- Name: top_up_schedules top_up_schedules_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_up_schedules
    ADD CONSTRAINT top_up_schedules_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.top_up_rules(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account_holders(id) ON DELETE CASCADE;


--
-- Name: account_holders Allow public delete to account_holders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to account_holders" ON public.account_holders FOR DELETE USING (true);


--
-- Name: course_charges Allow public delete to course_charges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to course_charges" ON public.course_charges FOR DELETE USING (true);


--
-- Name: courses Allow public delete to courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to courses" ON public.courses FOR DELETE USING (true);


--
-- Name: enrollments Allow public delete to enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to enrollments" ON public.enrollments FOR DELETE USING (true);


--
-- Name: page_layouts Allow public delete to page_layouts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to page_layouts" ON public.page_layouts FOR DELETE USING (true);


--
-- Name: top_up_rules Allow public delete to top_up_rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to top_up_rules" ON public.top_up_rules FOR DELETE USING (true);


--
-- Name: top_up_schedules Allow public delete to top_up_schedules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to top_up_schedules" ON public.top_up_schedules FOR DELETE USING (true);


--
-- Name: transactions Allow public delete to transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public delete to transactions" ON public.transactions FOR DELETE USING (true);


--
-- Name: account_holders Allow public insert to account_holders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to account_holders" ON public.account_holders FOR INSERT WITH CHECK (true);


--
-- Name: course_charges Allow public insert to course_charges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to course_charges" ON public.course_charges FOR INSERT WITH CHECK (true);


--
-- Name: courses Allow public insert to courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to courses" ON public.courses FOR INSERT WITH CHECK (true);


--
-- Name: enrollments Allow public insert to enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to enrollments" ON public.enrollments FOR INSERT WITH CHECK (true);


--
-- Name: page_layouts Allow public insert to page_layouts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to page_layouts" ON public.page_layouts FOR INSERT WITH CHECK (true);


--
-- Name: top_up_rules Allow public insert to top_up_rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to top_up_rules" ON public.top_up_rules FOR INSERT WITH CHECK (true);


--
-- Name: top_up_schedules Allow public insert to top_up_schedules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to top_up_schedules" ON public.top_up_schedules FOR INSERT WITH CHECK (true);


--
-- Name: transactions Allow public insert to transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert to transactions" ON public.transactions FOR INSERT WITH CHECK (true);


--
-- Name: account_holders Allow public read access to account_holders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to account_holders" ON public.account_holders FOR SELECT USING (true);


--
-- Name: course_charges Allow public read access to course_charges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to course_charges" ON public.course_charges FOR SELECT USING (true);


--
-- Name: courses Allow public read access to courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);


--
-- Name: enrollments Allow public read access to enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to enrollments" ON public.enrollments FOR SELECT USING (true);


--
-- Name: page_layouts Allow public read access to page_layouts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to page_layouts" ON public.page_layouts FOR SELECT USING (true);


--
-- Name: top_up_rules Allow public read access to top_up_rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to top_up_rules" ON public.top_up_rules FOR SELECT USING (true);


--
-- Name: top_up_schedules Allow public read access to top_up_schedules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to top_up_schedules" ON public.top_up_schedules FOR SELECT USING (true);


--
-- Name: transactions Allow public read access to transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access to transactions" ON public.transactions FOR SELECT USING (true);


--
-- Name: account_holders Allow public update to account_holders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to account_holders" ON public.account_holders FOR UPDATE USING (true);


--
-- Name: course_charges Allow public update to course_charges; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to course_charges" ON public.course_charges FOR UPDATE USING (true);


--
-- Name: courses Allow public update to courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to courses" ON public.courses FOR UPDATE USING (true);


--
-- Name: enrollments Allow public update to enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to enrollments" ON public.enrollments FOR UPDATE USING (true);


--
-- Name: page_layouts Allow public update to page_layouts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to page_layouts" ON public.page_layouts FOR UPDATE USING (true);


--
-- Name: top_up_rules Allow public update to top_up_rules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to top_up_rules" ON public.top_up_rules FOR UPDATE USING (true);


--
-- Name: top_up_schedules Allow public update to top_up_schedules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to top_up_schedules" ON public.top_up_schedules FOR UPDATE USING (true);


--
-- Name: transactions Allow public update to transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public update to transactions" ON public.transactions FOR UPDATE USING (true);


--
-- Name: account_holders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.account_holders ENABLE ROW LEVEL SECURITY;

--
-- Name: course_charges; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_charges ENABLE ROW LEVEL SECURITY;

--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: enrollments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: page_layouts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_layouts ENABLE ROW LEVEL SECURITY;

--
-- Name: top_up_rules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.top_up_rules ENABLE ROW LEVEL SECURITY;

--
-- Name: top_up_schedules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.top_up_schedules ENABLE ROW LEVEL SECURITY;

--
-- Name: transactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;