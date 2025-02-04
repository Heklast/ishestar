DELETE from trips;
ALTER SEQUENCE trips_id_seq RESTART WITH 1;

INSERT INTO trips (title, start_date, end_date, link)
VALUES  
  ('Trip to Hekla', '2025-06-15', '2025-06-17', 'https://chatgpt.com/c/67a20eff-9fa8-8009-887b-cffa0b0eff27'),  /*seinasti dagur er ekki included*/
  ('Trip to Hekla', '2025-07-01', '2025-07-02', 'https://chatgpt.com/c/67a20eff-9fa8-8009-887b-cffa0b0eff27'),
  ('Northern Lights Adventure', '2025-09-05', '2025-09-07', 'https://chatgpt.com/c/67a20eff-9fa8-8009-887b-cffa0b0eff27');

SELECT * from trips;