TRUNCATE  reply_comments RESTART IDENTITY CASCADE;

-- insert some suppliers
INSERT INTO reply_comments
  (user_name, user_id, movie_id, replying_to, comment, updated_at)
  VALUES
    ('Bilbo', '218da62a-17a8-45bd-a2a4-5900cb71e9ba', '338762', '17da43aa-e45e-4d41-8194-66d397847241', 'this is a test reply', '2019-10-11 12:11:24-07'),
    ('Frodo', 'c9b5e684-9890-45fd-be8f-9fd4ecc9b822', '338762', '06ce86f2-6453-45fe-9570-399778f306aa', 'this is a test reply', '2019-10-11 12:11:24-07'),
    ('Samwise', '824e4947-2a6a-4b66-92d8-4136f93d003a', '338762', 'a2390be0-a0f1-4673-b6b9-3f8f0dffc97c', 'this is a test reply', '2019-10-11 12:11:24-07'),
    ('Gollum', '15536039-f1a9-4e7d-b571-3f8a60041c04', '338762', 'addce261-6fc4-4e19-be12-149cfd226fdf', 'this is a test reply', '2019-10-11 12:11:24-07'),
    ('Aragorn', 'a33225c5-fb48-4d47-b906-0f7471a5bb1b', '338762', '4500f84e-a592-4cbd-a315-b8aa68a9fdad', 'this is a test reply', '2019-10-11 12:11:24-07'),
    ('Gandalf', '624c38ff-5253-45aa-bf3b-4f91a1cdccdb', '338762', 'fca10670-0cc5-4174-87e7-98e77208eacc', 'this is a test reply', '2019-10-11 12:11:24-07')