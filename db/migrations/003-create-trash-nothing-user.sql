INSERT INTO users
    (id, username, created_at, last_location) 
VALUES
    ('11111111-0000-1111-0000-000000000000', 'trash_nothing_user', CURRENT_TIMESTAMP, (SELECT id FROM locations WHERE lat = 39.798770010686965 AND long = -105.07207748323874))