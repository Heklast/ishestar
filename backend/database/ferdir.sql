DROP Table if exists trips;

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,              
  title VARCHAR(255) NOT NULL,         
  start_date DATE NOT NULL,            
  end_date DATE NOT NULL,
  link VARCHAR(500)          
);



