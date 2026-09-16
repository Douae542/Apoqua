--
-- PostgreSQL database dump
--

-- \restrict Wk1PXA3SAWUVuYsVZxAqcmjZcpaNJBnabxxEjIWdPD254T7dBfGq6hLOuvOE5vd

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-05-20 12:23:18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 851 (class 1247 OID 16389)
-- Name: roleenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roleenum AS ENUM (
    'super_admin',
    'admin',
    'ingenieur',
    'concepteur',
    'operateur'
);


ALTER TYPE public.roleenum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16429)
-- Name: demandes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demandes (
    id integer NOT NULL,
    reference character varying(100) NOT NULL,
    type_demande character varying(100),
    statut character varying(100),
    description character varying(1000),
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone
);


ALTER TABLE public.demandes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16428)
-- Name: demandes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demandes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demandes_id_seq OWNER TO postgres;

--
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 221
-- Name: demandes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demandes_id_seq OWNED BY public.demandes.id;


--
-- TOC entry 220 (class 1259 OID 16412)
-- Name: fiches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiches (
    id integer NOT NULL,
    reference character varying(100) NOT NULL,
    designation_fr character varying(500),
    designation_en character varying(500),
    vehicle_area character varying(200),
    psa_dec character varying(100),
    lot character varying(50),
    status character varying(100),
    in_poro character varying(10),
    in_pfr character varying(10),
    creation_date character varying(50),
    last_modification character varying(50),
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone
);


ALTER TABLE public.fiches OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: fiches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fiches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fiches_id_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 219
-- Name: fiches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fiches_id_seq OWNED BY public.fiches.id;


--
-- TOC entry 218 (class 1259 OID 16400)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    role public.roleenum,
    site character varying(100),
    is_active boolean,
    created_at timestamp without time zone DEFAULT now(),
    login character varying(100),
    telephone character varying(50),
    service character varying(200),
    site_geo character varying(200),
    company character varying(200),
    langue character varying(50),
    organisation character varying(200),
    profil_complete boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16399)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4760 (class 2604 OID 16432)
-- Name: demandes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes ALTER COLUMN id SET DEFAULT nextval('public.demandes_id_seq'::regclass);


