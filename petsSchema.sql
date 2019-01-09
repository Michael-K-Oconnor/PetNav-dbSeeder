DROP DATABASE IF EXISTS ten_mil;

CREATE DATABASE ten_mil;

\c ten_mil

CREATE TABLE pets (
  id SERIAL,
  pet_id int,
  class varchar(63),
  family varchar(63),
  species varchar(63),
  img_url varchar(127)
);