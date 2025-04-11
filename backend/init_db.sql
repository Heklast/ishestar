DROP Table if exists trips;

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,              
  title VARCHAR(255) NOT NULL,         
  start_date DATE NOT NULL,            
  end_date DATE NOT NULL,
  link VARCHAR(500),
  riding_days INTEGER,
  difficulty VARCHAR(255) NOT NULL,
  availability INTEGER default 1
);

DELETE from trips;
ALTER SEQUENCE trips_id_seq RESTART WITH 1;

INSERT INTO trips (title, start_date, end_date, link, riding_days, difficulty)
VALUES  
  ('Chasing Waterfalls', '2025-06-14', '2025-06-20', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate'),  /*seinasti dagur er ekki included*/
  ('Chasing Waterfalls', '2025-06-25', '2025-07-01', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/', 5, 'intermediate'), 
  ('Beach and Lava', '2025-06-16', '2025-06-19', 'https://www.ishestar.is/packages/beach-lava-ride/', 3, 'intermediate'),
  ('Kirkjufell', '2025-06-13', '2025-06-17', 'https://www.ishestar.is/packages/kirkjufell-riding-adventure/', 4, 'intermediate'),
  ('Löngufjörur', '2025-06-17', '2025-06-19', 'https://www.ishestar.is/packages/longufjorur-beach-ride/', 2, 'intermediate'),
  ('Snæfellsnes', '2025-06-21', '2025-06-30', 'https://www.ishestar.is/packages/snaefellsnes/', 5, 'intermediate'),
  ('Chasing Waterfalls', '2025-07-08', '2025-07-14', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate'),
  ('Chasing Waterfalls', '2025-07-20', '2025-07-26', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate'),
  ('Hekla Adventure', '2025-07-14', '2025-07-19', 'https://www.ishestar.is/packages/hekla-adventure-2/',5, 'intermediate'),
  ('Landmannalaugar Adventure', '2025-07-01', '2025-07-07', 'https://www.ishestar.is/packages/landmannalaugar-adventure/',6, 'intermediate'),
  ('New Frontiers', '2025-07-10', '2025-07-18', 'https://www.ishestar.is/packages/new-frontier/',8, 'advanced'),
  ('Beyond Kjölur', '2025-07-22', '2025-07-31', 'https://www.ishestar.is/packages/beyond-kjolur-off-the-beaten-path/',8, 'advanced'),
  ('Chasing Waterfalls', '2025-08-15', '2025-08-21', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate'),
  ('Black Beach', '2025-08-21', '2025-08-23', 'https://www.ishestar.is/packages/black-sand-beach-ride/',2, 'intermediate'),
  ('Landmannalaugar Adventure', '2025-08-23', '2025-08-29', 'https://www.ishestar.is/packages/landmannalaugar-adventure/',6, 'intermediate'),
  ('Hekla Adventure', '2025-08-08', '2025-08-13', 'https://www.ishestar.is/packages/hekla-adventure-2/',5, 'intermediate'),
  ('Highland Express', '2025-08-06', '2025-08-09', 'https://www.ishestar.is/packages/highland-express-2/',4, 'intermediate'),
  ('Black Sand Autumn Special', '2025-09-01', '2025-09-06', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',1, 'intermediate'),
  ('Sheep Round-Up', '2025-09-16', '2025-09-21', 'https://www.ishestar.is/packages/sheep-round-up-reydarvatnsrettir/',4, 'intermediate'),
  ('Into the far east', '2025-07-17', '2025-07-24', 'https://www.ishestar.is/packages/into-the-far-east/',7, 'advanced'), 
  ('Midsummer in the Eastfjords', '2025-06-22', '2025-06-29', 'https://www.ishestar.is/packages/midsummer-in-the-eastfjords/',7, 'advanced'),
  ('Ride to Vopnafjörður', '2025-08-23', '2025-09-01', 'https://www.ishestar.is/packages/ride-to-vopnafjordur/',9, 'advanced')
  ;

SELECT * from trips;