--
-- TOC entry 4758 (class 2604 OID 16415)
-- Name: fiches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiches ALTER COLUMN id SET DEFAULT nextval('public.fiches_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16403)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4925 (class 0 OID 16429)
-- Dependencies: 222
-- Data for Name: demandes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.demandes VALUES (1, '012XXXX-XXXX-56', 'creation', 'En attente', 'Demande de création de la fiche 012XXXX-XXXX-56 — COUPELLE INF RESSORT SUSPENSION AR', 1, '2026-04-28 09:06:38.280762', NULL);
INSERT INTO public.demandes VALUES (2, '012XXXX-XXXX-56', 'creation', 'En attente', 'Demande de création de la fiche 012XXXX-XXXX-56 — COUPELLE INF RESSORT SUSPENSION AR', 1, '2026-05-11 21:18:39.343462', NULL);
INSERT INTO public.demandes VALUES (3, '01266_09_00156', 'modification', 'En attente', 'Mise à jour fiche 01266_09_00156 — Nouveau statut: Approved', 1, '2026-05-12 10:49:11.196052', NULL);


--
-- TOC entry 4923 (class 0 OID 16412)
-- Dependencies: 220
-- Data for Name: fiches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fiches VALUES (2566, '01266_09_00147', 'PARE CHOC AV - ARMATURE', 'FRT BUMPER - LOWER FRAME', 'Front Face and Hood', 'R1A', 'EXT', 'Applicable', 'YES', 'NO', '2009-06-23 00:00:00', '2023-09-04 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2567, '01266_09_00155', 'DECORS ENJOLIVEURS PDB', 'DASHBOARD TRIM EMBELLISHMENTS', 'Dashboard and console', 'S1A', 'PDC', 'To be updated', 'YES', 'NO', '2009-06-25 00:00:00', '2017-10-03 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2569, '01266_09_00299', 'TRAVERSE SUP FAÇADE BLOC AVANT', 'FRT BUMPER - LOWER FRAME (RADIATOR SCREEN SUPPORT)', 'Front Face and Hood', 'R1A', 'EXT', 'To be updated', 'YES', 'NO', '2009-08-26 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2570, '01266_10_00199', 'BOITIER-SECU-DML', 'nan', 'Harness and ECUs', '', '-', 'To be updated', 'YES', 'NO', '2010-02-03 00:00:00', '2017-06-07 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2571, '01266_10_00632', 'PLANCHE DE BORD SUR CAISSE', 'DASHBOARD ON BODY', 'Dashboard and console', 'S1A', 'PDC', 'Approved', 'YES', 'YES', '2010-04-26 00:00:00', '2023-10-19 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2572, '01266_10_00634', 'PARE CHOC AR - PEAU', 'RR BUMPER - SKIN', 'Rear Face and Tailgate', 'R1A', 'EXT', 'Applicable', 'YES', 'NO', '2010-04-26 00:00:00', '2024-11-04 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2573, '01266_10_00635', 'PARE CHOC AV - SUPPORT SUPERIEUR', 'FRONT BUMPER UPP SUPPORT', 'Front Face and Hood', 'R1A', 'EXT', 'Cancelled', 'YES', 'NO', '2010-04-27 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2574, '01266_10_00636', 'MFRH - MATRICE FUSIBLE RELAIS HABITACLE ', 'MFRH - CABIN RELAY FUSIBLE UNIT ', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2010-04-27 00:00:00', '2017-02-13 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2575, '01266_10_00637', 'BOITIER SECURISATION ANTIVOL ELECTRIQUE SECU-AVE', 'ELECTRIC ANTI-THEFT SAFETY-AVE SECU-AVE', 'Harness and ECUs', 'Z8G', 'EEH', 'Cancelled', 'YES', 'NO', '2010-04-27 00:00:00', '2017-07-24 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2576, '01266_10_00642', 'GARNITURE DE SUPPORT TABLETTE AR', 'RR PARCEL SHELF SUPPORT TRIM', 'Interior Trims', 'X3D', 'INT', 'Approved', 'YES', 'NO', '2010-04-27 00:00:00', '2025-01-29 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2577, '01266_10_00643', 'SIEGES RANG1', 'SEATS RANK 1', 'Seats and safety belts', 'Y1A', 'ASS', 'Approved', 'YES', 'YES', '2010-04-27 00:00:00', '2024-12-17 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2578, '01266_10_00644', 'SIEGE INDIVIDUEL RANG 2', 'INDIVIDUAL_SEAT_RANK_2', 'Seats and safety belts', 'Y2A', 'ASS', 'Approved', 'YES', 'NO', '2010-04-27 00:00:00', '2024-03-28 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2579, '01266_10_00645', 'RAIL SUPPORT SIEGE CENTRALE (SIEGES RANG 3)', 'SEAT SUPPORT RAIL CENTAL (SEATS ROW 3)', 'Seats and safety belts', 'Y3A', 'ASS', 'To be updated', 'YES', 'NO', '2010-04-27 00:00:00', '2021-05-19 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2580, '01266_10_00732', 'BPGA - BOITIER DE LA PROTECTION DE LA GESTION DES ALIMENTATION', 'BPGA - SUPPLY MANAGEMENT PROTECTION UNIT', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2010-05-06 00:00:00', '2011-01-18 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2581, '01266_10_00733', 'BOÎTIER ECLAIRAGE MEMORISATION (PORTE PASSAGER) (BEM)', 'nan', 'Harness and ECUs', 'nan', '-', 'Cancelled', 'YES', 'NO', '2010-05-06 00:00:00', '2010-05-06 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2582, '01266_10_00734', 'EQUILIBREUR DE CAPOT', 'HOOD STABILIZER', 'Front Face and Hood', 'N2A', 'EXT', 'Approved', 'YES', 'NO', '2010-05-06 00:00:00', '2024-05-20 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2583, '01266_10_00735', 'VOLET MOTORISE - MAF/MVM', 'MULTIFONCTION ASSISTANCE CLOSING MODULE', 'Rear Face and Tailgate', 'N2E', 'OUV', 'Cancelled', 'YES', 'NO', '2010-05-06 00:00:00', '08/03/2023', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2584, '01266_10_00736', 'SUPPORT MOTEUR INTERMEDIAIRE DROIT (SMID) ', 'RIGHT INTERMEDIATE ENGINE SUPPORT (SMID)', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2010-05-06 00:00:00', '2016-10-24 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2585, '01266_10_00737', 'BUTEE D''ATTAQUE TRAIN AR DEFORMABLE', 'DEFORMABLE REAR AXLE ATTACK STOP', 'Liaison au sol', 'E25', 'LAS', 'Cancelled', 'YES', 'NO', '2019-06-20 00:00:00', '2010-05-06 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2586, '01266_10_00742', 'FIXATION ECRANS AERAULIQUES SOUS-CAISSE (SI AUTOMATIQUE)', 'UNDER BODY AIR DEFLECTOR MOUNTINGS (IF AUTOMATIC)', '', 'nan', '-', 'Cancelled', 'YES', 'NO', '2010-05-06 00:00:00', '2013-07-02 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2587, '01266_10_00743', 'DMT - DISPOSITIF MAINTIEN EN TENTION - CENTRALISE', 'DMT - VOLTAGE MAINTENANCE DEVICE - CENTRALIZED', 'Harness and ECUs', 'Z1D', 'EEM', 'Cancelled', 'YES', 'NO', '2010-05-06 00:00:00', '2017-10-01 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2588, '01266_10_00744', 'CAPTEUR HAUTEUR AV', 'FRT HEIGHT SENSOR', 'Liaison au sol', 'G76', 'HYD', 'Applicable', 'YES', 'YES', '2010-05-06 00:00:00', '2023-10-27 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2589, '01266_10_00745', 'ENJOLIVEUR DE CUSTODE', 'QUARTER PANEL TRIM*', 'Lateral Face and Doors', 'R3B', 'OUV', 'Approved', 'YES', 'NO', '2010-05-06 00:00:00', '2024-10-03 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2590, '01266_10_01125', 'GROUPE CLIMATISATION SUR PLANCHE DE BORD ', 'DASHBOARD ON AC UNIT', 'Dashboard and console', 'S1A', 'PDC', 'To be updated', 'YES', 'NO', '2010-07-06 00:00:00', '2018-03-29 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2591, '01266_10_01499', 'RESERVOIR SCR €6 -  REDUCTION CATALYTIQUE SELECTIVE', 'CATALYTIC NITROGEN OXIDE REDUCTION', 'Engine and Gearbox Adaptation', 'B25', 'AMO', 'Cancelled', 'YES', 'NO', '2010-10-04 00:00:00', '2017-10-18 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2592, '01266_10_01548', 'CROCHET SECURITE CAPOT', 'HOOK SAFETY HOOD', 'Front Face and Hood', 'N2A', 'EXT', 'Approved', 'YES', 'YES', '2010-10-13 00:00:00', '2024-05-20 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2593, '01266_10_01610', 'MODULE ENTREE D''AIR PILOTEE', 'PILOT AIR INPUT MODULE', 'Front Face and Hood', 'R1A', 'EXT', 'To be updated', 'YES', 'NO', '2010-10-25 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2594, '01266_10_01772', 'CLOISONS ANTI RECYCLAGE', 'PANEL RADIATOR SHROUD', 'Front Face and Hood', 'K3H', 'STR', 'Cancelled', 'YES', 'NO', '2010-11-17 00:00:00', '2024-04-08 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2595, '01266_10_01773', 'ECRAN ACOUSTIQUE', 'SOUND SCREEN', '', 'K2E', 'STR', 'To be updated', 'YES', 'NO', '2010-11-17 00:00:00', '2011-07-06 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2596, '01266_10_01789', 'BSG BOITIER SERVITUDE GENERIQUE (BSG-RQ / BSG-TC / BSGS / BSR)', 'BSG - GENERIC RELAY UNIT', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2010-11-19 00:00:00', '2017-03-22 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2597, '01266_11_00202', 'PARE BOUE AV', 'FRONT MUDGUARD', 'Under Body', 'K3J', 'STR', 'Approved', 'YES', 'NO', '2011-02-01 00:00:00', '2024-05-30 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2598, '01266_11_00203', 'PARE BOUE AR', 'REAR MUDGUARD', 'Under Body', 'K4H', 'STR', 'Applicable', 'YES', 'NO', '2011-02-01 00:00:00', '12/04/2023', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2599, '01266_11_00285', 'ELEMENT PORTEUR ASSEMBLAGE', 'FRONT SHOCK ABSORBER ELEMENTS', 'Liaison au sol', 'E14', 'LAS', 'Approved', 'YES', 'YES', '2011-02-10 00:00:00', '2023-10-27 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2600, '01266_11_00381', 'GARNITURE INF DE PIED AV', 'FRONT PILLAR LOWER TRIM', 'Interior Trims', 'X3A', 'INT', 'Current update', 'YES', 'NO', '2011-02-24 00:00:00', '2025-01-29 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2601, '01266_11_00413', 'CHARNIERE PORTES AV ET AR - FERRAGE', 'FRONT AND REAR DOOR HINGES - BIW', 'Lateral Face and Doors', 'K7F/K7G', 'OUV', 'Applicable', 'YES', 'YES', '2011-03-02 00:00:00', '2024-02-26 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2602, '01266_11_01492', 'GRILLE AUVENT', 'COWL VENT GRILLE', 'Front Face and Hood', 'R3H', 'STR', 'Approved', 'YES', 'NO', '2011-07-08 00:00:00', '2025-01-29 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2603, '01266_11_01943', 'AIRBAG PORTE AR', 'REAR DOOR AIRBAG', 'Lateral Face and Doors', 'U3B', 'ASS', 'To be updated', 'YES', 'NO', '2011-09-23 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2833, 'DITV_ATAT07_0024', 'BLOC ALARME SUR CAISSE', 'HORN ALARM UNIT ON BODY', 'Harness and ECUs', 'Z8C', 'EEH', 'Approved', 'NO', 'NO', '2008-06-09 00:00:00', '2021-05-29 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2604, '01266_11_02100', 'FAISCEAU PRINCIPAL COMPLEMENTAIRE SOUS CAISSE', 'COMPLEMENTARY MAIN HARNESS UNDER BODY', 'Harness and ECUs', 'Z9L', 'AEE', 'To be updated', 'YES', 'NO', '2011-10-18 00:00:00', '2012-03-06 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2605, '01266_11_02185', 'SAC AV INF - SYSTEME D''ABSORPTION DES CHOCS AVANT INFERIEUR', 'LOWER FRONT IMPACT ABSORPTION SYSTEM', 'Front Face and Hood', 'R1A', 'EXT', 'Approved', 'YES', 'NO', '2011-11-03 00:00:00', '2025-01-29 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2606, '01266_12_00151', 'EVACUATION EAU AUVENT ', 'COWL WATER OUTLET', 'Front Face and Hood', 'V1C', 'STR', 'To be updated', 'YES', 'NO', '2012-02-03 00:00:00', '2012-03-26 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2607, '01266_12_00209', 'FINITIONS LATERALES DE GRILLE D’AUVENT ', 'COWL VENT SIDEFINISHINGS', 'Front Face and Hood', 'V1A', 'STR', 'Approved', 'YES', 'NO', '2012-02-14 00:00:00', '2024-01-30 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2608, '01266_12_00210', 'MOUSSE ETANCHEITE LATERALE', 'SIDE TIGHTNESS FOAM', '', 'W3B', 'OUV', 'Cancelled', 'YES', 'NO', '2012-02-14 00:00:00', '2012-03-26 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2609, '01266_12_00280', 'JOINTS DE PORTE AV AR', 'FRT RR DOOR SEAL', 'Lateral Face and Doors', 'W2A', 'OUV', 'Cancelled', 'YES', 'NO', '2012-03-05 00:00:00', '2014-06-19 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2610, '01266_12_00327', 'RADIATEUR SUR TRAVERSE INF ET SUP', 'RADIATOR ON LOWER + UPPER CROSSMEMBERS', 'Front Face and Hood', 'B12', 'AMO', 'To be updated', 'YES', 'NO', '2012-03-19 00:00:00', '2020-09-07 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2611, '01266_12_00386', 'TRAVERSE INF FAÇADE BLOC AVANT', 'FRONT END LOWER CROSSMEMEBER', 'Front Face and Hood', 'K3D', 'STR', 'To be updated', 'YES', 'NO', '2012-03-27 00:00:00', '2017-05-23 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2612, '01266_12_00407', 'CONDENSEUR EVAPORATEUR ', 'EVAPORATOR CONDENSOR', 'Engine and Gearbox Adaptation', 'V5B', 'AMO', 'Approved', 'YES', 'NO', '2012-04-02 00:00:00', '2019-10-31 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2613, '01266_12_00440', 'FIXATION GMV SUR RADIA', 'MOUNTING MOTOR FAN ON RADIATOR', '', 'B11', 'AMO', 'Cancelled', 'YES', 'NO', '2012-04-10 00:00:00', '2012-10-30 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2614, '01266_12_00448', 'SUPPORT ECHANGEUR AIR AIR', 'AIR AIR EXCHANGER SUPPORT', 'Engine and Gearbox Adaptation', 'A26', 'AMO', 'Applicable', 'YES', 'NO', '2012-04-10 00:00:00', '2021-09-01 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2615, '01266_12_00789', 'MODULE DEBRAYAGE', 'MODULATE DECLUTCHING', 'Liaison au sol', 'G11', 'ATR', 'To be updated', 'YES', 'NO', '2012-07-05 00:00:00', '2017-12-05 00:00:00', NULL, '2026-04-30 00:02:34.291412', NULL);
INSERT INTO public.fiches VALUES (2616, '01266_12_00871', 'RACCORD PRISE DEPRESSION FREIN (RPDF) -BRIDAGE SUR MOTEUR', 'FLANGING BVCC ON ENGINE', 'Liaison au sol', 'F62', 'FRN', 'To be updated', 'YES', 'NO', '2012-07-27 00:00:00', '2020-09-24 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2617, '01266_12_00993', 'TRAIN AR MULTI-BRAS', 'RR AXLE - MULTI-SPOKE', 'Liaison au sol', 'E20', 'LAS', 'To be updated', 'YES', 'NO', '2012-09-13 00:00:00', '2017-09-21 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2618, '01266_13_00135', 'CABLE FREIN A MAIN - BRIDAGE SUR TRAIN AR ', 'FLANGING HANDBRAKE CABLE ON RR TRAIN', 'Liaison au sol', 'F71', 'FRN', 'To be updated', 'YES', 'NO', '2013-02-06 00:00:00', '2020-09-10 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2619, '01266_13_00240', 'FACADE MULTIFONCTION MUX', 'MULTIFUNCTION FRONTAGE MUX', 'Engine and Gearbox', 'Z5T', 'EEH', 'To be updated', 'YES', 'NO', '2013-03-05 00:00:00', '2018-12-21 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2620, '01266_13_00289', 'ADAPTATEUR ANTENNE RADIO FM1 - FM2 - DAB', 'ADAPTOR RADIO AERIAL FM1 - FM2 - DAB', 'Harness and ECUs', 'Z7B', 'EEH', 'Approved', 'YES', 'YES', '2013-03-14 00:00:00', '2024-03-21 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2621, '01266_13_00325', 'FLEXIBLE FREIN AR - BRIDAGE SUR TRAIN AR', 'FLEXIBLE CLAMPING REAR BRAKE ON REAR AXLE', 'Liaison au sol', 'F63', 'FRN', 'To be updated', 'YES', 'NO', '2013-03-25 00:00:00', '2017-08-28 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2622, '01266_13_00326', 'CAPTEUR VITESSE ROUE AV', 'FRONT WHEEL SPEED SENSOR', 'Liaison au sol', 'F68', 'FRN', 'Approved', 'YES', 'NO', '2013-03-25 00:00:00', '2024-01-31 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2623, '01266_13_00552', 'AIRBAG PASSAGER', 'AIR BAG PASSENGER', 'Dashboard and console', 'U1B', 'PDC', 'To be updated', 'YES', 'NO', '2013-06-18 00:00:00', '2022-11-30 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2624, '01266_13_00605', 'CAPTEUR HAUTEUR CAISSE AR', 'REAR BODY HEIGHT SENSOR', 'Liaison au sol', 'G76', 'HYD', 'To be updated', 'YES', 'YES', '2013-06-25 00:00:00', '2013-07-02 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2625, '01266_13_00628', 'CANALISATION EMBRAYAGE HAUTE ET BASSE PRESSION', 'HIGH PIPE CLUTCH AND LOW PRESSURE', 'Engine and Gearbox Adaptation', 'G32', 'ATR', 'To be updated', 'YES', 'NO', '2013-07-02 00:00:00', '2020-09-02 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2626, '01266_13_00824', 'ARRET DE PORTE SUR CAISSE', 'DOOR STOP ON BODY', 'Lateral Face and Doors', 'K7F', 'OUV', 'Cancelled', 'YES', 'NO', '2013-08-23 00:00:00', '2022-06-23 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2627, '01266_13_00991', 'PROTECTEUR COURROIE', 'BELT PROTECTION', 'Engine and Gearbox', 'A18', 'ARM', 'To be updated', 'YES', 'NO', '2013-10-08 00:00:00', '2016-06-21 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2628, '01266_13_01124', 'GARNITURE CADRE PORTE – INTERIEUR', 'TRIMMING DOOR FRAME - INTERIOR', 'Lateral Face and Doors', 'X4C', 'INT', 'Approved', 'YES', 'NO', '2013-11-08 00:00:00', '2024-10-04 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2629, '01266_14_00963', 'CAPTEUR PRESSION FILTRE PARTICULE ', 'PRESSURE SENSOR PARTICLE FILTER', 'Harness and ECUs', 'A37', 'EEM', 'To be updated', 'YES', 'NO', '2014-10-02 00:00:00', '2021-05-19 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2630, '01266_14_01080', 'CAPTEURS DE DEPOLLUTION SUR SUPPORT', 'SENSOR DEPOLLUTION ON BRACKET', 'Engine and Gearbox Adaptation', 'B26', 'EEM', 'To be updated', 'YES', 'NO', '2014-10-28 00:00:00', '2020-09-07 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2631, '01266_14_01081', 'CAPTEURS DE DEPOLLUTION ASS SUR CAISSE', 'SENSORS DEPOLLUTION INTEGRATED ON BODY', 'Engine and Gearbox Adaptation', 'B26', 'EEM', 'To be updated', 'YES', 'NO', '2014-10-28 00:00:00', '2020-09-23 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2632, '01266_14_01085', 'SONDE NOX AMONT SUR MOTEUR', 'PROBES NOX UPSTREAM ON ENGINE', 'Engine and Gearbox Adaptation', 'B26', 'EEM', 'Cancelled', 'YES', 'NO', '2014-10-29 00:00:00', '2014-11-03 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2633, '01266_14_01086', 'SONDE SUR LIGNE D''ECHAPPEMENT', 'APOQUA EXHAUST LINE PROBES', 'Engine and Gearbox Adaptation', 'B26 & A27', 'EEM', 'Applicable', 'YES', 'NO', '2014-10-29 00:00:00', '2024-10-28 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2634, '01266_15_00670', 'COLONNE DIRECTION COMPLETE (PARTIE SUP)', 'STEERING COLUMN COMPLETE', 'Dashboard and console', 'E45', 'DIR', 'Approved', 'YES', 'YES', '2015-06-26 00:00:00', '2024-01-10 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2635, '01266_15_00738', 'RETROVISEUR EXTERIEUR', 'REAR VIEW MIRROR', 'Lateral Face and Doors', 'R5A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-04-12 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2636, '01266_15_00980', 'RECEPTEUR RADIO TELEMATIQUE', 'TELEMATICS RADIO RECEIVER', 'Dashboard and console', 'Z7A', 'EEH', 'To be updated', 'YES', 'NO', '2016-01-06 00:00:00', '2016-03-23 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2637, '01266_16_00102', 'PLAQUETTE REGLAGE FACE AV - FERRAGE', 'FRONT FACE ADJUSTMENT PLATE - BIW', 'Front Face and Hood', 'K3D', 'STR', 'To be updated', 'YES', 'NO', '2016-03-10 00:00:00', '2016-06-23 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2638, '01266_16_00110', 'FEUX AR SUR CAISSE', 'REAR TAIL LIGHTS', 'Rear Face and Tailgate', 'Z2F', 'EXT', 'Approved', 'YES', 'YES', '2016-02-04 00:00:00', '2024-03-22 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2639, '01266_16_00242', 'PULSEUR DEPORTE SUR TRAVERSE', 'PULSEUR ON CROSSMEMBER', 'Dashboard and console', 'V2A', 'PDC', 'To be updated', 'YES', 'NO', '2016-03-30 00:00:00', '2016-03-30 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2640, '01266_16_00351', 'VISION TETE HAUTE (VTH) SUR PLANCHE DE BORD', 'HIGHT VISION', 'Dashboard and console', 'Z4F', 'EEH', 'To be updated', 'YES', 'NO', '2018-10-29 00:00:00', '2018-10-29 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2641, '01266_16_00639', 'BRIDE BATTERIE 12V', 'CLAMP BATTERY 12V', 'Front Face and Hood', 'Z1B', 'AEE', 'To be updated', 'YES', 'NO', '2016-09-16 00:00:00', '2021-06-08 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2642, '01266_16_00647', 'DEFLECTEUR AIR CENTRAL AV', 'FRONT CENTRAL AIR DEFLECTOR ', 'Front Face and Hood', 'K2E', 'STR', 'To be updated', 'YES', 'NO', '2016-12-19 00:00:00', '2021-11-29 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2643, '01266_16_00706', 'CONVERTISSEUR SUR BOITE AUTOMATIQUE', 'CONVERTER ON FLEXPLATE - AUTOMATIC GEARBOX', 'Engine and Gearbox Adaptation', 'C12', 'ABA', 'To be updated', 'YES', 'NO', '2016-10-24 00:00:00', '2016-10-24 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2644, '01266_16_00711', 'ARTIV/ACC - AIDE AU RESPECT DU TEMPS INTER VEHICULAIRE', 'ARTIV/ACC ADAPTATIVE CRUISE CONTROL', 'Harness and ECUs', 'Z4F', 'EEH', 'To be updated', 'YES', 'NO', '2016-06-21 00:00:00', '2016-06-21 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2645, '01266_16_00712', 'ENJOLIVEUR COI', 'COI TRIM', 'Lateral Face and Doors', 'X4A', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-03-29 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2646, '01266_16_00801', 'SUPPORT POIGNEE DE TIRAGE', 'GRAB HANDLE SUPPORT', 'Lateral Face and Doors', 'X4A', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-03-24 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2647, '01266_16_00840', 'BENITIER', 'HINGE', 'Lateral Face and Doors', 'X4A', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-02-07 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2648, '01266_16_01515', 'BFDB BFT BOITIER FUSIBLE ', 'BFT FUSE UNIT TERMINAL', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2017-03-16 00:00:00', '2017-03-16 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2649, '01266_16_01594', 'LIAISON ENTRE BFT ET BFRM', 'LINK BETWEEN BFT AND BFRM', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-05-11 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2650, '01266_17_00136', 'SUPPORT MATRICE FUSIBLE RELAIS HABITACLE (MFRH) ', 'SUPPORT CABIN RELAY FUSIBLE UNIT (MFRH)', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2017-03-03 00:00:00', '2017-03-03 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2651, '01266_17_00404', 'PARE CHOC AV INF', 'FRONT BUMPER LOWER MOUNTING', 'Front Face and Hood', 'R1A', 'EXT', 'To be updated', 'YES', 'NO', '2017-11-22 00:00:00', '2017-11-22 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2652, '01266_17_00608', 'REPOSE PIED', 'FOOTREST', 'Interior Trims', 'T2D', 'INT', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2653, '01266_17_00696', 'CAPTEUR PRESSION PORTE', 'DOOR PRESSURE SENSOR', 'Lateral Face and Doors', 'U4A', 'EEH', 'To be updated', 'YES', 'NO', '2014-10-02 00:00:00', '2023-09-13 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2654, '01266_17_01054', 'TUYAU DE REMPLISSAGE LAVE VITRE', 'WINDSHIELD WASHER FEED PIPE', 'Front Face and Hood', 'Z6B', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-22 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2655, '01266_17_01156', 'BOITIER SUPERVISION RADIO FREQUENCE BSRF ', 'RADIO FREQUENCY SUPERVISION BOX RFSB', 'Harness and ECUs', 'Z7G', 'EEH', 'Approved', 'YES', 'NO', '2019-08-28 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2656, '01266_17_01167', 'COE - FLUSH', 'EXTERNAL DOOR OPENING CONTROL FLUSH ON SUPPORT', 'Lateral Face and Doors', 'N1C', 'OUV', 'To be updated', 'NO', 'NO', '2018-04-16 00:00:00', '2018-04-16 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2657, '01266_17_01389', 'SUPPORT FLEXIBLE DE FREIN AV SUR PASSAGE DE ROUE AV', 'FLEXIBLE FR BRAKE SUPPORT ON FR WHEEL HOUSING', 'Liaison au sol', 'F63', 'FRN', 'To be updated', 'YES', 'NO', '2017-12-21 00:00:00', '2023-04-27 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2658, '01266_18_00258', 'CAPTEUR DETECTION CHOC MOYEN RETENUE', 'AIRBAG IMPACT SENSOR', 'Front Face and Hood', 'U4A', 'EEH', 'Applicable', 'NO', 'NO', '2018-03-14 00:00:00', '2024-10-22 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2659, '01266_18_00836', 'SMIG SUR BOITE (BV)', 'LEFT INTERMEDIATE ENGINE MOUNT (LIEM) ON GEAR BOX', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2019-03-07 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2660, '01266_18_00903', 'ROUES PRINCIPALES TÔLE', 'MAIN WHEELS STEEL', 'Liaison au sol', 'E31', 'LAS', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-04 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2661, '01266_18_00948', 'SUPPORT POMPE VIDE FREINAGE', 'BRAKE VACUUM PUMP SUPPORT', 'Front Face and Hood', 'F66', 'nan', 'Applicable', 'YES', 'NO', '2022-05-23 00:00:00', '12/04/2023', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2662, '01266_18_01133', 'ACCOUDOIR SUR CONSOLE', 'ARMREST FIXATION ON CONSOLE', 'Dashboard and console', 'S3A', 'PDC', 'To be updated', 'YES', 'NO', '2019-02-04 00:00:00', '2019-02-04 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2663, '01266_18_01134', 'CONSOLE SUR SUPPORT ARRIERE ', ' FIXATION CONSOLE ON BRACKET', 'Dashboard and console', 'S3A', 'PDC', 'To be updated', 'YES', 'NO', '2019-02-04 00:00:00', '2019-02-04 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2664, '01266_18_01135', 'CACHE CLIMATISUER SUR CAISSE (TUNNEL)', ' HEATER COVER FASTENING ON BODY (TUNNEL)', 'Dashboard and console', 'S3A', 'PDC', 'To be updated', 'YES', 'NO', '2019-02-04 00:00:00', '2019-02-04 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2665, '01266_18_01160', 'RACCORDS ENTREE AIR SUR TURBO ', 'AIR INLET CONNECTIONS ON TURBO', 'Engine and Gearbox', 'A26', 'AMO', 'To be updated', 'YES', 'NO', '2019-01-27 00:00:00', '2019-11-22 00:00:00', NULL, '2026-04-30 00:02:34.351395', NULL);
INSERT INTO public.fiches VALUES (2666, '01266_18_01165', 'PARTIE DOSSIER CENTRALE (SIEGE RANG 2)', 'CENTRAL PIVOTING BACK SEAT ( SEATS ROW 2)', 'Seats and safety belts', 'Y2A', 'ASS', 'Current Update', 'YES', 'NO', '2018-12-12 00:00:00', '2024-07-03 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2667, '01266_19_00103', 'PANORAMIQUE VISUEL SYSTEME', 'PANORAMIC VISUAL SYSTEM', '', 'Z4F', 'EEH', 'To be updated', 'YES', 'NO', '2019-04-25 00:00:00', '2019-04-15 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2668, '01266_19_00169', 'COMMANDE DE VITESSES MONOSTABLE', 'MONOSTABLE SPEED CONTROL', 'Engine and Gearbox', 'G21', 'ATR', 'To be updated', 'YES', 'NO', '2019-03-04 00:00:00', '2019-11-06 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2669, '01266_19_00170', 'DEFLECTEUR AIR SOUS CAISSE', 'UNDERBODY DEFLECTOR', 'Under Body', 'K2E', 'STR', 'To be updated', 'YES', 'NO', '2021-07-26 00:00:00', '2022-07-05 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2670, '01266_19_00185', 'COMMANDE DE VITESSES TOGGLE', 'TOGGLE SPEED CONTROL', 'Engine and Gearbox', 'G21', 'ATR', 'To be updated', 'NO', 'NO', '2019-03-04 00:00:00', '2019-04-15 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2671, '01266_19_00211', 'CAMERA VIDEO MULTIFONCTION', 'MULTIPURPOSE VIDEO CAMERA', 'Front Face and Hood', 'Z4F', 'EEH', 'Approved', 'YES', 'NO', '2019-05-27 00:00:00', '2024-03-22 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2672, '01266_19_00212', 'ECHANGEUR EAU REFROIDISSEMENT BATTERIE DE TRACTION', 'WATER COOLER FOR HV BATTERY', 'Battery under body', 'Z1B', 'AEE', 'To be updated', 'YES', 'NO', '2019-06-03 00:00:00', '2019-12-02 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2673, '01266_19_00213', 'ETRIER FREIN AV/AR', 'FRT/RR BRAKE CALIPER', 'Liaison au sol', 'F41', 'FRN', 'Applicable', 'YES', 'YES', '2019-06-12 00:00:00', '2024-11-05 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2674, '01266_19_00278', 'CAPTEUR POSITION PEDALE FREIN', 'BRAKE PEDAL POSITION SENSOR', 'Engine and Gearbox', 'G11', 'ATR', 'To be updated', 'YES', 'NO', '2019-05-16 00:00:00', '2019-05-16 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2675, '01266_19_00349', 'BUTEE D''ATTAQUE TRAIN AR DEFORMABLE', 'DEFORMABLE REAR AXLE ATTACK STOP ', 'Liaison au sol', 'E25', 'LAS', 'To be updated', 'YES', 'NO', '2019-06-20 00:00:00', '2019-06-14 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2676, '01266_19_00351', 'CONTACTEUR_STOP_ELECTRONIQUE', 'ELECTRONIC STOP CONTACTOR', 'Engine and Gearbox', 'G11', 'ATR', 'To be updated', 'YES', 'NO', '2019-06-03 00:00:00', '2019-05-27 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2677, '01266_19_00407', 'AVERTISSEUR SONORE PIETON ', 'PEDESTRIAN HORN', 'Harness and ECUs', 'Z3A', 'EXT', 'To be updated', 'YES', 'NO', '2020-02-18 00:00:00', '2020-02-18 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2678, '01266_19_00408', 'DEFLECTEUR ENTREE AIR', 'DEFLECTOR AIR ENTRY', 'Engine and Gearbox Adaptation', 'A26', 'AMO', 'Applicable', 'YES', 'NO', '2019-09-25 00:00:00', '2024-04-07 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2679, '01266_19_00460', 'PROTECTEUR SUR TRAIN ARRIERE TRAVERSE DEFORMABLE', 'PROTECTOR ON A REAR AXLE DEFORMABLE CROSSMEMBER ', 'Liaison au sol', 'E21', 'LAS', 'To be updated', 'YES', 'NO', '2020-01-17 00:00:00', '2020-01-17 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2680, '01266_19_00461', 'DEFLECTEUR AIR BATTERIE TRACTION', 'TRACTION BATTERY AIR DEFLECTOR', 'Under Body', 'A26', 'AMO', 'Cancelled', 'YES', 'NO', '2019-07-16 00:00:00', '2019-07-16 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2681, '01266_19_00463', 'SUPPORT CROCHET SECURITE CAPOT  ', 'SUPPORT HOOK SAFETY BONNET', 'Front Face and Hood', 'N2A', 'EXT', 'To be updated', 'YES', 'NO', '2020-04-02 00:00:00', '2020-04-02 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2682, '01266_19_00536', 'CONDUIT AIR PLACE AV ', 'AIR DUCT FRONT PLACE', 'Dashboard and console', 'V3A', 'PDC', 'Applicable', 'YES', 'NO', '2019-09-27 00:00:00', '2024-10-07 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2683, '01266_19_00537', 'COUVERCLE BAC BATTERIE TRACTION CAS DE ECMP ET EK0', 'TRACTION BATTERY HOUSING COVER, ECMP ET EK0 CASE', 'Battery under body', 'Z1C', 'AEE', 'Applicable', 'YES', 'NO', '2019-08-29 00:00:00', '2024-11-07 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2684, '01266_19_00538', 'GROUPE MOTO-VENTILATEUR', 'MOTOR FAN GROUP ', 'Engine and Gearbox Adaptation', 'B11', 'AMO', 'To be updated', 'YES', 'NO', '2019-10-30 00:00:00', '2019-10-30 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2685, '01266_19_00539', 'RADIATEUR REFROIDISSEMENT', 'COOLING RADIATOR', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'To be updated', 'YES', 'NO', '2019-11-22 00:00:00', '2019-11-20 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2686, '01266_19_00540', 'CONDUIT D''AIR PLACE AR', 'AIR DUCT REAR PLACE', 'Dashboard and console', 'S3A', 'PDC', 'To be updated', 'YES', 'NO', '2021-06-08 00:00:00', '2021-06-08 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2687, '01266_19_00598', 'INSONO TUNNEL', 'SOUND DEADENING TUNNEL', 'Interior Trims', 'X2A', 'INT', 'To be updated', 'YES', 'NO', '2020-01-10 00:00:00', '2023-03-30 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2688, '01266_19_00599', 'CABLE COMMANDE OUVERTURE DE CAPOT', 'CLAMPING OF THE CABLE CONTROL OPENING BONNET', 'Front Face and Hood', 'N2A', 'EXT', 'To be updated', 'YES', 'NO', '2020-11-09 00:00:00', '2020-11-09 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2689, '01266_19_00600', 'RETROVISEUR INTERIEUR', 'REARVIEW MIRROR', 'Roof and Roof trim', 'T2E', 'OUV', 'Applicable', 'YES', 'NO', '2019-10-28 00:00:00', '18/04/2023', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2690, '01266_19_00601', 'FLASQUE CONSOLE D/G', 'FLANGE CONSOLE R/L', 'Dashboard and console', 'S3A', 'PDC', 'To be updated', 'YES', 'NO', '2021-02-12 00:00:00', '2021-02-12 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2691, '01266_19_00602', 'CACHE PIED RETROVISEUR INTERIEUR    ', 'INTERIOR REARVIEW MIRROR FOOT COVER', 'Roof and Roof trim', 'T2E', 'OUV', 'Applicable', 'YES', 'NO', '2019-10-29 00:00:00', '18/04/2023', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2692, '01266_19_00603', 'COMMANDE EXTERIEURE OUVERTURE VOLET AR', 'TAILGATE EXTERIOR OPENER CONTROL', 'Lateral Face and Doors', 'N2B', 'OUV', 'To be updated', 'YES', 'NO', '2019-11-19 00:00:00', '2019-11-06 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2693, '01266_19_00604', 'CAPTEUR DETECTION PLUIE ', 'SENSOR RAIN DETECTION', 'Roof and Roof trim', 'Z6E', 'OUV', 'To be updated', 'YES', 'NO', '2019-10-28 00:00:00', '2023-04-21 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2694, '01266_19_00605', 'POMMEAU COMMANDE VITESSE', 'KNOB GEAR CONTROL', 'Engine and Gearbox Adaptation', 'G21', 'ATR', 'To be updated', 'YES', 'NO', '2019-11-22 00:00:00', '2019-10-30 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2695, '01266_19_00606', 'EXTRACTEUR AIR', 'AIR EXTRACTOR', 'Interior Trims', 'V4B', 'PDC', 'Applicable', 'YES', 'NO', '2019-10-28 00:00:00', '18/04/2023', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2696, '01266_19_00775', 'GARNITURE PANNEAU ARRIERE ', 'REAR TRIM PANEL ', 'Rear Face and Tailgate', 'X5D', 'INT', 'To be updated', 'YES', 'NO', '2019-11-25 00:00:00', '2021-05-19 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2697, '01266_19_00776', 'PLATINE CONTACTEUR LEVE VITRE ', 'CONTACTOR PLATE GLASS LIFT', 'Lateral Face and Doors', 'N5E', 'OUV', 'To be updated', 'YES', 'NO', '2020-04-01 00:00:00', '2020-04-01 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2698, '01266_19_00778', 'INSONO COLLECTEUR AUVENT', 'DODGER COLLECTOR SOUNDPROOF', 'Front Face and Hood', 'X1A', 'INT', 'To be updated', 'NO', 'NO', '2020-09-08 00:00:00', '2020-09-08 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2699, '01266_19_00779', 'AIRBAG GONFLABLE COUSSIN VOLANT', 'AIRBAG STEERING WHEEL PAD', 'Dashboard and console', 'U1B', 'PDC', 'To be updated', 'YES', 'NO', '2020-03-02 00:00:00', '2020-03-02 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2700, '01266_19_00780', 'DEFLECTEUR AR SAC GONFLABLE LAT PAVILLON ', 'ROOF PANEL LATERAL SIDE AIRBAG REAR BAFFLE ', 'Seats and safety belts', 'U1C', 'ASS', 'Approved', 'YES', 'NO', '2020-01-08 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2701, '01266_19_00781', 'SAC GONFLABLE GENOU CONDUCTEUR ET PASSAGER', 'AIRBAG DRIVER AND PASSENGER KNEES', 'Dashboard and console', 'U1B', 'PDC', 'To be updated', 'YES', 'NO', '2021-09-09 00:00:00', '2021-09-09 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2702, '01266_19_00782', 'SUPPORT POMPE EAU ELECTRIQUE', 'ELECTRIC WATER PUMP SUPPORT ', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'To be updated', 'YES', 'NO', '2021-01-27 00:00:00', '2021-01-27 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2703, '01266_19_00783', 'BARRETTE CONNEXION BATTERIE HT', 'HIGH VOLTAGE BATTERY BUS BAR', 'Battery under body', 'Z9A', 'AEE', 'Applicable', 'YES', 'NO', '2020-10-20 00:00:00', '2024-01-30 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2704, '01266_19_00784', 'CABLE HT AV  BOITIER CHARGE PRISE NORMALE-ECMP', 'CABLE BOX HV OF LOAD HV TAKEN NORMAL LOAD-ECMP', 'Harness and ECUs', 'Z9A', 'AEE', 'Approved', 'YES', 'NO', '2021-06-09 00:00:00', '2024-06-03 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2705, '01266_19_00808', 'SUPPORT CABLE CHARGE DOMESTIQUE', 'HOME CHARGING HARNESS BRACKET', 'Engine and Gearbox Adaptation', 'Z9L', 'AEE', 'To be updated', 'YES', 'NO', '2020-12-16 00:00:00', '2020-12-16 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2706, '01266_19_00809', 'MICRO RADIO TELEPHONE', 'MICROPHONE RADIO TELEPHONE', 'Roof and Roof trim', 'Z7G', 'EEH', 'To be updated', 'YES', 'NO', '2020-03-02 00:00:00', '2020-02-26 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2707, '01266_19_00812', 'SUPPORT CHARGEUR EMBARQUE BATTERIE TRACTION', 'DRIVE BATTERY ON-BOARD LOADER BRACKET', '', 'Z1A', 'EEM', 'To be updated', 'YES', 'NO', '2021-04-14 00:00:00', '29/02/2022', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2708, '01266_19_00813', 'SUPPORT POMPE EAU ELECTRIQUE 1 (ECMP)', 'ELECTRIC WATER PUMP BRACKET 1 (ECMP)', '', 'B12', 'AMO', 'To be updated', 'YES', 'NO', '2021-03-26 00:00:00', '2022-11-25 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2709, '01266_19_00814', 'CHARGEUR EMBARQUE BATTERIE TRACTION', 'DRIVE BATTERY ON-BOARD LOADER', '', 'Z1A', 'EEM', 'Applicable', 'YES', 'NO', '2020-07-02 00:00:00', '2024-11-28 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2710, '01266_19_00815', 'ENJOLIVEUR CONSOLE PAVILLON', 'ROOF PANEL CONSOLE FINISHER', 'Roof and Roof trim', 'T2C', 'INT', 'To be updated', 'YES', 'NO', '2020-01-14 00:00:00', '2020-01-14 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2711, '01266_19_00839', 'JOINT ENTREE AIR', 'AIR ENTRY GASKET', 'Engine and Gearbox', 'V1B', 'PDC', 'To be updated', 'YES', 'NO', '2021-02-12 00:00:00', '2021-02-12 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2712, '01266_19_00840', 'CACHE LAT CLIMATISEUR D-G', 'AIR COND SIDE COVER L-R', 'Dashboard and console', 'S2D', 'PDC', 'To be updated', 'NO', 'NO', '2020-10-30 00:00:00', '2020-10-30 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2713, '01266_19_00841', 'RENFORT PAVILLON', 'REINFORCEMENT ROOF PANEL', 'Roof and Roof trim', 'K6B', 'STR', 'To be updated', 'YES', 'NO', '2020-02-18 00:00:00', '2020-02-18 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2714, '01266_19_00842', 'SUPPORT COMMANDE OUVERTURE CAPOT (EMP2)', 'SUPPORT CONTROL OPENING BONNET (EMP2)', 'Lateral Face and Doors', 'N2A', 'EXT', 'To be updated', 'YES', 'NO', '2020-11-10 00:00:00', '2020-11-10 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2715, '01266_19_00843', 'MODULE SURVEILLANCE BATTERIE', 'BATTERY MONITORING MODULE', 'Harness and ECUs', 'Z1A', 'EEM', 'To be updated', 'YES', 'NO', '2021-05-06 00:00:00', '2023-04-12 00:00:00', NULL, '2026-04-30 00:02:34.400937', NULL);
INSERT INTO public.fiches VALUES (2716, '01266_19_00844', 'ELEMENT_ELASTIQUE_DE_SUSPENSION_GMP_SUPP_ EMP2 (BIELLETTE ANTI-COUPLE)', 'UPPER FLEXIBLE ELEMENT POWERTRAIN SUSPENSION_EMP2 (ANTITORQUE CRANK ARM)', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2020-10-22 00:00:00', '2020-10-22 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2717, '01266_19_00845', 'LIAISON JAMBE FORCE TUNNEL', 'TUNNEL RADIUS ROD BOND', 'Engine and Gearbox', 'K3A', 'STR', 'Applicable', 'YES', 'YES', '2020-11-02 00:00:00', '2020-11-02 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2718, '01266_19_00847', 'RESISTANCE DE CHARGE COMMUTEE', 'COMMUTED LOAD RESISTANCE', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2021-03-08 00:00:00', '2021-03-08 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2719, '01266_19_00848', 'SUPPORT PLAQUE IMMATRICULATION AV', 'SUPPORT NUMBER PLATE', 'Front Face and Hood', 'R5C', 'EXT', 'To be updated', 'YES', 'NO', '2021-03-15 00:00:00', '2021-03-15 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2720, '01266_20_00215', 'IMPACTEUR ePWT', 'ELECTRIC PT IMPACTOR', 'Engine and Gearbox', 'D11', 'ATR', 'Current Update', 'YES', 'YES', '2021-07-29 00:00:00', '2024-09-06 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2721, '01266_20_00216', 'ROTULE ET SUPPORT ROTULE CAPTUER HAUTEUR AV', 'BALL AND SUPPORT BALL FRT HEIGHT SENSOR LEVER', 'Liaison au sol', 'G76', 'HYD', 'To be updated', 'YES', 'NO', '2021-07-26 00:00:00', '2021-07-26 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2722, '01266_20_00217', 'BIELLETTE CAPTEUR HAUTEUR AV', 'FRT HEIGHT SENSOR LEVER', 'Liaison au sol', 'G76', 'HYD', 'To be updated', 'YES', 'NO', '2021-07-05 00:00:00', '2021-07-05 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2723, '01266_20_00218', 'RAIL SUPPORT SIEGE LATERAL (SIEGES RANG 3)', 'SEAT SUPPORT RAIL LATERAL (SEATS ROW 3)', 'Seats and safety belts', 'Y3A', 'ASS', 'To be updated', 'YES', 'NO', '2021-05-19 00:00:00', '2021-06-24 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2724, '01266_20_00219', 'SIRENE ALARME PREP ', 'HORN ALARME PREP', '', 'Z8C', 'EEH', 'To be updated', 'YES', 'NO', '2021-07-13 00:00:00', '2021-07-13 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2725, '01266_20_00220', 'SUPPORT ESP', 'ESP SUPPORT', 'Liaison au sol', 'F67', 'FRN', 'To be updated', 'YES', 'NO', '2021-05-20 00:00:00', '2021-05-20 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2726, '01266_20_00221', 'GOULOTTE FAISCEAUX EVMP', 'CABLES TRAY EVMP', 'Harness and ECUs', 'Z9A', 'AEE', 'To be updated', 'YES', 'NO', '2021-07-07 00:00:00', '2021-07-07 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2727, '01266_20_00222', 'CHARNIERE VITRE CUSTODE', 'OPENER WINDOW HINGER', 'Lateral Face and Doors', 'N5D', 'OUV', 'To be updated', 'YES', 'NO', '2021-06-03 00:00:00', '2021-06-03 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2728, '01266_20_00223', 'COMMANDE VITRE CUSTODE', 'PANEL GLAZING CONTROL', 'Lateral Face and Doors', 'N5D', 'OUV', 'To be updated', 'YES', 'NO', '2021-05-19 00:00:00', '2021-05-19 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2729, '01266_20_00224', 'SUPPORT PLAQUE IMMATRICULATION AR JAPON', 'RR SUPPORT NUMBER PLATE JAPAN', 'Rear Face and Tailgate', 'R5C', 'EXT', 'To be updated', 'YES', 'NO', '2021-06-08 00:00:00', '2021-06-08 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2730, '01266_20_00769', 'SUPPORT APPUI AV BERCEAU', 'FRT CRADLE FRT FIX BRG SUPPORT', 'Liaison au sol', 'E11', 'LAS', 'To be updated', 'YES', 'NO', '2021-05-13 00:00:00', '2021-05-13 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2731, '01266_20_00770', 'BOITIER ELECTRONIQUE DISJONCTEUR', 'ELECTRONIC CIRCUIT BRAKER', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'NO', 'NO', '2021-02-05 00:00:00', '2021-02-05 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2732, '01266_20_00771', 'PALIER ESSUIE VITRE', 'WIPER BEARING ', 'Front Face and Hood', 'Z6E', 'OUV', 'To be updated', 'YES', 'NO', '2021-02-17 00:00:00', '2021-02-17 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2733, '01266_20_00772', 'BIELLE ESSSUIE-VITRE', 'WIPER LINK ROD', 'Front Face and Hood', 'Z6E', 'OUV', 'To be updated', 'YES', 'NO', '2021-02-05 00:00:00', '2021-02-05 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2734, '01266_20_00773', 'SUPPORT FLEXIBLE FREIN AV', 'FRT BRAKE FLEXIBLE SUPPORT', 'Liaison au sol', 'F63', 'FRN', 'To be updated', 'YES', 'NO', '2021-02-17 00:00:00', '2021-02-17 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2735, '01266_20_00774', 'CONSOLE PAVILLON', 'ROOF PANEL CONSOLE', 'Roof and Roof trim', 'T2C', 'INT', 'To be updated', 'NO', 'NO', '2021-02-17 00:00:00', '2021-02-17 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2736, '01266_20_00775', 'CACHE FIXATION LAT PLANCHE DE BORD', 'FACIA PNL SIDE FIX COVER', 'Dashboard and console', 'S1A', 'PDC', 'To be updated', 'YES', 'NO', '2021-04-28 00:00:00', '2021-04-28 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2737, '01266_20_00776', 'GARNITURE REPOSE PIED', 'FOOTREST TRIM', 'Interior Trims', 'T2D', 'INT', 'To be updated', 'YES', 'NO', '2021-06-23 00:00:00', '2021-06-23 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2738, '01266_21_00343', 'ATTELAGE REMORQUE', 'TRAILER HITCH', 'Rear Face and Tailgate', 'R5G', 'STR', 'Approved', 'YES', 'NO', '2022-02-22 00:00:00', '2024-01-17 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2739, '01266_21_00347', 'IMPACTEUR DROIT ePWT ', 'ELECTRIC PT RIGHT IMPACTOR', 'Engine and Gearbox', 'D11', 'ATR', 'Approved', 'YES', 'NO', '2021-11-04 00:00:00', '2024-02-23 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2740, '01266_21_00348', 'ACTIONNEUR PYROTECHNIQUE CHARNIERE CAPOT', 'HOOD HINGE PYROTECHNIC ACTUATOR', 'Front Face and Hood', 'N2E', 'OUV', 'To be updated', 'YES', 'NO', '2022-01-06 00:00:00', '2022-11-06 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2741, '01266_21_00537', 'PARTIE ASSISE ARTICULE COUSSIN (SIEGES RANG 2 )', 'ARTICULATED SEAT PART (SEATS ROW 2)', 'Seats and safety belts', 'Y2A', 'ASS', 'To be updated', 'YES', 'NO', '2021-10-18 00:00:00', '2021-11-24 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2742, '01266_21_00539', 'MODULE ELECTRIQUE DANS LE PACK BATTERIE ', 'FIXATION OF MODULES IN THE BATTERY PACK', 'Battery under body', 'Z1A', 'EEM', 'Applicable', 'YES', 'NO', '2022-03-31 00:00:00', '2024-10-21 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2743, '01266_21_00540', 'PROTECTEUR CHARGEUR EMBARQUE BATTERIE TRACTION', 'PROTECTOR CHARGER ON BOARD BATTERY TRACTION', 'Engine and Gearbox', 'Z1A', 'EEM', 'To be updated', 'YES', 'NO', '2022-02-11 00:00:00', '2022-02-04 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2744, '01266_21_00541', 'FIL DE MASSE', 'GROUND WIRE', 'Harness and ECUs', 'Z9A', 'AEE', 'To be updated', 'YES', 'NO', '2022-01-25 00:00:00', '2022-01-20 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2745, '01266_22_00001', 'AVERTISSEUR MAIN LIBRE ', 'HAND FREE ACCESS AUDIBLE DEVICE', 'Rear Face and Tailgate', 'Z8G', 'EEH', 'To be updated', 'YES', 'NO', '2022-04-11 00:00:00', '2022-04-11 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2746, '01266_22_00002', 'SUPPORT ELASTIQUE D GEM AV ASS sur ePWT', 'ASS RH PT MOUNT RT and LT', 'Engine and Gearbox', 'D31', 'ATR', 'Current Update', 'YES', 'NO', '2022-09-27 00:00:00', '11/04/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2747, '01266_22_00003', 'SUPPORT ANTI COUPLE INF D GEM AV sur ePWT', 'LWR RH EPWT FRT ANTI TORQUE BRACKET on ePWT', 'Engine and Gearbox', 'D31', 'ATR', 'Current Update', 'YES', 'YES', '2022-08-29 00:00:00', '2024-01-10 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2748, '01266_22_00004', 'ENCEINTE ACOUSTIQUE GRAVE ', 'SUBWOOFER BOX', 'Harness and ECUs', 'Z7D', 'EEH', 'to be updated', 'YES', 'NO', '2022-04-11 00:00:00', '2022-04-11 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2749, '01266_22_00005', 'TRAPPE ACCES ANNEAU REMORQUAGE', 'FLAP ACCESS TOWING EYE', 'Rear Face and Tailgate', 'R1B', 'EXT', 'to be updated', 'YES', 'NO', '2022-08-24 00:00:00', '2022-06-10 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2750, '01266_22_00138', 'GRILLE SUP ET INF PARE-CHOCS AV', 'FRONT BUMPER UPR AND BOTTOM GRID', 'Front Face and Hood', 'R1A', 'EXT', 'Approved', 'YES', 'NO', '00:00:00', '2024-02-15 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2751, '01266_22_00349', 'SUPPORT COMPRESSEUR REFRIGERATION(BEV)', 'REFRIGERATION COMPRESSOR SUPPORT (BEV)', 'Engine and Gearbox Adaptation', 'A18', 'nan', 'To be updated', 'YES', 'NO', '2022-07-14 00:00:00', '12/04/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2752, '01266_22_00351', 'COLLECTEUR SORTIE EAU sur ePWT', 'WATER OUTLET COLLECTOR on ePWT', 'Engine and Gearbox', 'B12', 'AMO', 'To be updated', 'YES', 'NO', '2022-11-16 00:00:00', '2023-04-19 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2753, '01266_22_00352', 'SUPPORT TUYAU EAU ENTREE POMPE ELECTRIQUE (BEV)', 'WATER PIPE INLET BRACKET ELECTRIC PUMP (BEV)', 'Engine and Gearbox Adaptation', 'Z9L', 'nan', 'To be updated', 'YES', 'NO', '2022-07-15 00:00:00', '12/04/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2754, '01266_22_00356', 'FAISCEAU PARE CHOC AV', 'FRONT BUMPER HARNESS', 'Front Face and Hood', 'Z9M', 'nan', 'Approved', 'NO', 'NO', '2022-06-20 00:00:00', '2023-11-14 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2755, '01266_22_00359', 'BALAIS ESSUIE VITRE AR', 'REAR G/W SQUEEGEE ARM', 'Rear Face and Tailgate', 'Z6F', 'OUV', 'Approved', 'YES', 'YES', '2022-07-05 00:00:00', '2024-05-06 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2756, '01266_22_00427', 'CANALISATION CARBURANT (regroupe 2 fiches)', 'FUEL PIPING', 'Under Body', 'B32', 'AMO', 'Applicable', 'YES', 'NO', '2022-09-02 00:00:00', ' 27/07/2022 ', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2757, '01266_22_00510', 'ELECTROVANNE 2 VOIES HAUTE PRESSION sue ePWT', 'HIGH PRESSURE 2-WAY SOLENOID VALVE', 'Engine and Gearbox', 'B14', 'AMO', 'Applicable', 'YES', 'NO', '2022-11-25 00:00:00', '07/04/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2758, '01266_22_00511', 'CONDENSEUR EAU CIRCUIT AEROTHERME ENS sur ePWT', 'CONDENSER WATER CIRCUIT AEROTHERM SET on E_PWT', 'Engine and Gearbox', 'V5B', 'AMO', 'Applicable', 'YES', 'NO', '2022-09-02 00:00:00', '04/04/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2759, '01266_22_00512', 'SUR TAPIS', 'FRT RH AND RR MAT CARPET', 'Interior Trims', 'X2A', 'INT', 'To be updated', 'YES', 'NO', '2022-09-02 00:00:00', '30/03/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2760, '01266_22_00513', 'ENJOLIVEUR JET EAU', 'FINISHER DRIP CHANNEL', 'Lateral Face and Doors', 'R3A', 'EXT', 'To be updated', 'YES', 'NO', '2023-02-16 00:00:00', '16/02/2023', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2761, '01266_22_00514', 'ENJOLIVEUR INT GOUSSET PORTE AR', 'RR DOOR GUSSET INR FINISHER', 'Lateral Face and Doors', 'X4C', 'INT', 'Approved', 'YES', 'NO', '2023-02-20 00:00:00', '2023-10-26 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2762, '01266_22_00515', 'BOITIER ELECTRONIQUE RADAR FRONTAL ENS', 'FRONT RADAR ELECTRONIC UNIT ENS', 'Front Face and Hood', 'Z4F', 'EEH', 'Current Update', 'YES', 'NO', '2022-09-02 00:00:00', '2024-05-22 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2763, '01266_22_00516', 'BOITIER FUSIBLE HAUTE TENSION sur ePWT', 'HIGH VOLTAGE FUSE CASE on ePWT', 'Battery under body', 'Z5U', 'AEE', 'Approved', 'YES', 'NO', '2022-09-02 00:00:00', '2024-02-23 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2764, '01266_22_00517', 'FIL MASSE RECHAUFFEUR EAU', 'WIRE MASS HEATER WATER', 'Engine and Gearbox', 'Z9K', 'AEE', 'to be updated', 'YES', 'NO', '2022-11-08 00:00:00', '2022-12-02 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2765, '01266_22_00518', 'DEFLECTEUR CENTRAL SAC GONFLABLE', 'CENTRAL AIRBAG DEFLECTOR', 'Interior Trims', 'U1C', 'ASS', 'Approved', 'YES', 'NO', '2022-09-02 00:00:00', '2023-10-30 00:00:00', NULL, '2026-04-30 00:02:34.456841', NULL);
INSERT INTO public.fiches VALUES (2766, '01266_22_00519', 'SUPPORT PRISE CHARGE sur CAISSE', 'CHARGING PLUG SUPPORT on BODY', 'Lateral Face and Doors', 'K4F', 'STR', 'Approved', 'YES', 'NO', '2022-09-02 00:00:00', '2024-07-31 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2767, '01266_22_00520', 'EMBOUT SORTIE EAU sur ePWT', 'WATER OUTLET TIP', 'Engine and Gearbox', 'A16', 'ARM', 'Applicable', 'YES', 'NO', '2022-09-02 00:00:00', '2023-04-11 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2768, '01266_22_00521', 'JOINT ANTIPINCEMENT ENTREE VOLET AR', 'GASKET ANTI-PINCHING APERTURE TAILGATE', 'Rear Face and Tailgate', 'W3A', 'OUV', 'Applicable', 'YES', 'NO', '00:00:00', '07/04/2023', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2769, '01266_22_00522', 'CROCHET PARE SOLEIL', 'SUN VISOR HOOK', 'Roof and Roof trim', 'T2A', 'INT', 'Approved ', 'YES', 'NO', '2022-05-18 00:00:00', '2024-05-08 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2770, '01266_22_00523', 'ATTACHE BAGAGE AV', 'LASHING EYES', 'Interior Trims', 'X5E', 'INT', 'Current Update', 'YES', 'YES', '2022-11-02 00:00:00', '2024-03-27 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2771, '01266_22_00524', 'RAIDISSEUR PAVILLON', 'STIFFENER ROOF PANEL', 'Interior Trims', 'K6B', 'INT', 'Approved', 'YES', 'NO', '2023-03-15 00:00:00', '2023-10-31 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2772, '01266_22_00525', 'TUYAU CHARGEUR BATTERIE sur ePWT', 'nan', 'Engine and Gearbox', 'nan', '-', 'To be updated', 'YES', 'NO', '2022-09-02 00:00:00', '2023-11-06 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2773, '01266_22_00526', 'CLAPET ANTI RETOUR EAU sur ePWT', 'NON-RETURN VALVE on E_PWT', 'Engine and Gearbox', 'V5C', 'AMO', 'Applicable', 'YES', 'NO', '2022-09-02 00:00:00', '04/04/2023', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2774, '01266_22_00527', 'RESISTANCE RECHAUFFAGE EAU BASSE TENSION', 'LOW VOLTAGE WATER RESISTANCE REHEATING', 'Engine and Gearbox', 'V2K', 'PDC', 'Applicable', 'YES', 'NO', '2022-09-02 00:00:00', '05/04/2023', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2775, '01266_22_00528', 'TUYAU EAU ENTREE CHARGEUR sur ePWT', 'WATER INPUT HOSE OF BATTERY TRACTION CHARGER ', 'Engine and Gearbox', 'B12', 'AMO', 'Applicable', 'YES', 'NO', '2022-09-02 00:00:00', '2023-04-11 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2776, '01266_22_00529', 'TRAVERSE SUPPORT GROUPE ELECTROMOTEUR', 'CROSS MEMBER ELECTROMOTOR GROUP BRACKET ', 'Engine and Gearbox', 'D31', 'ATR', 'Approved', 'YES', 'NO', '2022-09-02 00:00:00', '2024-07-09 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2777, '01266_22_00530', 'ELECTROVANNE REFROIDIS BATTERIE TRACTION sur ePWT', 'COOLED SOLENOID VALVE TRACTION BATTERY', 'Engine and Gearbox', 'Z1B', 'AEE', 'Approved', 'YES', 'NO', '2022-09-02 00:00:00', '2024-07-09 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2778, '01266_22_00531', 'PROTECTEUR FAISCEAU sur Epwt', 'HARNESS PROTECTOR ON E-PWT', 'Engine and Gearbox', 'N2B', 'AEE', 'Approved', 'YES', 'NO', '2022-09-02 00:00:00', '2024-07-09 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2779, '01266_22_00538', 'ROUES PRINCIPALES (regroupe 2 fiches)', 'MAIN WHEELS', 'Liaison au sol', 'E31', 'LAS', 'Applicable', 'YES', 'NO', '2022-09-06 00:00:00', '2023-09-07 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2780, '01266_22_00629', 'TUYAU REFRIGERATION COMPRESSION', 'COMPRESSION REFRIGERATION PIPE', 'Front Face and Hood', 'V5D', 'AMO', 'Applicable', 'YES', 'NO', '2022-11-21 00:00:00', '2023-09-04 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2781, '01266_22_00648', 'SIEGE RANG 2 (regroupe plusieurs fiches)', 'SEAT RANK 2', 'Seats and safety belts', 'Y2A', 'ASS', 'Approved', 'YES', 'NO', '2022-10-25 00:00:00', '2022-10-25 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2782, '01266_22_00758', 'INSONO PASSAGE DE ROUE AR', 'REAR SOUND DEADENING WHEEL ARCH', 'Interior Trims', 'X3A', 'INT', 'To be updated', 'YES', 'NO', 'nan', '30/03/2023', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2783, '01266_22_00759', 'DEVIATEUR SANGLE CEINTURE SECURITE AV', 'FRONT SAFETY BELT STRAP DEVIATOR', 'Seats and safety belts', 'U1A', 'ASS', 'Current Update', 'YES', 'NO', '2022-12-22 00:00:00', '2023-10-16 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2784, '01266_22_00760', 'INSONO AV/AR', 'FRONT/REAR SOUND DEADENING TUNNEL', 'Interior Trims', 'X2A', 'INT', 'Approved', 'YES', 'NO', 'nan', '2023-11-14 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2785, '01266_22_00761', 'ENJOLIVEUR SUP AILE AV', 'FRONT WING UPPER FINISHER', 'Front Face and Hood', 'R3D', 'EXT', 'Approved', 'YES', 'NO', '2023-03-07 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2786, '01266_22_00762', 'ENJOLIVEUR SUP COTE CAISSE', 'UPPER CAR BODY TRIM', 'Lateral Face and Doors', 'R3C', 'EXT', 'Approved', 'YES', 'NO', '2023-03-06 00:00:00', '2023-10-30 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2787, '01266_22_00763', 'VITRE MOBILE PORTE SANS CADRE', 'FRAMELESS DOOR GLASS MOBILE', 'Lateral Face and Doors', '  P1C', 'nan', 'Current Update', 'YES', 'NO', '2022-12-22 00:00:00', '2024-07-24 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2788, '01266_22_00764', 'BRIDE CONNECTEUR EAU ALLER / RETOUR', 'WATER CONNECTOR INLET / OUTLET', 'Battery under body', 'Z1B', 'nan', 'Approved', 'YES', 'YES', '02/03/2023', '2024-04-21 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2789, '01266_22_00765', 'TRAPPE VISITE VOLET', 'INSPECTION TRAP', 'Rear Face and Tailgate', 'X5B', 'OUV', 'Approved', 'YES', 'NO', '2022-12-22 00:00:00', '2023-11-07 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2790, '01266_22_00766', 'PRISE CHARGE (BEPR)', 'CHARGING PLUG (BEPR)', 'Lateral Face and Doors', 'Z9A', 'nan', 'Approved', 'YES', 'NO', '2022-12-22 00:00:00', '2024-05-24 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2791, '01266_23_00137', 'EQUILIBREUR OUVRANT AR', ' REAR GAS SPRING', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Applicable', 'YES', 'NO', '2023-03-08 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2792, '01266_23_00140', 'JOINT SUR PORTE', 'DOOR MOUNTED SEAL', 'Lateral Face and Doors', 'W2A', 'OUV', 'Approved', 'YES', 'NO', 'nan', '2023-11-08 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2793, '01266_23_00141', 'BOITIER COMMANDE OUVERTURE VOLET', 'MOTORIZED REAR TAILGATE ELEC CASE', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Approved ', 'YES', 'NO', '2023-03-08 00:00:00', '2024-07-08 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2794, '01266_23_00142', 'PUSH FERMETURE VOLET', 'REAR ACCESS CLOSER SWITCH', 'Rear Face and Tailgate', 'N2E', 'OUV', 'Approved ', 'YES', 'NO', '2023-02-27 00:00:00', '2024-07-08 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2795, '01266_23_00185', 'COMMANDE NEUTRALISATION SAC GONFLABLE PASSAGER', 'PASSENGER AIRBAG DISABLING CONTROL', 'Dashboard and console', 'U4A', 'EEH', 'Approved', 'YES', 'NO', '2023-04-07 00:00:00', '2023-11-13 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2796, '01266_23_00186', 'ECLAIREUR VIDE-POCHES PLANCHE BORD', 'FACIA PANEL MAG POUCH LIGHT', 'Dashboard and console', 'Z2M', 'EXT', 'Approved', 'YES', 'NO', '2023-04-07 00:00:00', '2023-11-13 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2797, '01266_23_00322', 'DEFLECTEUR AIR SUP AR', 'RR UPR AIR BAFFLE', 'Rear Face and Tailgate', 'R5M', 'EXT', 'Approved', 'NO', 'YES', '2023-07-10 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2798, '01266_23_00324', 'SUPPORT AR D/G GROUPE ELECTROMOTEUR AR', 'SUPPORT RR ELECTRIC POWERTRAIN RR', 'Engine and Gearbox', 'D31', 'ATR', 'Current Update', 'NO', 'YES', '2023-07-10 00:00:00', '2024-11-11 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2799, '01266_23_00325', 'DEFLECTEUR AIR VENTILATEUR BATTERIE TRACTION', 'AIR DEFLECTOR VENTING TRACTION BATTERY', 'nan', 'nan', 'nan', 'Cancelled', 'NO', 'NO', '2023-07-10 00:00:00', '2024-03-08 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2800, '01266_23_00327', 'MODULE GESTION THERMIQUE CIRCUIT EAU ENS', 'WATER LOOP THERMAL MANAGEMENT MODULE ENS', 'Engine and gearbox', 'A17', 'EEM', 'Approved', 'NO', 'YES', '2023-07-10 00:00:00', '2023-11-15 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2801, '01266_23_00328', 'MOYEU ROULEMENT ROUE AR', ' RR WHEEL BUSH HUB', 'Liaison au sol', 'E24', 'LAS', 'Current Update', 'NO', 'YES', '2023-07-10 00:00:00', '2024-03-11 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2802, '01266_23_00333', 'BOITIER ELECTRONIQUE ZONAL AVANT-CHAINE TRACTION', 'FRONT-POWERTRAIN ZONAL CONTROL UNIT', 'Front Face and Hood', 'Z5U', 'AEE', 'Approved ', 'NO', 'YES', '2023-07-17 00:00:00', '2024-02-26 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2803, '01266_23_00334', 'ENJOLIVEUR AILE AV/AR', 'FRT/RR FINISHER FENDER', 'Lateral Face and Doors', 'R3D', 'OUV', 'Applicable ', 'NO', 'YES', '2023-07-17 00:00:00', '2024-12-02 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2804, '01266_23_00335', 'PROJECTEUR BROUILLARD', 'FOG LIGHT', 'Front and Rear Bumpers Assembly (plastic shop)', 'Z2C', 'EXT', 'Approved ', 'NO', 'YES', '2023-07-17 00:00:00', '2024-09-03 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2805, '01266_23_00336', 'CONVERTISSEUR ELECTRIQUE STOCKAGE ENERGIE ADD', 'ELECTRIC CONVERTER ENERGY PROVIDER ADD', 'Engine and gearbox', 'Z1D', 'EEM', 'Current Update', 'NO', 'NO', '2023-07-17 00:00:00', '2024-07-15 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2806, '01266_23_00368', 'SUPPORT BOITIER ELECTRONIQUE CONTROLEUR CTR HYDROGENE', 'SUPPORT ELECTRONIC BOX CONTROLLER FCPS', '', 'A53', 'nan', 'Approved', 'NO', 'YES', 'nan', '2024-11-11 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2807, '01266_23_00369', 'FOND BOITIER PRISE CHARGE', 'CHARGING PLUG HOUSING BOTTOM', 'Lateral Face and Doors', 'K7E', 'STR', 'Approved', 'NO', 'NO', '2023-06-21 00:00:00', '2023-10-16 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2808, '01266_23_00370', 'BOITIER ELECTRONIQUE CONTROLEUR CTR HYDROGENE', 'ELECTRONIC BOX CONTROLLER FCPS', 'Front Face and Hood', 'A53', 'STR', 'Approved', 'NO', 'YES', '2023-08-24 00:00:00', '2024-07-18 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2809, '01266_23_00371', 'SUPPORT HUMIDIFICATEUR AIR PILE COMBUSTIBLE', 'SUPPORT AIR HUMIDIFIER FUEL CELL', 'nan', 'A52', 'nan', 'Approved', 'NO', 'YES', '2023-08-24 00:00:00', '2023-10-20 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2810, '01266_23_00372', 'HUMIDIFICATEUR AIR PILE COMBUSTIBLE', 'AIR HUMIDIFIER FUEL CELL', 'under body', 'A52', 'nan', 'Applicable', 'NO', 'YES', '2023-08-24 00:00:00', '2023-08-24 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2811, '01266_23_00373', 'COMPRESSEUR AIR PILE COMBUSTIBLE', 'AIR COMPRESSOR FUEL CELL', 'under body', 'A52', 'nan', 'Approved', 'NO', 'YES', '2023-08-24 00:00:00', '2024-04-29 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2812, '01266_23_00374', 'ECHANGEUR EAU-AIR ADMISSION TURBOCOMPRESSEUR', 'WATER COOLER AIR TURBOCHARGER', 'HARNESS and ECUs', 'A26', 'AMO', 'Approved', 'NO', 'YES', '2023-08-24 00:00:00', '2024-07-24 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2813, '01266_23_00375', 'PILE COMBUSTIBLE ASS', 'FUEL CELL STACK ASM', 'under body', 'A51', 'nan', 'Approved', 'NO', 'YES', '2023-08-24 00:00:00', '2024-07-11 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2814, '01266_23_00391', 'ARMATURE COUSSIN', 'CUSHION FWK', 'Seats and safety belts', 'Y1A', 'ASS', 'Applicable', 'NO', 'NO', '2023-09-12 00:00:00', '2024-12-05 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2815, '01266_23_00392', 'SUPPORT CONNECTEUR', 'CONNECTOR SUPPORT', 'Seats and safety belts', 'Y1A', 'ASS', 'Current Update', 'NO', 'NO', '2023-09-12 00:00:00', '2024-12-03 00:00:00', NULL, '2026-04-30 00:02:34.509534', NULL);
INSERT INTO public.fiches VALUES (2816, '01266_23_00393', 'BRIN BOUCLE AVANT', 'FRONT BELT BUCKLE', 'Seats and safety belts', 'K2C', 'ASS', 'Current Update', 'NO', 'NO', '2023-09-12 00:00:00', '2024-12-10 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2817, '01266_23_00394', 'SAC GONFLABLE LATERAL DOSSIER ASSISE CONDUCTEUR', 'SIDE AIRBAG BACKREST DRIVER SEATING', 'Seats and safety belts', 'U1C', 'ASS', 'Current Update', 'NO', 'NO', '2023-09-12 00:00:00', '2024-12-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2818, '01266_23_00395', 'SUPPORT CONTROLEUR GESTION CELLULE BATTERIE TRACTION', 'SUPPORT CELL MANAGEMENT CONTROLER BAT', 'Battery under body', 'Z1A', 'EEM', 'Approved', 'NO', 'YES', '2023-09-12 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2819, '01266_23_00396', 'ARMATURE CENTRALE PARE-CHOC AV', 'FRONT ARMATURE BUMPER', 'Battery under body', 'R1A', 'EEM', 'To be updated', 'NO', 'YES', '2023-09-12 00:00:00', '2023-09-18 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2820, '01266_23_00397', 'ENJOLIVEUR PARE-CHOC AV', 'FRONT BUMPER UPR GRILL FINISHER', 'Front and Rear Bumpers Assembly (plastic shop)', 'R1A', 'EXT', 'Applicable', 'NO', 'NO', '2023-09-12 00:00:00', '2023-11-07 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2821, '01266_23_00398', 'COUPELLE INF RESSORT SUSPENSION AR', ' REAR SUSPENSION SPRING LOWER CUP FOR MULTILINK', 'Liaison au sol', 'E25', 'FRN', 'Approved', 'NO', 'NO', '2023-09-12 00:00:00', '2024-02-28 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2822, '01266_23_00399', 'SUPPORT CAPTEUR AIDE STATIONNEMENT', 'SUPPORT OBSTRUCTION DETECTION SENSOR', 'Front and Rear Bumpers Assembly (plastic shop)', 'R1A', 'EXT', 'Approved', 'NO', 'NO', 'nan', '2023-10-18 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2823, '01266_23_00400', 'CAPTEUR AIDE STATIONNEMENT', 'OBSTRUCTION DETECTION SENSOR', 'Front and Rear Bumpers Assembly (plastic shop)', 'R1A', 'nan', 'Approved', 'NO', 'NO', '2023-09-12 00:00:00', '2023-10-10 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2824, 'CMON_IMV08_0404', 'PARE CHOC AV - PLAGE AVANT', 'FRT BUMPER - FRONT END', 'Front Face and Hood', 'R1A', 'EXT', 'To be updated', 'YES', 'NO', '2008-12-02 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2825, 'CMON_IMV08_0405', 'PARE CHOC AV - PEAU', 'FRT BUMPER - SKIN', 'Front Face and Hood', 'R1A', 'EXT', 'To be updated', 'YES', 'NO', '2008-12-02 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2826, 'CMON_IMV08_0406', 'Pare choc AV - Support lateral (D&G)', 'FRT Bumper - Side support (L&R)', 'Front Face and Hood', 'R1A', 'EXT', 'Approved', 'YES', 'NO', '2008-12-02 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2827, 'CMON_IMV08_0407', 'PARE CHOC AR - SUPPORT LATERAL (D/G)', 'REAR BUMPER - SIDE SUPPORT (L/R)', 'Rear Face and Tailgate', 'R1B', 'EXT', 'Approved', 'YES', 'NO', '2008-12-02 00:00:00', '2024-09-18 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2828, 'CMON_IMV08_0410', 'PARE CHOC AR - RENFORT LATERAL ABSORBEUR D&G', 'L&R ABSORBER SIDE REINFORCEMENT', 'Rear Face and Tailgate', 'R1B', 'EXT', 'To be updated', 'YES', 'NO', '2008-12-02 00:00:00', '2012-04-06 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2829, 'CMON_IMV08_0411', 'CEINTURE AR - RETOUR SANGLE', 'REAR SEATBELT – SEATBELT ANCHOAGE', 'Seats and safety belts', 'U2A', 'ASS', 'Current Update', 'YES', 'YES', '2008-12-02 00:00:00', '2024-08-27 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2830, 'CMON_IMV08_0412', 'HAUT PARLEUR (HP) VOIE CENTRALE SUR PLANCHE DE BORD', 'FACIA PANEL CENT LOUDSPEAKER', 'Engine and Gearbox', 'Z7D', 'EEH', 'Current Update', 'YES', 'NO', '2008-12-18 00:00:00', '2025-01-30 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2831, 'CMON_IMV08_0422', 'PARE CHOC AR - SUPPORT SOUS FEUX D & G', 'RR BUMPER - R & L LIGHT SUPPORTS', 'Rear Face and Tailgate', 'R1B', 'EXT', 'To be updated', 'YES', 'NO', '2008-12-02 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2832, 'CMON_MEM08_0266', 'BRIN BOUCLE CEINTURE SECURITE AR', 'REAR SAFETY BELT BUCKLE END', 'Seats and safety belts', 'U2A', 'ASS', 'Approved', 'YES', 'YES', '2008-09-25 00:00:00', '2021-09-22 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2834, 'DITV_ATAT07_0008', 'BOITIER 4 MAXI FUSIBLE (B4MF)', '4 MAXI FUSE UNIT (B4MF)', 'Harness and ECUs', 'Z9A', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2009-03-19 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2835, 'DITV_ATAT07_0009', 'TAPIS DE COFFRE', 'TRUNK CARPET', 'Interior Trims', 'X5A', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-04-19 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2836, 'DITV_ATAT07_0010', 'Ligne echappement partie froide sur partie chaude', 'Fixing cold part exhaust on hot part', 'Engine and Gearbox Adaptation', 'B21', 'AMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2837, 'DITV_ATAT07_0011', 'GARNITURE SEUIL COFFRE', 'TRUNK THRESHOLD TRIM', 'Interior Trims', 'X5D', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2838, 'DITV_ATAT07_0012', 'BRANCHEMENT FAISCEAUX SUR BSM OU BFRM', 'HARNESS CONNECTION ON BSM OR BFRM', 'Harness and ECUs', 'Z9J', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2014-04-22 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2839, 'DITV_ATAT07_0013', 'ECRANS THERMIQUES ECHAPPEMENT SUR CAISSE', 'EXHAUST HEAT SHIELDS ON BODY', 'Engine and Gearbox Adaptation', 'B21', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2840, 'DITV_ATAT07_0014', 'FILTRE A AIR', 'AIR FILTER', 'Engine and Gearbox Adaptation', 'A26', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2841, 'DITV_ATAT07_0015', 'PARE CHOC AV - ABSORBEUR', 'FRT BUMPER - ABSORBER', 'Front Face and Hood', 'R1A', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2842, 'DITV_ATAT07_0016', 'GARNITURE LEVIER DE VITESSE', 'GEAR SHIFT TRIM', 'Dashboard and console', 'S3B', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2843, 'DITV_ATAT07_0017', 'AMPLIFICATEUR RECEPTEUR RADIO', 'RADIO RECEIVER AMPLIFIER', 'Rear Face and Tailgate', 'Z7A', 'EEH', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2844, 'DITV_ATAT07_0018', 'COLONNE DIRECTION PARTIE INF', 'STEERING COLUMN LOW SIDE', 'Dashboard and console', 'E45', 'DIR', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2023-10-31 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2845, 'DITV_ATAT07_0019', 'TUBES DE FREIN MCT (ENTRE AMCT ET BLOC ABS / ESP)', 'TUBES OF BRAKE MCT (BETWEEN AMRT AND ABS UNIT / ESP)', 'Liaison au sol', 'F63', 'FRN', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-04-08 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2846, 'DITV_ATAT07_0020', 'CABLE DE FREIN A MAIN SUR LEVIER', 'PARKING BRAKE LEVER CABLE', 'Liaison au sol', 'E16', 'FRN', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2847, 'DITV_ATAT07_0021', 'TUYAU AEROTHERME (ENTREE ET SORTIE) SUR TABLIER', 'HEATER RADIATOR PIPE (INPUT OUTPUT) ON FIREWALL', 'Engine and Gearbox', 'V2A/V5C', 'PDC', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2013-04-22 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2848, 'DITV_ATAT07_0022', 'CALCULATEUR COMELEC - COMMANDE ELECTRIQUE DE BVA', 'GEARBOX ELECTRICAL CONTROL', 'Harness and ECUs', 'A36', 'EEM', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2018-01-25 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2849, 'DITV_ATAT07_0023', 'FACADE AVANT TECHNIQUE (FAT) SUR CAISSE - PFA', 'FRONT END ON BODY', 'Front Face and Hood', 'K3H', 'STR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2017-12-20 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2850, 'DITV_ATAT07_0025', 'BOITIER CORRECTEUR D''ASSIETTE AR (CAAR)', 'REAR SELF-LEVELING SYSTEM ECU', 'Harness and ECUs', 'G76', 'HYD', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2851, 'DITV_ATAT07_0026', 'LAVE PROJECTEUR', 'HEADLIGHT CLEANING KIT', 'Front Face and Hood', 'Z6A', 'OUV', 'To be updated ', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2852, 'DITV_ATAT07_0027', 'BRANCHEMENT FAISCEAUX ABR SUR BLOC', 'ABS HARNESS CONNECTION TO UNIT', 'Harness and ECUs', 'F67', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2013-12-02 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2853, 'DITV_ATAT07_0028', 'CAPTEUR CENTRALE INERTIELLE', 'INERTIAL MEASUREMENT UNIT SENSOR', 'Harness and ECUs', 'F6B', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2854, 'DITV_ATAT07_0029', 'DSG - BOITIER DETECTION SOUS GONFLAGE', 'TIRE-PRESSURE MONITORING SYSTEM (TPMS)', 'Harness and ECUs', 'E34', 'LAS', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-03-29 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2855, 'DITV_ATAT07_0030', 'GARNITURE DE VOLET ET DE COFFRE', 'TRIMMING OF TAILGATE AND TRUNK', 'Rear Face and Tailgate', 'X5B', 'INT', 'To be updated ', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2856, 'DITV_ATAT07_0031', 'STTA - UCAP & DMT - CALCULATEUR STOP AND START', 'STTA - UCAP & DMT - STOP AND START CALCULATOR', 'Harness and ECUs', 'A36', 'EEM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2857, 'DITV_ATAT07_0032', 'AFIL - ALERTE FRANCHISSEMENT INVOLONTAIRE DE LIGNE', 'nan', 'Harness and ECUs', 'A36', 'EEM', 'To be updated ', 'YES', 'NO', '2008-06-09 00:00:00', '2017-01-25 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2858, 'DITV_ATAT07_0033', 'BOÎTIER SERVITUDE MULTIFONCTIONNEL ET VEHICULE SUPERVISION MODULE', 'WARING HOUSING MULTIFUNCTIONAL AND VEHICLE SUPERVISION MODULE', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2019-07-02 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2859, 'DITV_ATAT07_0034', 'FAISCEAU PUISSANCE SOUS CAISSE', 'POWER HARNESS UNDER BODY', 'Harness and ECUs', 'Z9K', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2860, 'DITV_ATAT07_0035', 'CABLE FREIN A MAIN - BRIDAGE SUR CAISSE', 'FLANGING CABLES BRAKE HAND ON BODY', 'Liaison au sol', 'F71', 'FRN', 'To be updated ', 'YES', 'NO', '2008-06-09 00:00:00', '2019-06-03 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2861, 'DITV_ATAT07_0036', 'EMBASE CONNECTEUR HV', 'HIGH VOLTAGE CONNECTOR HEADER', 'Battery under body', 'Z1A', 'EEM', 'Approved', 'YES', 'NO', '2022-08-30 00:00:00', '2024-04-19 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2862, 'DITV_ATAT07_0037', 'SERRURE DE CAPOT', 'HOOD LATCH', 'Front Face and Hood', 'N2A', 'EXT', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-06-06 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2863, 'DITV_ATAT07_0038', 'ROUES PRINCIPALES ALU', 'MAIN WHEELS', 'Liaison au sol', 'E31', 'LAS', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-04 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2864, 'DITV_ATAT07_0039', 'BSM - BFRM - BOITIER SERVITUDE MOTEUR / BOITIER FUSIBLE RELAIS MOTEUR', 'ECDU - BFRM - ENGINE CURRENT DISTRIBUTION UNIT / FUSIBLE UNIT RELAY ENGINE', 'Harness and ECUs', 'Z5U', 'AEE', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2865, 'DITV_ATAT07_0040', 'CHARGEUR CD - COFFRE', 'CD LOADER - TRUNK', '', 'Z7A', 'EEH', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2008-11-09 00:00:00', NULL, '2026-04-30 00:02:34.562833', NULL);
INSERT INTO public.fiches VALUES (2866, 'DITV_ATAT07_0041', 'DIFFUSEURS AERATION PDB', 'DASHBOARD AIRVENTS ', 'Dashboard and console', 'V3A', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2867, 'DITV_ATAT07_0044', 'VISIERE DE COMBINE', 'INSTRUMENT VISOR', 'Engine and Gearbox', 'Z4A', 'EEH', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2868, 'DITV_ATAT07_0045', 'GAINE COLONNE', 'SHEATH COLUMN (upper and lower)', 'Dashboard and console', 'S1D', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-01-23 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2869, 'DITV_ATAT07_0046', 'PROTECTEUR SOUS MOTEUR ', 'UNDER ENGINE PROT', 'Under Body', 'K2E', 'STR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-10-30 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2870, 'DITV_ATAT07_0047', 'BARRE PORTE-BAGAGES LONGITUDINALE D / G', 'RH / LH LONGL LUGGAGE RACK ROD', 'Roof and Roof trim', 'R5E', 'STR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-09-06 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2871, 'DITV_ATAT07_0051', 'TWEETER', 'TWEETER and GRID TWEETER', 'nan', 'Z7D', 'EEH', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-14 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2872, 'DITV_ATAT07_0052', 'CHARGEUR DISQUE COMPACT', 'COMPACT DISC LOADER', 'Harness and ECUs', 'Z7A', 'EEH', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-11-06 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2873, 'DITV_ATAT07_0053', 'ANTIVOL DIRECTION', 'STEERING COLUMN LOCK', 'Engine and Gearbox', 'N4A', 'EEH', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-05-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2874, 'DITV_ATAT07_0054', 'GROUPE CLIMATISATION ', 'AIR CONDITIONING GROUP', 'Engine and Gearbox', 'V2A', 'PDC', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-10 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2875, 'DITV_ATAT07_0055', 'BSC BSR BTC - BOITIER SERVITUDE COFFRE', 'BSC BSR BTC - TRUNK RELAY UNIT', 'Harness and ECUs', 'Z5U', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-07-19 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2876, 'DITV_ATAT07_0056', 'BRANCHEMENT FAISCEAUX PARE CHOC AV', 'nan', 'Harness and ECUs', 'Z9M', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2877, 'DITV_ATAT07_0057', 'PROJECTEURS', 'HEADLAMP', 'Front Face and Hood', 'Z2A', 'EXT', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-03-27 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2878, 'DITV_ATAT07_0058', 'SUPPORT BATTERIE', 'BATERY SUPPORT', 'Front Face and Hood', 'Z1C', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-03-21 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2879, 'DITV_ATAT07_0059', 'SUPPORT CONSOLE SUR TUNNEL', 'CONSOLE BRACKET ON TUNNEL', 'Dashboard and console', 'S3A', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2880, 'DITV_ATAT07_0060', 'SAC AR - SYSTEME ABSORPTION CHOC ARRIERE', 'REAR SHOCK ABSORPTION SYSTEM', 'Rear Face and Tailgate', 'R1B', 'EXT', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-05-14 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2881, 'DITV_ATAT07_0061', 'SAC AV SYSTEME ABSORPTION CHOC AV SUPERIEUR', 'FRT BIAS BUMPER IMPACT ABSORTION SYSTEM FRT SUPERIOR', 'Front Face and Hood', 'K3D', 'STR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-29 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2882, 'DITV_ATAT07_0062', 'FIXATION COMPLETE BV SUR MOTEUR_OFFICIELLE.XLS', 'nan', 'Engine and Gearbox', 'nan', '-', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2883, 'DITV_ATAT07_0063', 'BUTEE EMBRAYAGE SUR BVM', 'nan', 'Engine and Gearbox Adaptation', 'C21', 'BVM', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2018-05-30 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2884, 'DITV_ATAT07_0064', 'AIRBAG GENOUX', 'KNEE AIRBAG', 'Engine and Gearbox', 'U1B', 'PDC', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2008-11-17 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2885, 'DITV_ATAT07_0065', 'CIRCUITS AIR SUR CASSETTE (RAS)', 'AIR DUCT ON CASSETTE (RAS)', 'Engine and Gearbox Adaptation', 'A27', 'CMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2886, 'DITV_ATAT07_0066', 'COMMANDE VITESSE HAUTE', 'DASHBOARD MOUNTED GEARSHIFT', 'Engine and Gearbox Adaptation', 'G21', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-04-27 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2887, 'DITV_ATAT07_0068', 'FIXATION COMPLETE BV SUR MOTEUR_OFFICIELLE.XLS', 'nan', 'Engine and Gearbox', 'nan', '-', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2888, 'DITV_ATAT07_0069', 'PARE CHOC AV', 'nan', 'Front Face and Hood', 'R1A', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2889, 'DITV_ATAT07_0070', 'PARE CHOC AR', 'nan', 'Rear Face and Tailgate', 'R1B', 'EXT', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2890, 'DITV_ATAT07_0071', 'BOITIER ELECTRIQUE COMMANDE GMV', 'ELECTRICAL CONTROL BOX MOTORCYCLE FAN GROUP', 'Harness and ECUs', 'B14', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-02-02 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2891, 'DITV_ATAT07_0072', 'BECQUET', 'SPOILER', 'Rear Face and Tailgate', 'R5M', 'EXT', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2892, 'DITV_ATAT07_0073', 'CASSETTE DE REFROIDISSEMENT (MISE EN PLACE)', 'nan', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'To be updated ', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2893, 'DITV_ATAT07_0074', 'CENDRIER', 'ASHTRAY', 'Dashboard and console', 'S1A', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2017-02-17 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2894, 'DITV_ATAT07_0075', 'FACADE CENTRALE', 'CENTER FACADE', 'Dashboard and console', 'S1A', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2895, 'DITV_ATAT07_0076', 'SIEGES', 'nan', 'Seats and safety belts', '?', '-', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2010-07-06 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2896, 'DITV_ATAT07_0078', 'BATTERIE - BRANCHEMENT', 'BATTERY CONNECTION', 'Harness and ECUs', 'ZAA', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2009-01-11 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2897, 'DITV_ATAT07_0079', 'COLONNE DE DIRECTION COMPLETE (regoupe 2 fiches)', 'COMPLETE STEERING COLUMN', 'Liaison au sol', 'E45', 'DIR', 'Current Update', 'YES', 'NO', '00:00:00', '2024-05-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2898, 'DITV_ATAT07_0080', 'ACCOSTAGE BV SUR MOTEUR', 'nan', 'Engine and Gearbox Adaptation', '83F', 'SPR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2899, 'DITV_ATAT07_0082', 'ALTERNATEUR / ALTERNO-DEMARREUR', 'ALTERNATOR ALTERNO-STARTER', 'Engine and Gearbox Adaptation', 'A31', 'EEM', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-05-13 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2900, 'DITV_ATAT07_0083', 'PALIER TRANSMISSION MULTIFONCTIONNEL (SMIF)', 'MULTIPURPOSE BEARING DRIVE LINE (LEM)', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2020-06-17 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2901, 'DITV_ATAT07_0084', 'COMPRESSEUR REFRIGERATION', 'REFRIGERATION COMPRESSOR', 'Engine and Gearbox', 'V5A', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-12-11 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2902, 'DITV_ATAT07_0085', 'BOITIER AFS (FEUX TOURNANTS)', 'ADVANCED FRONTLIGHTING SYSTEM UNIT (AFS/BEMP) (ROTATING BEACON)', 'Harness and ECUs', 'Z2A', 'EXT', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2024-01-22 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2903, 'DITV_ATAT07_0086', 'BOITIER PRE POST CHAUFFAGE BPPCH SUR CAISSE', 'PRE-POST HEATING ECU ON BODY', 'Harness and ECUs', 'B14', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2904, 'DITV_ATAT07_0087', 'SPHERES ELEMENTS PORTEURS AV ET RACCORDEMENTS HYDRAULIQUES', 'nan', 'Liaison au sol', 'E16', 'HYD', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2008-07-04 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2905, 'DITV_ATAT07_0088', 'VOLANT', 'STEERING WHEEL', 'Engine and Gearbox', 'E46', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2906, 'DITV_ATAT07_0089', 'BPCB/BFDB - BOITIER PROTECTION DE CABLE BATTERIE - BOITIER FUSIBLE DEPART BATTERIE', 'BPCB/BFDB - BATTERY CABLE PROTECTION UNIT - BATTERY FUSE BOX', 'Harness and ECUs', 'Z5U', 'AEE', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2014-12-01 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2907, 'DITV_ATAT07_0090', 'GACHE DE PORTE', 'DOOR STRIKER', 'Lateral Face and Doors', 'N1E', 'OUV', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-05-14 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2908, 'DITV_ATAT07_0092', 'SUPPORT MOTEUR INFERIEUR (SMIF)', 'LOWER ENGINE MOUNT (LEM)', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-05-14 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2909, 'DITV_ATAT07_0093', 'DEMONTAGE / REMONTAGE PORTE LATERALE BATTANTE', 'REMOVAL/REFITTING OF HINGED SIDE DOOR', 'Lateral Face and Doors', 'K7F', 'OUV', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-10-10 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2910, 'DITV_ATAT07_0094', 'PARE BRISE', 'WINDSHIELD', 'Front Face and Hood', 'P1A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2013-02-20 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2911, 'DITV_ATAT07_0095', 'LUNETTE FIXE', 'WINDOW', 'Rear Face and Tailgate', 'P1B', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2912, 'DITV_ATAT07_0096', 'SONDE ENSOLEILLEMENT', 'INSOLATION SENSOR', 'Dashboard and console', 'V2K', 'PDC', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-05-15 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2913, 'DITV_ATAT07_0099', 'BOITE DE VITESSES SUR MOTEUR', 'GEARBOX ON ENGINE', 'Engine and Gearbox Adaptation', 'C21', 'BVM', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-29 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2914, 'DITV_ATAT07_0101', 'COMBINE PLANCHE DE BORD ENS', 'FACIA PANEL ENS CLUSTER', 'Engine and Gearbox', 'Z4A', 'EEH', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-22 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2915, 'DITV_ATAT07_0103', 'TOLE FERMETURE BV', 'nan', 'Engine and Gearbox', 'C21', 'BVM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2016-07-11 00:00:00', NULL, '2026-04-30 00:02:34.617927', NULL);
INSERT INTO public.fiches VALUES (2916, 'DITV_ATAT07_0104', 'ENJOLIVEUR SEUIL DE PORTE', 'DOOR THRESHOLD TRIM ', 'Lateral Face and Doors', 'R3E', 'STR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2917, 'DITV_ATAT07_0105', 'ENJOLIVEUR LATERAL PARE BRISE', 'WINDSHIELD SIDE TRIM', 'Front Face and Hood', 'R2A', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2020-09-21 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2918, 'DITV_ATAT07_0107', 'MODULE AUTO ECOLE', 'DRIVING SCHOOL MODULE', '', 'Z2U', 'EEH', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-18 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2919, 'DITV_ATAT07_0108', 'DESIGNATEUR COMMANDE AIDE NAVIGATION', 'NAVIGATION ASSISTANCE CONTROL DESIGNATOR', '', 'Z7H', 'EEH', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2013-07-24 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2920, 'DITV_ATAT07_0109', 'ECRANS AERAULIQUES SOUS CAISSE', 'UNDER BODY AIR DEFLECTOR', '', 'K2E', 'STR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-12-14 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2921, 'DITV_ATAT07_0110', 'PARE BOUE', 'MUD DEFLECTOR', 'Under Body', 'R3N', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-12 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2922, 'DITV_ATAT07_0112', 'BERCEAU', 'CRADDLE', 'Liaison au sol', 'E11', 'LAS', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-19 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2923, 'DITV_ATAT07_0113', 'RACCORD PRISE DEPRESSION FREIN (RPDF) - BRANCHEMENT SUR MOTEUR', 'CONNECTING BVCC ON ENGINE', 'Liaison au sol', 'F62', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2924, 'DITV_ATAT07_0114', 'SUPPORT ECRAN MULTIFONCTIONS', 'MULTIFUNCTION SCREEN SUPPORT', 'Dashboard and console', 'S1A', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-09-17 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2925, 'DITV_ATAT07_0115', 'ENJOLIVEUR ECRAN MULTIFONCTIONS', 'MULTIFUNCTION SCREEN TRIM', 'Dashboard and console', 'S1A', 'PDC', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-25 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2926, 'DITV_ATAT07_0116', 'COM 200X VCCF BVMP - BLOC COMMUTATEUR MULTIFONCTION', 'COM 200X VCCF BVMP - MULTIFONCTION SWITH UNIT', 'Engine and Gearbox', 'Z5T', 'EEH', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2023-11-06 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2927, 'DITV_ATAT07_0118', 'CACHE MOTEUR', 'ENGINE COVER', 'Engine and Gearbox', 'A82', 'ARM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-06-14 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2928, 'DITV_ATAT07_0119', 'ACTIONNEUR COMMANDE DE VITESSE SUR BOITE PILOTEE', 'nan', 'Engine and Gearbox', 'C29', 'EBA', 'Approved ', 'YES', 'NO', '2008-06-09 00:00:00', '2018-05-30 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2929, 'DITV_ATAT07_0120', 'ACTIONNEUR COMMANDE EMBRAYAGE (BOITE PILOTEE)', 'nan', 'Engine and Gearbox', 'C15', 'BVM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-28 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2930, 'DITV_ATAT07_0121', 'RECHAUFFEUR ADDITIONNEL CIRCUIT EAU MOTEUR', 'ADDITIONAL ENGINE WATER HEATER ', 'Engine and Gearbox', 'V2J', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2019-06-03 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2931, 'DITV_ATAT07_0123', 'CANALISATIONS-CARBURANT-ET-VAPEUR-ESSENCE', 'nan', 'Engine and Gearbox Adaptation', 'nan', '-', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2932, 'DITV_ATAT07_0125', 'COL ENTREE AIR', 'AIR INLET NECK', 'Engine and Gearbox Adaptation', 'A26', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2020-06-17 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2933, 'DITV_ATAT07_0126', 'CANALISATION DA SUR BOCAL LDS OU GEP', 'PWR-STEERING-PIPE-TO-STEERING-FLUID/ELECTRIC-PUMP-BOTTLE', 'Liaison au sol', 'E42', 'DIR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-03-10 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2934, 'DITV_ATAT07_0127', 'PARE CHOC AR  - SUPPORT CENTRAL', 'RR BUMPER - ABSORBER', 'Rear Face and Tailgate', 'R1B', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2935, 'DITV_ATAT07_0128', 'ECLAIREUR PLAQUE DE POLICE', 'LICENSE PLATE LAMP', 'Rear Face and Tailgate', 'Z2G', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2936, 'DITV_ATAT07_0129', 'VIDE POCHE PLANCHE DE BORD', 'STOWAGE ON THE DASHBOARD', 'Dashboard and console', 'S1E', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-09-20 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2937, 'DITV_ATAT07_0130', 'CANALISATIONS CARBURANT', 'CONNEXION FUEL PIPING', 'Engine and Gearbox Adaptation', 'B32', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2938, 'DITV_ATAT07_0132', 'REPETITEURS LATERAUX', 'SIDE REPEATERS', 'Lateral Face and Doors', 'Z2E', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-09 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2939, 'DITV_ATAT07_0133', 'CAPTEURS CIRCUITS AIR ADMISSION', 'nan', 'Engine and Gearbox Adaptation', 'A37', 'EEM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-05-09 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2940, 'DITV_ATAT07_0134', 'JAUGE HUILE ELECTRIQUE', 'nan', 'Engine and Gearbox', 'A35', 'EEM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-02-16 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2941, 'DITV_ATAT07_0135', 'PRISE TACHYMETRE OU OBTURATEUR', 'nan', '', 'C23', 'BVM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-06-25 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2942, 'DITV_ATAT07_0137', 'ACCOUDOIR CONSOLE', 'nan', 'Dashboard and console', 'S3A', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2011-12-07 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2943, 'DITV_ATAT07_0140', 'ENJOLIVEURS BAS DE CAISSE', 'LOWER BODY TRIM', 'Lateral Face and Doors', 'R3E', 'STR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2017-09-12 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2944, 'DITV_ATAT07_0141', 'SONDE OXYGENE', 'nan', '', 'A37', 'EEM', 'Approved ', 'YES', 'NO', '2008-06-09 00:00:00', '2014-02-06 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2945, 'DITV_ATAT07_0142', 'DEMARREUR', 'STARTER', 'Engine and Gearbox', 'A32', 'EEM', 'Approved ', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2946, 'DITV_ATAT07_0143', 'RUPTEUR CAPOT ALARME', 'HOOD BREAKER ALARM', 'Front Face and Hood', 'Z8C', 'EEH', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2017-08-31 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2947, 'DITV_ATAT07_0148', 'BUTEE HYDRAULIQUE (CSC) MONTEE EN UM', 'nan', 'Engine and Gearbox Adaptation', 'G32', 'ATR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-28 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2948, 'DITV_ATAT07_0149', 'TUYAU MISE EN CHARGE SUR BOITE DE DEGAZAGE', 'CONNEXION & FLANGING PIPE LOADING ON DEGASSING', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2949, 'DITV_ATAT07_0150', 'TUYAU DE DEGAZAGE SUR RADIA ET BOITE DE DEGAZAGE', 'CONNECTION & FLANGING DEGASSING TUBE ON RADIATOR', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2013-07-22 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2950, 'DITV_ATAT07_0153', 'TUYAU EAU ENTREE SORTIE AEROTHERME', 'AEROTHERM INLET/OUTLET WATER PIPE ON APRON', 'Engine and Gearbox Adaptation', 'V5C', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2019-07-29 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2951, 'DITV_ATAT07_0155', 'IMPACTEUR GMP THERMIQUE', 'THERMAL PWT IMPACTOR', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-11-03 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2952, 'DITV_ATAT07_0156', 'CAPTEUR DE REGIME MOTEUR ET OU POINT MORT HAUT', 'nan', '', 'A37', 'EEM', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-08 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2953, 'DITV_ATAT07_0157', 'ARRÊT GAINE CABLE COMMANDE VITESSE', 'SPEED CONTROL CABLE SHEATH STOP  CMP & EMP2', 'Engine and Gearbox', 'G22', 'ATR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-04-14 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2954, 'DITV_ATAT07_0158', 'ECRAN VIDEO TACTILE', 'DISPLAY VIDEO SCREEN', 'Engine and Gearbox', 'Z7G', 'EEH', 'Current Update', 'YES', 'NO', '2022-02-27 00:00:00', '2024-11-22 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2955, 'DITV_ATAT07_0159', 'AVERTISSEUR SONORE', 'HORN LOW NOTE', 'Harness and ECUs', 'Z3A', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-11-28 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2956, 'DITV_ATAT07_0161', 'FEUX AR SUR VOLET', 'TAILGATE LIGHTS', 'Rear Face and Tailgate', 'Z2F', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-10-01 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2957, 'DITV_ATAT07_0162', 'FAISCEAU BVMP - BOITE DE VITESSE MANUELLE PILOTEE', 'PILOTED MANUAL GEARBOX', 'Harness and ECUs', 'ZAK', 'AEE', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-01-25 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2958, 'DITV_ATAT07_0163', 'BIELLETTE DE DIRECTION AV SUR PIVOT', 'STEERING CONNECTING ROD ON ARTICULATIONS', 'Liaison au sol', 'E44', 'DIR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-11-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2959, 'DITV_ATAT07_0164', 'PALIER TRANSMISSION (NON MULTIFONCTIONNEL)', 'BEARING DRIVE LINE (NONMULTIPURPOSE)', 'Liaison au sol', 'C71', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-07-13 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2960, 'DITV_ATAT07_0166', 'SUPPORT GAUCHE MOTEUR ELECTRIQUE', 'LEFT ELECTRIC ENGINE BRACKET', 'Engine and Gearbox Adaptation', 'D31', 'ATR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2961, 'DITV_ATAT07_0167', 'RACCORDS ECHANGEUR EAU HUILE', 'AIR WATER EXCHANGER CONNECTORS', 'Engine and Gearbox Adaptation', 'B13', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2962, 'DITV_ATAT07_0168', 'TUYAUX PRESSION ENTREE & SORTIE FAP', 'PRESSURE PIPES INLET & OUTLET PARTICLE FILTER', 'Engine and Gearbox Adaptation', 'B21', 'AMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2963, 'DITV_ATAT07_0169', 'ROUE DE SECOURS CRIC', 'SPARE WHEEL JACK', 'Liaison au sol', 'E32', 'LAS', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-06-02 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2964, 'DITV_ATAT07_0170', 'COMMANDES REGULATION SUSPENSION AR', 'nan', 'Liaison au sol', 'G76', 'HYD', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2965, 'DITV_ATAT07_0172', 'MISE EN PLACE COURROIES ENTRAINEMENT ACCESSOIRES', 'nan', 'Engine and Gearbox', 'A18', 'ARM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-06-27 00:00:00', NULL, '2026-04-30 00:02:34.663221', NULL);
INSERT INTO public.fiches VALUES (2966, 'DITV_ATAT07_0173', 'EQUERRE RENFORT COLLECTEUR ADMISSION', 'nan', '', 'A21', 'CMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-06-27 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2967, 'DITV_ATAT07_0174', 'RACCORD AVEC VIS DE PURGE SUR BUTEE HYDRAULIQUE D’EMBRAYAGE (CSC)', 'CONNECTION BLEEDER SCREW ON CSC', 'Engine and Gearbox Adaptation', 'G32', 'ATR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2968, 'DITV_ATAT07_0175', 'PILOTAGE DE LA VANNE EGR', 'nan', '', 'A39', 'EEM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-14 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2969, 'DITV_ATAT07_0178', 'RESERVE DE VIDE SUR MOTEUR', 'nan', '', 'A39', 'EEM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-09 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2970, 'DITV_ATAT07_0179', 'COMMUTATION (PUSHS - BARRETTE DE PUSHS - JOYSTICK, MOLETTE,…)', 'COMMUTATION (BUTTONS - BAR OF BUTTONS - JOYSTICK, SELECTION KNOB,…)', 'Dashboard and console', 'Z2U', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-11-23 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2971, 'DITV_ATAT07_0180', 'CAPTEUR ULTRASON POUR ALARME', 'nan', 'Harness and ECUs', 'Z8C', 'EEH', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2972, 'DITV_ATAT07_0181', 'CHARNIERE CAPOT - FERRAGE', 'STRIKE_HOOD - BIW', 'Front Face and Hood', 'K7B', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2022-10-06 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2973, 'DITV_ATAT07_0182', 'ELEMENT ELASTIQUE DE SUSPENSION GMP (BIELLETTE ANTICOUPLE) ', 'POWER TRAIN ELASTIC SUSPENSION ELEMENT ON SUB FRAME', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-09-23 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2974, 'DITV_ATAT07_0183', 'ELEMENT ELASTIQUE DE SUSPENSION GMP SUR MOTEUR', 'POWER TRAIN ELASTIC SUSPENSION ELEMENT ON ENGINE', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2014-04-22 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2975, 'DITV_ATAT07_0184', 'CHARNIERE DE VOLET', 'TAILGATE HINGE', 'Rear Face and Tailgate', 'K7C', 'EXT', 'Current Update', 'YES', 'YES', '2008-06-09 00:00:00', '2025-05-28 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2976, 'DITV_ATAT07_0186', 'CAPTEUR CIRCUITS EAU HUILE ET CARBURANT', 'nan', '', 'A36', 'EEM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-05-31 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2977, 'DITV_ATAT07_0187', 'ECRAN THERMIQUE SUR CIRCUIT D HUILE', 'OIL CIRCUIT HEAT SHIELD', 'nan', 'B13', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2978, 'DITV_ATAT07_0188', 'COMMANDES REGULATION SUSPENSION AV', 'nan', '', 'G76', 'HYD', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-29 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2979, 'DITV_ATAT07_0190', 'FONCTION COMELEC - ACTIONNEUR ET SUPPORT', 'nan', 'Engine and Gearbox Adaptation', 'C29', 'EBA', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-02-26 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2980, 'DITV_ATAT07_0192', 'VANNE ET TUYAU REASPIRATION VAPEURS HUILE', 'RETURN PIPE OIL VAPOUR', 'Engine and Gearbox', 'A42', 'CMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-14 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2981, 'DITV_ATAT07_0193', 'APPROVISIONNEMENT BERCEAU', 'nan', 'Liaison au sol', 'E11', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-09-25 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2982, 'DITV_ATAT07_0195', 'ECRANS THERMIQUES SUR ELEMENTS ELECTRIQUES', 'HEATSHIELDS ON ELECTRICAL ITEMS', '', 'C23', 'BVM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-21 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2983, 'DITV_ATAT07_0196', 'CAPTEUR - PRESENCE D''EAU DANS GAZOLE', 'nan', 'Engine and Gearbox Adaptation', 'A24', 'CMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-08 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2984, 'DITV_ATAT07_0197', 'CALCULATEUR BOITE DE VITESSE SUR GMP', 'POWER TRAIN GEARBOX CALCULATOR', 'Harness and ECUs', 'C26', 'EBA', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2016-10-14 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2985, 'DITV_ATAT07_0198', 'ECRAN THERMIQUE SUR MECANISME DE DIRECTION', 'STEERING MECHANISM THERMAL SCREEN', 'Liaison au sol', 'E41', 'DIR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2020-12-17 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2986, 'DITV_ATAT07_0199', 'APPROVISIONNEMENT TRAIN AR', 'nan', 'Liaison au sol', 'E21', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-12 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2987, 'DITV_ATAT07_0200', 'APPROVISIONNEMENT BLOC ABS ESP', 'nan', 'Liaison au sol', 'F67', 'FRN', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2988, 'DITV_ATAT07_0201', 'TUBES DE FREIN MEP AV RACCORD AVAR SUR BLOC', 'FRT MEP BRAKE PIPES RRFRTCONNECTOR ON UNIT', 'Liaison au sol', 'F63', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-03-17 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3064, 'DPTA_DMOV05_0937', 'BRANCHEMENT SERRURE', 'DOOR LOCK CONNECTOR', 'Lateral Face and Doors', 'N1E', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (2989, 'DITV_ATAT07_0202', 'CANALISATION FREIN SOUS CAISSE SUR FLEXIBLE DE FREIN AR', 'CONNECTION PIPE BRAKE UNDER BODY ON RR FLEXIBLE BRAKE HOSE', 'Liaison au sol', 'F63', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-04-16 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2990, 'DITV_ATAT07_0203', 'CANALISATION FREIN AV SUR FLEXIBLE FREIN AV', 'CONNECTION PIPE FRT BRAKE ON FLEXIBLE FRT BRAKE', 'Liaison au sol', 'F63', 'FRN', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2017-11-14 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2991, 'DITV_ATAT07_0204', 'CANALISATIONS DA SUR MECANISME (DIRECTION HYDRAULIQUE)', 'POWER STEERING PIPELINES ON MECHANISM (HYDRAULIC STEERING)', 'Engine and Gearbox Adaptation', 'E42', 'DIR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2992, 'DITV_ATAT07_0205', 'CALCULATEUR KML (KIT MAINS LIBRES), BOITIER NOMADE (USBBOX), MDS (MODULE DE SERVICE)', 'HFK (HANDS-FREE KIT), USB BOX, SERVICE MODULE', 'Harness and ECUs', 'Z9A', 'AEE', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2017-05-15 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2993, 'DITV_ATAT07_0206', 'FAISCEAU MOTEUR', 'ENGINE HARNESS', 'Harness and ECUs', 'Z9J', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2994, 'DITV_ATAT07_0207', 'CABLE NEGATIF BATTERIE', 'BATTERY NEGATIVE CABLE ', 'Harness and ECUs', 'Z9A', 'AEE', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2020-12-17 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2995, 'DITV_ATAT07_0208', 'CABLE POSITIF BATTERIE', 'POWER HARNESS - POSITIVE BATTERY CABLES', 'Harness and ECUs', 'Z9A', 'AEE', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2020-10-27 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2996, 'DITV_ATAT07_0210', 'CAPTEUR PRESSION DELTA P FAP SUR BERCEAU', 'DELTA P PARTICULAR FILTER (FAP) PRESSURE SENSOR', 'Engine and Gearbox', 'A37', 'EEM', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2020-09-16 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2997, 'DITV_ATAT07_0211', 'SONDES ET CAPTEURS DEPOLLUTION', 'nan', 'Engine and Gearbox Adaptation', 'A37', 'EEM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-10-29 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2998, 'DITV_ATAT07_0212', 'ELECTROVANNES SUR GMP', 'nan', '', 'A39', 'EEM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-02-16 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (2999, 'DITV_ATAT07_0213', 'TRIANGLE SUSPENSION  AV (G&D)', 'FRONT SUSPENSION TRIANGLE (L&R)', 'Liaison au sol', 'E12', 'LAS', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-12 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3000, 'DITV_ATAT07_0214', 'RACCORDS SORTIE AIR SUR TURBO', 'AIR INLET/OUTLET ON TURBO CONNECTORS', 'Engine and Gearbox Adaptation', 'A27', 'CMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-12-20 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3001, 'DITV_ATAT07_0215', 'ECRAN THERMIQUE SUR ELEMENTS RAPPORTES', 'nan', 'Engine and Gearbox Adaptation', 'A31', 'EEM', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-05-18 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3002, 'DITV_ATAT07_0218', 'GUIDE JAUGE (DW12B)', 'GAUGE GUIDE (DW12B)', 'Engine and Gearbox', 'A15', 'ARM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2016-10-10 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3003, 'DITV_ATAT07_0219', 'BOITIER ELECTRONIQUE CONTROLE MOTEUR', 'ENGINE CLTRL ELECTRONIC CASE', 'Harness and ECUs', 'A36', 'EEM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-11-29 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3004, 'DITV_ATAT07_0224', 'EQUERRE RENFORT TUBE AV', 'FRT TUBE REINFORCEMENT BRACKET', 'Engine and Gearbox Adaptation', 'B21', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2008-07-04 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3005, 'DITV_ATAT07_0225', 'MECANISME DE DIRECTION', 'STEERING MECHANISM', 'Liaison au sol', 'E45', 'DIR', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-25 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3006, 'DITV_ATAT07_0226', 'ECRAN THERMIQUE SUR ECHAPPEMENT (PRE CATA)', 'HEAT SHIELD ON EXHAUST (PRE-CAT CONVERTER)', '', 'A41', 'CMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2016-12-20 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3007, 'DITV_ATAT07_0230', 'FAISCEAU PLANCHE DE BORD', 'DASHBOARD HARNESS', 'Harness and ECUs', 'Z9N', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3008, 'DITV_ATAT07_0231', 'TUYAUTERIE AV CATALYSEUR', 'FRT PIPING CATALYST ', 'Engine and Gearbox Adaptation', 'B21', 'EEM', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3009, 'DITV_ATAT07_0235', ' SONDE LIGNE D''ECHAPPEMENT', 'EXHAUST LINE PROBES', 'Engine and Gearbox Adaptation', 'A37', 'EEM', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-08-30 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3010, 'DITV_ATAT07_0237', 'BOITIER ADML - ACCES DEMARRAGE MAIN LIBRE', 'ASHF COMPUTER - HANDS-FREE STARTING ACCESS', 'Harness and ECUs', 'Z8G', 'EEH', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3011, 'DITV_ATAT07_0238', 'TRANSMISSION SUR PALIER INTERMEDIAIRE', 'TRANSMISSION ON INTERMEDIATE BEARING', 'Liaison au sol', 'C71', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-11-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3012, 'DITV_ATAT07_0239', 'MISE EN PLACE RESERVOIR CARBURANT', 'nan', 'Engine and Gearbox Adaptation', 'B31', 'AMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3013, 'DITV_ATAT07_0240', 'TUYAU DE DEGAZAGE - RACCORD ET BRIDAGE', 'DEGASSING TUBE - CONNECTION AND FLANGING', 'Engine and Gearbox Adaptation', 'B31', 'AMO', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-10-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3014, 'DITV_ATAT07_0241', 'ENJOLIVEUR MONTANT DE BAIE', 'WINDSHIELD APERTURE PILLAR TRIM', 'Interior Trims', 'R2B', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-06-06 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3015, 'DITV_ATAT07_0243', 'DIVERSES CANALISATIONS D''EAU (CHAUFFAGE ADDITIONNEL…) / CIRCUITS EAU + AIR', 'VARIOUS WATER PIPES (EXTRA HEATING…)', 'Engine and Gearbox Adaptation', 'V2J', 'PDC', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.71363', NULL);
INSERT INTO public.fiches VALUES (3016, 'DITV_ATAT07_0244', 'RESERVE DE VIDE SUR VEHICULE', 'VACUUM RESERVE ON VEHICLE', 'Engine and Gearbox Adaptation', 'A38', 'EEM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-11-06 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3017, 'DITV_ATAT07_0245', 'SUPPORT ACCESSOIRES', 'ACCESSORY SUPPORTS', 'Engine and Gearbox', 'A18', 'ARM', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-27 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3018, 'DITV_ATAT07_0246', 'GALET TENDEUR GALET ENROULEUR', 'IDLER & TENSIONER ROLLERS', 'Engine and Gearbox', 'A18', 'ARM', 'Current Update ', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-27 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3019, 'DITV_ATAT07_0247', 'ECRAN THERMIQUE ECHAPPEMENT COTE MOTEUR', 'EXHAUST HEAT SHIELD MOTOR SIDE', 'Engine and Gearbox', 'B21', 'AMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3020, 'DITV_ATAT07_0248', 'PROTECTEURS (FILTRE A GAZOLE, ALTERNATEUR,...)', 'nan', 'Engine and Gearbox', 'A24', 'CMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-12 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3021, 'DITV_ATAT07_0255', 'AMORTISSEUR AR SUR TRAIN PF2 RG30', 'nan', 'Liaison au sol', 'E25', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-01-11 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3022, 'DITV_ATAT07_0256', 'AILES AV - FERRAGE', 'FRONT WINGS - BIW', 'Front Face and Hood', 'K3C', 'EXT', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2020-06-17 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3023, 'DITV_ATAT07_0257', 'ECRANS THERMIQUES SUR SMIF', 'SMIF HEAT SHIELDS', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3024, 'DITV_ATAT07_0258', 'FLEXIBLE FREIN AV', 'FRT BRAKE FLEXIBLE', 'Liaison au sol', 'F63', 'FRN', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-09-17 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3025, 'DITV_ATAT07_0259', 'FLEXIBLE FREIN AR', 'RR BRAKE HOSE', 'Liaison au sol', 'F63', 'FRN', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-12-06 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3026, 'DITV_ATAT07_0261', 'ECRANS THERMIQUES ECHAPPEMENT RESERVOIR MEP', 'nan', 'Engine and Gearbox Adaptation', '?', '-', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-12 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3027, 'DITV_ATAT07_0262', 'CAPTEUR VITESSE ROUE AR', 'REAR WHEEL SPEED SENSOR', 'Liaison au sol', 'F68', 'FRN', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-05-02 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3028, 'DITV_ATAT07_0263', 'RACCORD ENTREE ET SORTIE RADIATEUR SUR RADIATEUR', 'BLENDING ENTRY & EXIT ON RADIATOR', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2022-06-13 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3029, 'DITV_ATAT07_0265', 'BARRE ANTI DEVERS AV', 'FRONT ANTI ROLL BAR', 'Liaison au sol', 'E15', 'LAS', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2023-10-25 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3030, 'DITV_ATAT07_0266', 'ELEMENT PORTEUR AV SUR PIVOT', 'FRT BEARING PART ON PIVOT', 'Liaison au sol', 'E14', 'LAS', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-30 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3031, 'DITV_ATAT07_0267', 'BIELLETTE BARRE ANTI DEVERS AV', 'FRONT ANTI ROLL BAR LINK', 'Liaison au sol', 'E15', 'LAS', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-05-08 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3032, 'DITV_ATAT07_0268', 'ENSEMBLE DE SUSPENSION AVANT TRIANGULAIRE', 'FRT WISHBONE SUSPENSION ENS', 'Liaison au sol', 'E12', 'LAS', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2025-04-28 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3033, 'DITV_ATAT07_0269', 'SUSPENTE ECHAPPEMENT', 'MOUNTING EXHAUST HANGER ON BODY', 'Engine and Gearbox Adaptation', 'B21', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3034, 'DITV_ATAT07_0274', 'BARRE ANTI DEVERS AR', 'REAR ANTI ROLL BAR', 'Liaison au sol', 'E15', 'LAS', 'Current Update', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-26 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3035, 'DITV_ATAT07_0276', 'TUYAU REFRIGERATION COMPRESSION', 'COMPRESSION REFRIGERATION PIPE', 'Front Face and Hood', 'V5D', 'AMO', 'Applicable', 'YES', 'YES', '2008-06-09 00:00:00', '2024-12-12 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3036, 'DITV_ATAT07_0278', 'POMPE DA OU TANDEM', 'POWER STEERING PUMP OR TANDEM', 'Liaison au sol', 'E42', 'DIR', 'To be updated', 'YES', 'NO', '2007-11-12 00:00:00', '2008-07-04 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3037, 'DITV_ATAT07_0279', 'SUPPORT ENROULEUR CEINTURE PIED MILIEU', ' REEL SUPPORT SEAT BEAT B PILLAR  ', 'Seats and safety belts', 'K4A', 'STR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3038, 'DITV_ATAT07_0280', 'SUPPORT BIELLETTES ANTI COUPLE VERTICALES (SUR MOTEUR ET SUR CAISSE) ', 'ANTI VERTICAL TORQUE LINK SUPPORT (ON ENGINE AND BODY)', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2014-01-23 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3039, 'DITV_ATAT07_0281', 'CANALISATIONS HYDRAULIQUES (NAPPES)', 'nan', 'Engine and Gearbox Adaptation', 'G54', 'HYD', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-29 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3040, 'DITV_ATAT07_0282', 'CABLES COMMANDE VITESSE SUR BOITE', 'GEARSHIFT CABLES ON GEARBOX', 'Engine and Gearbox Adaptation', 'G22', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3041, 'DITV_ATAT07_0284', 'BOITIER FSE FREIN DE STATIONNEMENT (OU SECONDAIRE) ELECTRIQUE', 'ELECTRIC PARKING BRAKE (OR SECONDARY) ECU', 'Harness and ECUs', 'F71', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2011-08-30 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3042, 'DITV_ATAT07_0285', 'INSONO SOUS CAPOT', 'BONNET SOUND DEADENING', 'Front Face and Hood', 'X1B', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-04-27 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3043, 'DITV_ATAT07_0286', 'CAPTEUR HAUTEUR CAISSE SUSPENSION AMVAR AMMORTISSEMENT VARIABLE', 'nan', 'Liaison au sol', 'G76', 'HYD', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-07-02 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3044, 'DITV_ATAT07_0287', 'CAPTEUR HAUTEUR DE CAISSE CAAR CORRECTEUR D’ASSIETTE ARRIERE', 'nan', 'Liaison au sol', 'G76', 'HYD', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-07-02 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3045, 'DITV_ATAT07_0289', 'PROTECTEUR DISQUE AV', 'FRONT DISC PROTECTOR', 'Liaison au sol', 'F21', 'FRN', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-17 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3046, 'DITV_ATAT07_0290', 'DISQUE FREIN AR', 'RR BRAKE DISK', 'Liaison au sol', 'F31', 'FRN', 'Approved', 'YES', 'NO', '2021-02-04 00:00:00', '2023-07-21 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3047, 'DITV_ATAT07_0293', 'CIRCUIT REFROIDISSEUR DA', 'POWER STEERING COOLING CIRCUIT', 'Liaison au sol', 'E42', 'DIR', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-10-18 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3048, 'DITV_ATAT07_0294', 'RESERVOIR ADDITIF', 'ADDITIVE RESERVOIR', 'Engine and Gearbox Adaptation', 'B41', 'SPR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-03 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3049, 'DITV_ATAT07_0295', 'CSS - CALCULATEUR SUPERVISEUR SUSPENSION', 'CSS - SUSPENSION CONTROL CALCULATOR ', 'Harness and ECUs', 'G76', 'HYD', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2018-03-05 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3050, 'DITV_ATAT07_0296', 'PARE CHOC AR ASSEMBLE SOUS CAISSE SUR PANNEAU AR', 'FRT & RR BUMPER - LOWER MOUNT', 'Rear Face and Tailgate', 'R1A', 'EXT', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2017-05-30 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3051, 'DITV_ATAT07_0297', 'ECRAN SOUS MOTEUR (ESM)', 'SHIELD UNDER ENGINE', 'Under Body', 'X1C', 'AMO', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-15 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3052, 'DITV_ATAT07_0298', 'EMBLEME & MONOGRAMMES', 'EMBLEM & BADGES', 'Rear Face and Tailgate', 'R5D', 'EXT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-12-22 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3053, 'DITV_ATAT08_0018', 'GACHE-OUVRANT-AR_OFFICIELLE.XLS', 'nan', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3054, 'DITV_ATAT08_0019', 'JOINT DE JET D''EAU', 'DOOR WEATHERSTRIP', 'Lateral Face and Doors', 'W2A', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-04-13 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3055, 'DITV_ATAT08_0020', 'COL-D ENTREE-D AIR_OFFICIELLE.XLS', 'nan', '', 'nan', '-', 'Cancelled', 'YES', 'NO', '2008-07-29 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3056, 'DITV_ATAT08_0021', 'RACCORDS ENTREE ET SORTIE RADIATEUR', 'nan', '', 'B12', 'AMO', 'Cancelled', 'YES', 'NO', '2008-07-29 00:00:00', '2022-06-13 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3057, 'DITV_CMON08_0322', 'BTA - BOITIER TELEMATIQUE AUTONOME', 'BTA AUTONOMOUS TELEMATIC UNIT', 'Harness and ECUs', 'Z7G', 'EEH', 'Applicable', 'YES', 'NO', '2008-09-25 00:00:00', '2022-12-12 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3058, 'DITV_CMON08_0323', 'BRIN BOUCLE AR', 'nan', 'Seats and safety belts', 'U2A', 'ASS', 'Cancelled', 'YES', 'NO', '2008-09-25 00:00:00', '2010-11-10 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3059, 'DITV_CMON08_0585', 'PLAQUE PASSE GAINE, AEROTHERME', 'AIR CONDITIONING AND HEATER MATRIX ON FIREWALL', 'Engine and Gearbox', 'V2A', 'PDC', 'Applicable', 'YES', 'YES', '2008-12-22 00:00:00', '2024-09-03 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3060, 'DITV_CMON08_0587', 'PARE CHOC AV - CALANDRE', 'FRT BUMPER - GRILLE', 'Front Face and Hood', 'R3L', 'EXT', 'Applicable', 'YES', 'NO', '2008-12-22 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3061, 'DMOV_STRP06_1449', 'ENJOLIVEUR PAVILLON (JONCS LONGS ET COURT) ', 'ROOF TRIM (LONG AND SHORT )', 'Roof and Roof trim', 'R3C', 'STR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3062, 'DMOV_STRP06_1458', 'FAISCEAU-PUISSANCE-SOUS-CAISSE_OFFICIELLE.XLS', 'nan', 'Harness and ECUs', 'nan', '-', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-18 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3063, 'DPMO_DIR07_0008', 'TUYAU EAU ENTREE SORTIE RADIATEUR COTE RADIATEUR ', 'RADIATOR INLET AND OUTLET WATER PIPE RADIATOR SIDE', 'Engine and Gearbox Adaptation', 'V5B', 'AMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3065, 'DPTA_DMOV05_0938', 'COULISSE', 'GLASS CHANNEL', 'Lateral Face and Doors', 'W2B', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2013-09-17 00:00:00', NULL, '2026-04-30 00:02:34.758056', NULL);
INSERT INTO public.fiches VALUES (3066, 'DPTA_DMOV05_0942', 'FEUILLE ETANCHEITE de PORTE', 'DOOR SEALING SHEET', 'Lateral Face and Doors', 'W2A', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3067, 'DPTA_DMOV05_0955', 'PROTECTEUR DE PORTE', 'PROTECTOR LOWER DOOR ', 'Lateral Face and Doors', 'R3D', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2020-06-17 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3068, 'DPTA_DMOV05_0956', 'ENJOLIVEUR INT GOUSSET PORTE', 'INTERIOR FINISHER GUSSET DOOR', 'Lateral Face and Doors', 'X4C', 'INT', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-04-24 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3069, 'DPTA_DMOV05_0963', 'VERROU NON INTEGRE A LA COE', 'nan', 'Lateral Face and Doors', 'N4B', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-11-02 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3070, 'DPTA_DMOV05_0964', 'MANIVELLE LEVE VITRE PORTE LVM', 'DOOR GLASS LIFT LEVER', 'Lateral Face and Doors', 'N5A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-01-22 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3071, 'DPTA_DMOV05_0966', 'ROTULE EQUILIBREUR VOLET AR', 'RR FLAP STABILIZER BALL', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-02-20 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3072, 'DPTA_DMOV05_0968', 'BUTEE OUVRANT AR', 'RR DOOR END STOP', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-11-09 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3073, 'DPTA_DMOV05_0980', 'GUIDE COULISSE PORTE AV/AR', 'FRT/RR DOOR CHANNEL GUIDE', 'Lateral Face and Doors', 'N5B', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-11-21 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3074, 'DPTA_DMOV05_0997', 'INSONO TABLIER COTE HABITACLE', 'PASSENGER COMPARTMENT SIDE FIREWALL SOUNDPROOFING ', 'Interior Trims', 'X2B', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2021-02-04 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3075, 'DPTA_DMOV05_0998', 'INSONO TABLIER COTE MOTEUR', 'BULKHEAD SOUNDPROOFING, ENGINE SIDE', 'Front Face and Hood', 'X1A', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2020-09-08 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3076, 'DPTA_DMOV05_1000', 'VITRE MOBILE DE PORTE', 'DOOR GLASS MOBILE', 'Lateral Face and Doors', 'P1C', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-27 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3077, 'DPTA_DMOV05_1002', 'HAUT-PARLEUR WOOFER PORTE AV & AR', 'LOUDSPEAKER WOOFER FR & RR DOOR', 'Lateral Face and Doors', 'Z7D', 'EEH', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-11-04 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3078, 'DPTA_DMOV05_1003', 'COE - COMMANDE D''OUVERTURE EXTERIEURE ', 'nan', 'Lateral Face and Doors', 'N1C', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-11-02 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3079, 'DPTA_DMOV05_1004', 'COI - COMMANDE D''OUVERTURE INTERIEURE', 'INSIDE OPENING/CLOSING CONTROL', 'Lateral Face and Doors', 'N1D', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-10-10 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3080, 'DPTA_DMOV05_1013', 'LECHEUR INTERIEUR', 'DOOR WINDOW WEATHER STRIP', 'Lateral Face and Doors', 'W2D', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2013-09-23 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3081, 'DPTA_DMOV05_1016', 'JOINT AV DE PORTE', 'DOOR FRONT SEAL', 'Lateral Face and Doors', 'W2A', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-04-13 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3082, 'DPTA_DMOV05_1017', 'JOINT PORTE', 'BODY MOUNTED SEAL', 'Lateral Face and Doors', 'W2A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-19 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3083, 'DPTA_DMOV05_1018', 'COMMANDE D''OUVERTURE EXTERIEURE COE / ETRIER EMBASE VERROU ET ENJOLIVEUR', 'COE EXTERNAL DOOR OPENING CONTROL', 'Lateral Face and Doors', 'N1C', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2016-09-08 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3084, 'DPTA_DMOV06_0006', 'MECANISME LEVE VITRE', 'DOOR GLASS-LIFT MECHANISM', 'Lateral Face and Doors', 'N5A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-08 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3085, 'DPTA_DMOV06_0009', 'EMBASE ANTENNE', 'ANTENNA BASE', 'Harness and ECUs', 'Z7B', 'EEH', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-01-19 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3086, 'DPTA_DMOV06_0013', 'ENSEMBLE SERRURE PORTE', 'DOOR LATCH SET', 'Lateral Face and Doors', 'N1E', 'OUV', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-24 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3087, 'DPTA_DMOV06_0014', 'BEQUILLE DE CAPOT', 'HOOD STAY', 'Front Face and Hood', 'N2A', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3088, 'DPTA_DMOV06_0015', 'JOINT ANTI SALISSURES', 'DOOR SILL SEAL', 'Lateral Face and Doors', 'W2A', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3089, 'DPTA_DMOV06_0016', 'ARRET DE PORTE', 'DOOR CHECK STAY', 'Lateral Face and Doors', 'K7F/K7G', 'OUV', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-24 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3090, 'DPTA_DMOV06_0022', 'PLAQUE CONSTRUCTEUR', 'MANUFACTURER’S PLATE', '', 'T3G', 'STR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3091, 'DPTA_DMOV06_0032', 'LECHEUR EXT VITRE PORTE', 'HIDDEN OUTER WAIST BELT', 'Lateral Face and Doors', 'W2C', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3092, 'DPTA_DMOV06_0041', 'TUYAU LAVE GLACE HABITACLE', 'COMPARTMENT WIPER HOSE ', 'Interior Trims', 'Z6C', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3093, 'DPTA_DMOV06_0047', 'COQUILLE RETROVISEUR', 'REAR VIEW MIRROR CASING', 'Lateral Face and Doors', 'R5A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-08-29 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3094, 'DPTA_DMOV06_0053', 'BUTEE DE CAPOT ', 'HOOD STOP', 'Front Face and Hood', 'N2A', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-17 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3095, 'DPTA_DMOV06_0055', 'ENTRETOISE ABSORBEUR CHOC INT PORTE', 'BRACE ABSORBENT SHOCK INT DOOR', 'Lateral Face and Doors', 'T3L', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3096, 'DPTA_DMOV06_0066', 'CABLE-OUVERTURE-CAPOT_OFFICIELLE.XLS', 'nan', 'Front Face and Hood', 'nan', '-', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3097, 'DPTA_DMOV06_0067', 'COMMANDE OUVERTURE FERMETURE MANUELLE CAPOT', 'HOOD OPENING-CLOSING CONTROL ', 'Front Face and Hood', 'N2A', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-02-22 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3098, 'DPTA_DMOV06_0074', 'BOITIER ELECTRONIQUE SAC GONFLABLE', 'AIRBAG ELECTRONIC UNIT', 'Harness and ECUs', 'U4A', 'EEH', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-04-24 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3099, 'DPTA_DMOV06_0075', 'CAPTEUR DETECTION CHOC', 'CRASH DETECTION SENSOR', 'Seats and safety belts', 'U4A', 'EEH', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-24 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3100, 'DPTA_DMOV06_0081', 'VITRE FIXE', 'DOOR FIXED GLAZING', 'Lateral Face and Doors', 'P1C', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-02 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3101, 'DPTA_DMOV06_0082', 'SERRURE OUVRANT AR', 'REAR ACCESS LOCK', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-04-17 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3102, 'DPTA_DMOV06_0087', 'ENJOLIVEUR JET EAU - EXTERIEUR', 'EXTERNAL FINISHER GUSSET & JET WATER', 'Lateral Face and Doors', 'R3A', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2014-03-19 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3103, 'DPTA_DMOV06_0088', 'PLATINE DE PORTE CONDUCTEUR - COMMANDES LEVE VITRE, RETRO,…) ', 'DRIVER WINDOW – MIRROR REGULATOR UNIT', 'Lateral Face and Doors', 'N5E', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2020-02-25 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3104, 'DPTA_DMOV06_0095', 'FAISCEAU HABITACLE & COFFRE', 'PASSENGER COMPARTMENT HARNESS', 'Harness and ECUs', 'Z9S', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3105, 'DPTA_DMOV06_0096', 'FAISCEAU PRINCIPAL', 'MAIN HARNESS', 'Harness and ECUs', 'Z9L', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3106, 'DPTA_DMOV06_0097', 'CABLE ANTENNE COAXIAL (ZONE HABITACLE)', 'RADIO AERIAL CABLE (PASS CPT AREA)', 'Harness and ECUs', 'Z7B', 'EEH', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-07-12 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3107, 'DPTA_DMOV06_0098', 'FAISCEAU PORTE', 'DOOR HARNESS', 'Harness and ECUs', 'Z9R', 'AEE', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-03-26 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3108, 'DPTA_DMOV06_0100', 'ENJOLIVEUR ENCADREMENT DE PORTE - EXTERIEUR', 'FINISHER FRAMING OF DOOR - OUTSIDE', 'Lateral Face and Doors', 'R2D', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-05-22 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3109, 'DPTA_DMOV06_0103', 'FAISCEAU VOLET', 'TAILGATE HARNESS', 'Harness and ECUs', 'Z9P', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3110, 'DPTA_DMOV06_0109', 'GARNITURE DE PAVILLON', 'ROOF TRIM', 'Roof and Roof trim', 'X3B', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-10-13 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3111, 'DPTA_DMOV06_0110', 'JOINT OUVRANT AR', 'RR OPENING SEAL', 'Rear Face and Tailgate', 'W3B', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-04-19 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3112, 'DPTA_DMOV06_0111', 'GARNITURE DE MONTANT DE BAIE ET GARNITURE SUP DE PIED AV', 'A PILLAR TRIM ', 'Interior Trims', 'X3A', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-04-16 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3113, 'DPTA_DMOV06_0112', 'TUBE GUIDE CABLE FREIN A MAIN', 'PARKING BRAKE GUIDE PIPE CABLE', 'Liaison au sol', 'F71', 'FRN', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3114, 'DPTA_DMOV06_0113', 'BRANCHEMENT RETROVISEUR', 'nan', 'Lateral Face and Doors', 'R5A', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3115, 'DPTA_DMOV06_0114', 'JOINT AR DE CAPOT', 'REAR HOOD SEAL', 'Front Face and Hood', 'W3B', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.807601', NULL);
INSERT INTO public.fiches VALUES (3116, 'DPTA_DMOV06_0115', 'GARNITURE DE PIED MILIEU', 'B PILLAR TRIM ', 'Interior Trims', 'X3A', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3117, 'DPTA_DMOV06_0116', 'GARNITURE CUSTODE', 'QUARTER GLASS TRIM', 'Interior Trims', 'X3A', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-02 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3118, 'DPTA_DMOV06_0117', 'CONSOLE PAVILLON ASS', 'ENS ROOF PANEL CONSOLE', 'Roof and Roof trim', 'T2C', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-05-10 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3119, 'DPTA_DMOV06_0119', 'VITRE CUSTODE ', 'QUARTER SLASS', 'Lateral Face and Doors', 'P1D', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-06-03 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3120, 'DPTA_DMOV06_0120', 'TOIT OUVRANT', 'SUNROOF', 'Roof and Roof trim', 'K7D', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-08-30 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3121, 'DPTA_DMOV06_0122', 'AIRBAG RIDEAU', 'CURTAIN AIRBAG', 'Seats and safety belts', 'U1C', 'ASS', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-07-21 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3122, 'DPTA_DMOV06_0123', 'TAPIS & REPOSE PIED ACTIF SI INTEGRE ', ' FIXING CARPET &  REST PAD ACTIVE IF INTEGRATED ', 'Interior Trims', 'X2A', 'INT', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3123, 'DPTA_DMOV06_0124', 'GARNITURE DE LONGERON', 'SIDE RAIL TRIM ', 'Interior Trims', 'X3A', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2022-11-15 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3124, 'DPTA_DMOV06_0125', 'POIGNEE DE MAINTIEN ET RANGE LUNETTE', 'GRAB HANDLE AND GLASSES STORAGE', 'Roof and Roof trim', 'T3A', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-15 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3125, 'DPTA_DMOV06_0129', 'EVACUATION TOIT OUVRANT', 'SLIDING SUNROOF DRAIN', 'Roof and Roof trim', 'W5A', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3126, 'DPTA_DMOV06_0130', 'JOINT D''ENTREE DE PORTES AV AR', 'FRT RR DOORWAY SEALS', 'Lateral Face and Doors', 'W2A', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-06-06 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3127, 'DPTA_DMOV06_0131', 'ENJOLIVEUR PAVILLON JONC COURT', 'nan', 'Roof and Roof trim', 'R3C', 'STR', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-18 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3128, 'DPTA_DMOV06_0132', '3EME FEU STOP', '3RD BRAKE LIGHT', 'Rear Face and Tailgate', 'Z2T', 'EXT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2025-01-29 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3129, 'DPTA_DMOV06_0134', 'PLAFONNIER', 'COURTESY LIGHT', 'Roof and Roof trim', 'Z2K', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-07-17 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3130, 'DPTA_DMOV06_0135', 'PARE SOLEIL', 'SUN VISORS', 'Roof and Roof trim', 'T2A', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-05-13 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3131, 'DPTA_DMOV06_0136', 'MODULE PEDALIER FREIN ', ' BRAKE PEDAL BOX', 'Engine and Gearbox Adaptation', 'G11', 'ATR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3132, 'DPTA_DMOV06_0138', 'CUSTODE FIXE ET FENETRON COLLE', 'FIXED QUARTER PANEL AND NON MOVABLE WINDOW', 'Lateral Face and Doors', 'P1D', 'OUV', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-02-20 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3133, 'DPTA_DMOV06_0139', 'PEDALE ACCELERATEUR ELECTRIQUE', 'ELECTRIC GAS PEDAL', 'Engine and Gearbox', 'G11', 'ATR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-19 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3134, 'DPTA_DMOV06_0140', 'OCCULTEUR CIELO', 'CIELO BLIND', 'Roof and Roof trim', 'P1F', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2016-12-02 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3135, 'DPTA_DMOV06_0144', 'GARNITURE LATERALE DE COFFRE', 'TRUNK SIDE TRIM', 'Interior Trims', 'X5D', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-10-07 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3136, 'DPTA_DMOV06_0145', 'GACHE OUVRANT AR', 'RR OPENING STRIKER', 'Rear Face and Tailgate', 'N2B', 'OUV', 'Approved', 'YES', 'YES', '2008-06-09 00:00:00', '2024-09-17 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3137, 'DPTA_DMOV06_0147', 'LEVIER FREIN A MAIN FSM FREIN SECONDAIRE MECANIQUE', 'PARKING BRAKE LEVER SECONDARY MECHANICAL BRAKE', 'Liaison au sol', 'F71', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-10-24 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3138, 'DPTA_DMOV06_0148', 'CEINTURE AV- ENROULEUR ET RENVOI ', 'FRONT SEAT BELT - REEL AND PILLAR LOOP', 'Seats and safety belts', 'X3B', 'ASS', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-19 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3139, 'DPTA_DMOV06_0149', 'CEINTURE AR - ENROULEUR ET RENVOI', 'REAR SEAT BELT - REEL AND PILLAR LOOP', 'Seats and safety belts', 'X3B', 'ASS', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-06-25 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3140, 'DPTA_DMOV06_0150', 'CEINTURE AV - RETOUR SANGLE', 'FRT SEAT BELT - WEBBING GUIDE', 'Seats and safety belts', 'U1A', 'ASS', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-07-05 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3141, 'DPTA_DMOV06_0151', 'MOTEUR ESSUIE VITRE AR', 'RR WINDOW WIPER MOTOR', 'Rear Face and Tailgate', 'Z6F', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-04-27 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3142, 'DPTA_DMOV06_0152', 'MOTEUR OU MECANISME ESSUIE-VITRE ENS', 'WIPER MOTOR OR MECHANISM ENS', 'Front Face and Hood', 'Z6E', 'OUV', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2021-02-17 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3143, 'DPTA_DMOV06_0153', 'TUYAU LAVE GLACE AV', 'FRT WINDSHIELD WIPER HOSE', 'Front Face and Hood', 'Z6C', 'OUV', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3144, 'DPTA_DMOV06_0154', 'GARNITURE DE TABLETTE AR FIXE (TRI CORPS) ', 'FIXED REAR SHELF TRIM  (SEDAN) ', 'Interior Trims', 'X3D', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2012-04-06 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3145, 'DPTA_DMOV06_0158', 'BOITIER DIVERSITY', 'DIVERSITY BOX', 'Harness and ECUs', 'A36', 'EEM', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3146, 'DPTA_DMOV06_0160', 'RESERVOIR LAVE VITRE', 'WINDSHIELD WASHER RESERVOIR', 'Front Face and Hood', 'Z6B', 'OUV', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3147, 'DPTA_DMOV06_0161', 'COLLECTEUR AUVENT', 'PLENUM CHAMBER', 'Front Face and Hood', 'K3A', 'STR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-04-12 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3148, 'DPTA_DMOV06_0163', 'RESERVOIRS LIQUIDE DIRECTION ET SUSPENSION SUR CAISSE - LDS', 'nan', 'Liaison au sol', 'G54', 'HYD', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3149, 'DPTA_DMOV06_0164', 'SUPPORT GMP DROIT SUR MOTEUR ET BRANCARD', 'RIGHT ENGINE MOUNTING ON ENGINE AND SIDE RAIL ', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2019-04-16 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3150, 'DPTA_DMOV06_0165', 'BRANCHEMENT LUNETTE AR', 'RR WINDOW CONNECTION', 'Rear Face and Tailgate', 'Z6J', 'EEH', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-01-05 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3151, 'DPTA_DMOV06_0168', 'BALAIS ESSUIE VITRE AV', 'FRONT G/W SQUEEGEE ARM', 'Front Face and Hood', 'Z6E', 'OUV', 'Approved ', 'YES', 'NO', '2008-06-09 00:00:00', '2024-01-31 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3152, 'DPTA_DMOV06_0169', 'AMORTISSEUR AR SUR CAISSE (MISE EN PLACE)', 'nan', 'Liaison au sol', 'E25', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-12 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3153, 'DPTA_DMOV06_0170', 'BHI - BOITIER HYDRAULIQUE INTELLIGENT', 'nan', 'Harness and ECUs', 'G54', 'HYD', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3154, 'DPTA_DMOV06_0171', 'ABSORBEUR VAPEUR CARBURANT', ' FUEL VAPOR ABSORBER', 'Engine and Gearbox Adaptation', 'B34', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-06-05 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3155, 'DPTA_DMOV06_0172', 'CANALISATION REFRI SUR COMPRESSEUR ET CONDENSEUR', 'COOLING DUCT ON COMPRESSOR AND CONDENSOR ', 'Front Face and Hood', 'V5D', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2008-07-04 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3156, 'DPTA_DMOV06_0174', 'BOITIER ET TRAPPE A CARBURANT', 'FUEL FILLER FLAP UNIT', 'Lateral Face and Doors', 'K7E', 'STR', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3157, 'DPTA_DMOV06_0175', 'GROUPE ELECTROPOMPE DIRECTION ASSISTEE (GEP DA)', 'POWER POWER STEERING ELECTRIC PUMP', 'Liaison au sol', 'E42', 'DIR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3158, 'DPTA_DMOV06_0181', 'BOITE DE DEGAZAGE', 'DEGASSING BOX', 'Engine and Gearbox Adaptation', 'B12', 'AMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3159, 'DPTA_DMOV06_0184', 'SUPPORT FILTRE A AIR', 'AIR FILTER SUPPORT', 'Engine and Gearbox Adaptation', 'A26', 'AMO', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3160, 'DPTA_DMOV06_0186', ' SUPPORT GMP GAUCHE SUR  BRANCARD ', 'LEFT ENGINE MOUNT ON SIDE RAIL ', 'Engine and Gearbox Adaptation', 'D11', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2019-09-27 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3161, 'DPTA_DMOV06_0187', 'TUBULURE CARBURANT', 'nan', 'Engine and Gearbox Adaptation', 'nan', '-', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-22 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3162, 'DPTA_DMOV06_0188', 'FIXATION TUBULURE  RESERVOIRS CARBURANT', 'FIXING FILLER NECK FUEL TANK  ', 'Engine and Gearbox Adaptation', 'B31', 'STR', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2019-06-05 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3163, 'DPTA_DMOV06_0189', 'PANNEAU DE PORTE', 'DOOR PANEL', 'Lateral Face and Doors', 'K7F', 'INT', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2020-04-03 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3164, 'DPTA_DMOV06_0190', 'CANALISATION CARBURANT SOUS CAISSE - AUTOMATIQUE', 'UNDER BODY FUEL FEED LINES - IF AUTOMATIC', 'Engine and Gearbox Adaptation', 'B32', 'AMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-06-19 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3165, 'DPTA_DMOV06_0191', 'RESSORT AR SUSPENSION', 'RR SUSPENSION SPRING', 'Liaison au sol', '?', '-', 'Cancelled', 'YES', 'NO', '2009-06-04 00:00:00', '2013-02-06 00:00:00', NULL, '2026-04-30 00:02:34.860012', NULL);
INSERT INTO public.fiches VALUES (3166, 'DPTA_DMOV06_0192', 'RESSORT AR SUSPENSION CAISSE SUR TRAIN', 'RR BODY SUSPENSION SPRING ON AXLE', 'Liaison au sol', 'E24', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-02-06 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3167, 'DPTA_DMOV06_0195', 'BFH12 / BFH5 - BOITE FUSIBLE RELAIS HABITACLE', 'BFH12 / BFH5 - COMPARTMENT RELAY FUSE BOX', 'Harness and ECUs', 'Z5U', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3168, 'DPTA_DMOV06_0197', 'PLANCHE DE BORD ET CLIMATISEUR SUR CAISSE', 'nan', 'Dashboard and console', 'S1A', 'PDC', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-09-12 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3169, 'DPTA_DMOV06_0198', 'CANALISATION CLIMATISATION SUR CAISSE', 'AIR CONDITIONING PIPE', 'Front Face and Hood', 'V5D', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-03-07 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3170, 'DPTA_DMOV06_0199', 'PDB ET CLIMATISEUR SUR CAISSE', 'nan', 'Dashboard and console', 'SZA', 'PDC', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2014-06-20 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3171, 'DPTA_DMOV06_0200', 'BOITIER AIDE AU STATIONNEMENT (AAS)', 'DISTANCE ALERT UNIT - (AAS)', 'Harness and ECUs', 'Z4F', 'EEH', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2016-09-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3172, 'DPTA_DMOV06_0204', 'BSR - BOITIER DE SERVITUDE REMORQUE', 'BSR - TOWING RELAY UNIT', 'Harness and ECUs', 'Z5U', 'AEE', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-07-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3173, 'DPTA_DMOV06_0206', 'BOÎTIER COMMUTATION PROTECTION (BCP)', 'PROTECTION SWITCH CASE', 'Harness and ECUs', 'Z5U', 'AEE', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3174, 'DPTA_DMOV06_0207', 'PLAQUE DE FERMETURE CABLE BV', 'nan', '', 'K2B', 'STR', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3175, 'DPTA_DMOV06_0209', 'ECRANS AERAULIQUES SS CAISSE MONTAGE AUTO', 'UNDER BODY VENTILATION SCREENS - AUTOMATIC ASSEMBLY', '', 'K2E', 'STR', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2013-07-02 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3176, 'DPTA_DMOV06_0211', 'COMMANDE DE VITESSE - PLANCHER', 'GEARSHIFT - FLOOR', 'Engine and Gearbox Adaptation', 'G21', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-02-13 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3177, 'DPTA_DMOV06_0212', 'ELEMENT PORTEUR AV SUR CAISSE', 'FRT BEARING PART ON BODY', 'Liaison au sol', 'E14', 'LAS', 'Applicable', 'YES', 'YES', '2008-06-09 00:00:00', '2024-08-01 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3178, 'DPTA_DMOV06_0213', 'PRE MAINTIEN RESERVOIR CARBURANT (*)', 'nan', 'Engine and Gearbox Adaptation', 'B31', 'AMO', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-07 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3179, 'DPTA_DMOV06_0214', 'RESERVOIR CARBURANT', 'FUEL TANK MOUNTING', 'Engine and Gearbox Adaptation', 'B31', 'AMO', 'Approved', 'YES', 'NO', '2008-06-09 00:00:00', '2024-06-26 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3180, 'DPTA_DMOV06_0215', 'BLOC HYDRAULIQUE ANTIBLOCAGE ROUE', 'ABS HYDR BLOCK - ANTILOCK BREAK SYSTEM / ELECTRIC STABILITY PROGRAM', 'Liaison au sol', 'F67', 'FRN', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-05-14 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3181, 'DPTA_DMOV06_0219', 'CANALISATIONS HYDRAULIQUES SOUS CAISSE', 'nan', 'Engine and Gearbox Adaptation', 'G54', 'HYD', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3182, 'DPTA_DMOV06_0220', 'CANALISATION FREIN SOUS CAISSE', 'UNDER BODY BRAKE PIPE', 'Liaison au sol', 'F63', 'FRN', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2018-11-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3183, 'DPTA_DMOV06_0221', 'INSONO-SOUS-PLANCHE-DE-BORD_OFFICIELLE.XLS', 'nan', 'Dashboard and console', 'nan', '-', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3184, 'DPTA_DMOV06_0222', 'INSONO SOUS PLANCHE DE BORD', 'UNDER DASHBOARD SOUNDPROOFING ', 'Dashboard and console', 'S2B', 'INT', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2017-05-29 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3185, 'DPTA_DMOV06_0235', 'CABLE SUR LEVIER DE VITESSES HABITACLE', 'nan', 'Engine and Gearbox Adaptation', 'G22', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2008-12-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3186, 'DPTA_DMOV06_0237', 'EMETTEUR EMBRAYAGE HYDRAULIQUE', 'HYDRAULIC CLUTCH MASTER-CYLINDER', 'Engine and Gearbox Adaptation', 'G32', 'ATR', 'To be updated', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3187, 'DPTA_DMOV06_0238', 'CANALISATION CARBURANT SOUS CAISSE', ' FUEL PIPING UNDERBODY ', 'Engine and Gearbox Adaptation', 'B32', 'AMO', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3188, 'DPTA_DMOV06_0239', 'TABLETTE AR - BI-CORP (MOBILE) ', 'REAR PARCEL SHELF (MOBILE) ', 'Interior Trims', 'X3D', 'INT', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-10-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3189, 'DPTA_DMOV06_0240', 'BOITIER MFAV - MATRICE FUSIBLE AVANT ', 'MFAV UNIT - FRT FUSE MATRIX', 'Harness and ECUs', 'Z9Z', 'AEE', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2010-02-09 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3190, 'DPTA_DMOV06_0242', 'TRAIN AR TRAVERSE DEFORMABLE', 'RR AXLE - COLLAPSIBLE CROSSMEMBER ', 'Liaison au sol', 'E20', 'LAS', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2023-10-23 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3191, 'DPTA_DMOV06_0243', 'BARRE ANTI RAPPROCHEMENT - NON INTEGREE AU TRAIN', 'CROSS BRACING - NOT BUILT INTO AXLE', 'Liaison au sol', 'E11', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2016-08-24 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3192, 'DPTA_DMOV06_0244', 'RACCORD PRISE DEPRESSION FREIN (RPDF) BRANCHEMENT SUR AMCT', 'CONNECTING BVCC ON TMCA', 'Liaison au sol', 'F62', 'FRN', 'Applicable', 'YES', 'NO', '2012-09-04 00:00:00', '2021-05-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3193, 'DPTA_DMOV06_0245', 'AMORTISSEUR AR', 'REAR SHOCK ABSORBER', 'Liaison au sol', 'E25', 'LAS', 'Applicable', 'YES', 'NO', '2008-06-09 00:00:00', '2024-11-26 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3194, 'DPTA_DMOV06_0246', 'AMORTISSEUR AR FIXATION INF', 'RR DAMPER LOWER FIXATION', 'Liaison au sol', 'E25', 'LAS', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2022-07-25 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3195, 'DTI_DITV07_0028', 'APPRO BHI', 'nan', 'Harness and ECUs', 'G54', 'HYD', 'Cancelled', 'YES', 'NO', '2008-06-09 00:00:00', '2012-11-12 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3196, 'DTI_DPMO07_0080', 'CAPTEUR HAUTEUR CAISSE AV ASS', 'BODY HEIGHT SENSOR FRT ASM', 'Engine and Gearbox Adaptation', 'G76', 'HYD', 'Current Update', 'YES', 'NO', '2008-06-09 00:00:00', '2024-07-31 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3197, '01266_22_00354', 'ENJOLIVEUR D/G PARE CHOC AV', 'RH/LH FINISHER FRONT BUMPER', 'Front and Rear Bumpers Assembly (plastic shop)', 'R1A', 'EXT', 'Approved ', 'NO', 'NO', '2022-06-20 00:00:00', '2024-02-15 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3198, '01266_22_00355', 'ARMATURE SUP PARE-CHOCS AV', 'FRT BUMPER UPR FWK', 'Front and Rear Bumpers Assembly (plastic shop)', 'R1A', 'EXT', 'Approved ', 'NO', 'NO', '2022-06-20 00:00:00', '2024-03-07 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3199, '01266_22_00141', 'BOITIER ELECTRONIQUE MULTIFONCTION PROJECTEUR', 'MULTIFUNCTION ELECTRONIC CASE PROJECTOR', 'Dashboard and console', 'Z2A', 'EXT', 'Approved', 'NO', 'YES', '2022-03-09 00:00:00', '2024-03-05 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3200, '01266_23_00459', 'DEFLECTEUR AIR PARE-BOUE AV', 'FRT DEFLECTOR AIR MUD DEFLECTOR', 'Front Face and Hood', 'K3J', 'STR', 'Approved', 'NO', 'YES', '2023-10-20 00:00:00', '2024-03-15 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3201, '01266_23_00457', 'REFROIDISSEUR CENTRAL BATTERIE TRACTION', 'BATTERY COOLING CENTRAL PLATE', 'Battery under body', 'Z1B', 'AEE', 'Approved', 'NO', 'YES', '2023-10-20 00:00:00', '2024-05-13 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3202, '01266_23_00453', 'ROTULE INF PIVOT', 'INF PIVOT BALL', 'Liaison au sol', 'E12', 'LAS', 'Approved', 'NO', 'YES', '2023-10-20 00:00:00', '2024-05-13 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3203, '01266_23_00454', 'TRAPPE RADAR', 'RADAR HATCH', 'Front Face and Hood', 'R1A', 'EXT', 'Approved', 'NO', 'NO', '2023-10-20 00:00:00', '2024-03-06 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3204, '01266_23_00458', 'SUPPORT PLANCHE DE BORD', 'DASHBOARD SUPPORT', 'Dashboard and console', 'S1A', 'PDC', 'Approved', 'NO', 'YES', '2023-10-20 00:00:00', '2024-12-12 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3205, '01266_23_00456', 'FAISCEAU INTERNE BAT VERROUILLAGE AR', 'HARNESS INSIDE BATTERY INTERLOCK BACK', 'Harness and ECUs', 'Z1A', 'EEM', 'Approved', 'NO', 'YES', '2023-10-20 00:00:00', '2024-10-03 00:00:00', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3206, '01266_19_00817', 'BOITIER JONCTION HAUTE TENSION AR INTERNE', 'REAR JUNCTION BOX HIGH VOLTAGE', 'nan', 'nan', 'nan', 'Current Update', 'NO', 'NO', 'nan', 'nan', NULL, '2026-04-30 00:02:34.907423', NULL);
INSERT INTO public.fiches VALUES (3207, '012XXXX-XXXX-56', 'COUPELLE INF RESSORT SUSPENSION AR', ' REAR SUSPENSION SPRING LOWER CUP FOR MULTILINK', 'Interior Trims', 'R1A', 'EXT', 'To be updated', 'NO', 'NO', '2026-05-12', '', 1, '2026-05-11 21:18:39.270886', NULL);
INSERT INTO public.fiches VALUES (2568, '01266_09_00156', 'ENJOLIVEUR DE PLAQUE IMMATRICULATION', 'REGISTRATION PLATE FINISHER', 'Rear Face and Tailgate', 'R3F', 'EXT', 'Approved', 'YES', 'YES', '2009-06-25 00:00:00', '2026-05-12', NULL, '2026-04-30 00:02:34.291412', '2026-05-12 10:49:11.094894');


--
-- TOC entry 4921 (class 0 OID 16400)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'Admin', 'GFST', 'admin@gfst.com', '$2b$12$HF0vSwReJiU9i0mcPIJ.Heubzz.ObOCHHxNPovyb2MXvpLEcMDdUa', 'super_admin', 'Paris', true, '2026-04-23 10:05:23.186528', 'SF78850', '', 'EXE', 'rabat', 'Capgemini', 'French', 'cap', true);


--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 221
-- Name: demandes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demandes_id_seq', 3, true);


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 219
-- Name: fiches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fiches_id_seq', 3207, true);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4771 (class 2606 OID 16437)
-- Name: demandes demandes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes
    ADD CONSTRAINT demandes_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 16420)
-- Name: fiches fiches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiches
    ADD CONSTRAINT fiches_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 16408)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4772 (class 1259 OID 16443)
-- Name: ix_demandes_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_demandes_id ON public.demandes USING btree (id);


--
-- TOC entry 4768 (class 1259 OID 16426)
-- Name: ix_fiches_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_fiches_id ON public.fiches USING btree (id);


--
-- TOC entry 4769 (class 1259 OID 16427)
-- Name: ix_fiches_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_fiches_reference ON public.fiches USING btree (reference);


--
-- TOC entry 4762 (class 1259 OID 16409)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4763 (class 1259 OID 16410)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4774 (class 2606 OID 16438)
-- Name: demandes demandes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes
    ADD CONSTRAINT demandes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4773 (class 2606 OID 16421)
-- Name: fiches fiches_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiches
    ADD CONSTRAINT fiches_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


-- Completed on 2026-05-20 12:23:26

--
-- PostgreSQL database dump complete
--

-- \unrestrict Wk1PXA3SAWUVuYsVZxAqcmjZcpaNJBnabxxEjIWdPD254T7dBfGq6hLOuvOE5vd

