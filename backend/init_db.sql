DROP Table if exists trips;

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,              
  title VARCHAR(255) NOT NULL,         
  start_date DATE NOT NULL,            
  end_date DATE NOT NULL,
  link VARCHAR(500),
  riding_days INTEGER,
  difficulty VARCHAR(255) NOT NULL,
  availability INTEGER 
);

DELETE from trips;
ALTER SEQUENCE trips_id_seq RESTART WITH 1;

INSERT INTO trips (title, start_date, end_date, link, riding_days, difficulty, availability)
VALUES  
  ('Midsummer Beach and Mountain', '2025-06-21', '2025-06-26', 'https://www.ishestar.is/packages/midsummer-beach-mountain/',5, 'intermediate',1),
  ('New Frontier', '2025-07-10', '2025-07-18', 'https://www.ishestar.is/packages/new-frontier/',8, 'advanced',1),
  ('Hekla Adventure', '2025-06-07', '2025-06-12', 'https://www.ishestar.is/packages/hekla-adventure-2/',5, 'intermediate',0),
  ('Hekla Adventure', '2025-06-19', '2025-06-24', 'https://www.ishestar.is/packages/hekla-adventure-2/',5, 'intermediate',0),
  ('Hekla Adventure', '2025-07-14', '2025-07-19', 'https://www.ishestar.is/packages/hekla-adventure-2/',5, 'intermediate',1),
  ('Hekla Adventure', '2025-08-08', '2025-08-13', 'https://www.ishestar.is/packages/hekla-adventure-2/',5, 'intermediate',1),
  ('Beyond Kjölur', '2025-07-22', '2025-07-31', 'https://www.ishestar.is/packages/beyond-kjolur-off-the-beaten-path/',8, 'advanced',1),
   ('Highland Express', '2025-08-06', '2025-08-09', 'https://www.ishestar.is/packages/highland-express-2/',4, 'intermediate',1),
('Magical Snæfellsnes', '2025-06-21', '2025-06-26', 'https://www.ishestar.is/packages/snaefellsnes/', 5, 'intermediate',0),
('Magical Snæfellsnes', '2025-06-26', '2025-07-1', 'https://www.ishestar.is/packages/snaefellsnes/', 5, 'intermediate',1),
('Landmannalaugar Adventure', '2025-07-01', '2025-07-07', 'https://www.ishestar.is/packages/landmannalaugar-adventure/',6, 'intermediate',0),
('Landmannalaugar Adventure', '2025-07-26', '2025-08-01', 'https://www.ishestar.is/packages/landmannalaugar-adventure/',6, 'intermediate',1),
('Landmannalaugar Adventure', '2025-08-23', '2025-08-29', 'https://www.ishestar.is/packages/landmannalaugar-adventure/',6, 'intermediate',1),
('Kirkjufell Adventure', '2025-06-13', '2025-06-17', 'https://www.ishestar.is/packages/kirkjufell-riding-adventure/', 4, 'intermediate',0),
 ('Chasing Waterfalls', '2025-06-14', '2025-06-20', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate',1),  /*seinasti dagur er ekki included*/
  ('Chasing Waterfalls', '2025-06-25', '2025-07-01', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/', 5, 'intermediate',1), 
('Chasing Waterfalls', '2025-07-08', '2025-07-14', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate',0),
  ('Chasing Waterfalls', '2025-07-20', '2025-07-26', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate',0),
  ('Chasing Waterfalls', '2025-08-15', '2025-08-21', 'https://www.ishestar.is/packages/chasing-waterfalls-foss-comfort-tour/',5, 'intermediate',0),
('Midsummer in the Eastfjords', '2025-06-22', '2025-06-29', 'https://www.ishestar.is/packages/midsummer-in-the-eastfjords/',7, 'advanced',1),
('Löngufjörur Beach Ride', '2025-06-17', '2025-06-19', 'https://www.ishestar.is/packages/longufjorur-beach-ride/', 2, 'intermediate',1),
 ('Black Sand Beach Ride', '2025-08-21', '2025-08-23', 'https://www.ishestar.is/packages/black-sand-beach-ride/',2, 'intermediate',1),
  ('Beach and Lava Ride', '2025-06-16', '2025-06-19', 'https://www.ishestar.is/packages/beach-lava-ride/', 3, 'intermediate',1),
    ('Sheep Roundups', '2025-09-16', '2025-09-21', 'https://www.ishestar.is/packages/sheep-round-up-reydarvatnsrettir/',4, 'intermediate',1),
    ('Horse Roundups', '2025-09-04', '2025-09-08', 'https://www.ishestar.is/packages/horse-roundups/',5, 'advanced',1),
     ('Horse Roundups', '2025-09-09', '2025-09-13', 'https://www.ishestar.is/packages/horse-roundups/',5, 'advanced',0),
   ('Horse Roundups', '2025-09-17', '2025-09-21', 'https://www.ishestar.is/packages/horse-roundups/',5, 'advanced',1),
   ('Horse Roundups', '2025-09-23', '2025-09-27', 'https://www.ishestar.is/packages/horse-roundups/',5, 'advanced',1),
   ('Horse Roundups', '2025-10-01', '2025-10-05', 'https://www.ishestar.is/packages/horse-roundups/',5, 'advanced',0),
   ('Saltvík Comfort', '2025-05-08', '2025-05-11', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',0),
  ('Saltvík Comfort', '2025-05-26', '2025-05-29', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',0),
  ('Saltvík Comfort', '2025-06-13', '2025-06-16', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',0),
  ('Saltvík Comfort', '2025-07-06', '2025-07-09', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',1),
  ('Saltvík Comfort', '2025-07-19', '2025-07-22', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',0),
  ('Saltvík Comfort', '2025-08-09', '2025-08-12', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',0),
  ('Saltvík Comfort', '2025-09-01', '2025-09-04', 'https://www.ishestar.is/packages/saltvikcomfort/',3, 'intermediate',1),
  ('Into the far east', '2025-07-17', '2025-07-24', 'https://www.ishestar.is/packages/into-the-far-east/',7, 'advanced',0), 
  ('Ride to Vopnafjörður', '2025-08-23', '2025-09-01', 'https://www.ishestar.is/packages/ride-to-vopnafjordur/',9, 'advanced',0)
  ;

SELECT * from trips;

