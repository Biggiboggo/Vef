CREATE TABLE IF NOT EXISTS public.comments (
  id serial primary key,
  name varchar(128) not null,
  comment text not null,
  event serial,
  created timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS public.events(
  id serial primary key,
  name varchar(64) not null,
  slug varchar(64) not null unique,
  description varchar(400) not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone not null default current_timestamp
);

CREATE TABLE users (
  id serial primary key,
  username character varying(255) NOT NULL,
  password character varying(255) NOT NULL
);

INSERT INTO users (username, password) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii');

