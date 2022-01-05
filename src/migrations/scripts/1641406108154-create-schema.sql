-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.3-beta1
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---
-- object: admin_atividade | type: ROLE --
-- DROP ROLE IF EXISTS admin_atividade;
-- CREATE ROLE admin_atividade WITH;
	-- UNENCRYPTED PASSWORD 'lush@2021!';
-- ddl-end --


-- Database creation must be performed outside a multi lined SQL file.
-- These commands were put in this file only as a convenience.
--
-- object: "postgres" | type: DATABASE --
-- DROP DATABASE IF EXISTS "postgres";
-- CREATE DATABASE "postgres";
-- ddl-end --


-- object: public.users | type: TABLE --
-- DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
	id uuid NOT NULL,
	alternative_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	name varchar(200) NOT NULL,
	email varchar(200) NOT NULL,
	password varchar,
	created_date timestamp with time zone NOT NULL,
	updated_date timestamp with time zone,
	deleted_date timestamp with time zone,
	CONSTRAINT pk__users PRIMARY KEY (id)
);

-- ddl-end --
ALTER TABLE public.users OWNER TO admin_atividade;
-- ddl-end --

-- object: public.products | type: TABLE --
-- DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
	id uuid NOT NULL,
	alternative_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ,
	user_id uuid NOT NULL,
	name varchar(200) NOT NULL,
	price decimal(9,2) NOT NULL,
	created_date timestamp with time zone NOT NULL,
	updated_date timestamp with time zone,
	deleted_date timestamp with time zone,
	CONSTRAINT pk__products PRIMARY KEY (id)

);

-- ddl-end --
ALTER TABLE public.products OWNER TO admin_atividade;
-- ddl-end --