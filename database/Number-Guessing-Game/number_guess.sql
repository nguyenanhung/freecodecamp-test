--
-- PostgreSQL database dump
--

-- Dumped from database version 12.17 (Ubuntu 12.17-1.pgdg22.04+1)
-- Dumped by pg_dump version 12.17 (Ubuntu 12.17-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE number_guess;
--
-- Name: number_guess; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE number_guess WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE number_guess OWNER TO freecodecamp;

\connect number_guess

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: games; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.games (
                              username character varying(22),
                              games_played integer DEFAULT 0,
                              best_game integer
);


ALTER TABLE public.games OWNER TO freecodecamp;

--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.games VALUES ('hung', 0, NULL);
INSERT INTO public.games VALUES ('user_1743949254914', 2, 821);
INSERT INTO public.games VALUES ('user_1743949546372', 2, 123);
INSERT INTO public.games VALUES ('user_1743949254915', 5, 53);
INSERT INTO public.games VALUES ('user_1743949546373', 5, 313);
INSERT INTO public.games VALUES ('user_1743949334882', 2, 8);
INSERT INTO public.games VALUES ('user_1743949583576', 2, 30);
INSERT INTO public.games VALUES ('user_1743949334883', 5, 67);
INSERT INTO public.games VALUES ('user_1743949583577', 5, 49);
INSERT INTO public.games VALUES ('user_1743949346013', 2, 127);
INSERT INTO public.games VALUES ('user_1743949624995', 2, 319);
INSERT INTO public.games VALUES ('user_1743949624996', 5, 219);
INSERT INTO public.games VALUES ('user_1743949346014', 5, 47);
INSERT INTO public.games VALUES ('hungna', 0, NULL);
INSERT INTO public.games VALUES ('hungng', 1, 1);
INSERT INTO public.games VALUES ('user_1743949433510', 2, 547);
INSERT INTO public.games VALUES ('user_1743949778235', 2, 915);
INSERT INTO public.games VALUES ('user_1743949433511', 5, 211);
INSERT INTO public.games VALUES ('user_1743949778236', 5, 247);
INSERT INTO public.games VALUES ('user_1743949498032', 2, 257);
INSERT INTO public.games VALUES ('user_1743949498033', 5, 27);


--
-- PostgreSQL database dump complete
--

