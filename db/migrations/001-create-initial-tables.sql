
create extension if not exists pgcrypto;
create extension if not exists cube;
create extension if not exists earthdistance;

DROP TABLE IF EXISTS POSTS;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS LOCATIONS;

CREATE TABLE users
(
    id UUID DEFAULT gen_random_uuid(),
    username text NOT NULL UNIQUE,
    last_location UUID,
    created_at timestamptz NOT NULL, 
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT userid_pkey PRIMARY KEY (id)
);

CREATE TABLE locations
(
    id UUID DEFAULT gen_random_uuid(),
    lat FLOAT8 NOT NULL,
    long FLOAT8 NOT NULL,
    neighborhood text, 
    street_number text,
    street_name text, 
    city text NOT NULL, 
    state_long text NOT NULL, 
    state_short char(2) NOT NULL,
    zip char(5) NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    CONSTRAINT locid_pkey PRIMARY KEY (id)
);

CREATE TABLE posts
(
    id UUID DEFAULT gen_random_uuid(),
    title text NOT NULL, 
    body text NOT NULL, 
    user_id UUID NOT NULL, 
    location_id UUID NOT NULL, 
    type text NOT NULL, 
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT postid_pkey PRIMARY KEY (id)
);

ALTER TABLE posts ADD CONSTRAINT post_content_unique UNIQUE (title, body);
ALTER TABLE posts ADD FOREIGN KEY (user_id) REFERENCES users(id); 
ALTER TABLE posts ADD FOREIGN KEY (location_id) REFERENCES locations(id); 
ALTER TABLE users ADD FOREIGN KEY (last_location) REFERENCES locations(id); 
ALTER TABLE locations ADD CONSTRAINT lat_long_unique UNIQUE (lat, long);



 INSERT INTO locations
 (lat,long, street_number, street_name, city, zip, state_long, state_short) 
 VALUES
 (39.798770010686965,-105.07207748323874, '6815', 'W 56th Ave','Arvada', '80002','Colorado', 'CO');

INSERT INTO users
 (username, created_at, last_location) 
 VALUES
 ('testUser1', CURRENT_TIMESTAMP, (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874)),
 ('testUser2', CURRENT_TIMESTAMP, (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874));

 INSERT INTO posts
 (user_id, location_id, title, body, type) 
 VALUES
 ((SELECT id FROM users WHERE username = 'testUser1'),
 (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874),
 'TEST: Help Moving Desk', 'Test: I could use some help with moving a desk from one room to another in my apartment', 'request'),
 ((SELECT id FROM users WHERE username = 'testUser2'),
 (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874 ),
 'TEST: Free Vaccuum', 'Test: I have a free vaccuum Id like to donate to whoever needs it', 'gift'),
  ((SELECT id FROM users WHERE username = 'testUser1'),
 (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874 ),
 'TEST: Ride to Doctors', 'Test: Im requesting a ride to the doctors', 'request'),
 ((SELECT id FROM users WHERE username = 'testUser2'),
 (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874 ),
 'TEST: Free Halloween Event', 'Test: My neighborhood is hosting a Halloween block party', 'request');