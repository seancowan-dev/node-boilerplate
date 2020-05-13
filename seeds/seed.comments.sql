TRUNCATE  user_comments RESTART IDENTITY CASCADE;

-- insert some suppliers
INSERT INTO user_comments
  (user_name, user_id, movie_id, comment, updated_at)
  VALUES
    ('Bilbo', '218da62a-17a8-45bd-a2a4-5900cb71e9ba', '338762', 'this is a test thing', '2019-10-11 12:11:24-07'),
    ('Frodo', 'c9b5e684-9890-45fd-be8f-9fd4ecc9b822', '338762', 'this is a test thing', '2019-10-11 12:11:24-07'),
    ('Samwise', '824e4947-2a6a-4b66-92d8-4136f93d003a', '338762', 'this is a test thing', '2019-10-11 12:11:24-07'),
    ('Gollum', '15536039-f1a9-4e7d-b571-3f8a60041c04', '338762', 'this is a test thing', '2019-10-11 12:11:24-07'),
    ('Aragorn', 'a33225c5-fb48-4d47-b906-0f7471a5bb1b', '338762', 'this is a test thing', '2019-10-11 12:11:24-07'),
    ('Gandalf', '624c38ff-5253-45aa-bf3b-4f91a1cdccdb', '338762', 'this is a test thing', '2019-10-11 12:11:24-07')