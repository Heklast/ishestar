

/*
//database nafn: product code

Chasing Waterfalls: PKNJXY
Beach & Mountain: PRAMZ8
New Frontier: PSQ1SG
Hekla Adventure: PLE2E0
Beyond Kjölur: PMSY1Z
Highland Express: PNXN8A
Magical Snæfellsnes: PWMNK4
Landmannalaugar Adventure: PVT4VW eða PGBXS8
Landmannalaugar: PVT4VW eða PGBXS8
Kirkjufell Adventure: PUSLE4
Midsummer in the Eastfjords: PMTR1T
Löngufjörur Beach Ride: PGAWUZ
Black Sand Beach Ride: PTMWEK
Beach and Lava Ride: PHWNJR
Sheep Round-Up: PBGSHQ
Black Sand Trail: PF0PB4
Trail of Legends: P0ASPV
Southern Comfort: P3MTF0
Spirit of Hekla: P1NKTX 
Spirit of the Highlands: PQSAEX	
Into the Far East: PAEGTC
Black Sand Trails: PF0PB4
Ride to Vopnafjörður: PWMS0A
Thorsmörk and Beyond: PSV5QQ
Around the Glacier: PMFDST
Southern Highland: P1QLKB
Solar Eclipse: PHRCTN
The Dark Side of the Sun: P0T0R7


Ég setti þetta inn í databaseið með því að opna psql railwayDATABASEURL
og síðan bara copy pastea þetta love it*/



UPDATE trips
SET code = CASE
  WHEN title ILIKE '%Landmannalaugar%' THEN 'PVT4VW'
  WHEN title ILIKE '%Chasing Waterfalls%' THEN 'PKNJXY'
  WHEN title ILIKE '%Beach and Lava%' THEN 'PHWNJR'
  WHEN title ILIKE '%Kirkjufell%' THEN 'PUSLE4'
  WHEN title ILIKE '%Löngufjörur%' THEN 'PGAWUZ'
  WHEN title ILIKE '%Snæfellsnes%' THEN 'PWMNK4'
  WHEN title ILIKE '%Hekla Adventure%' THEN 'PLE2E0'
  WHEN title ILIKE '%Highland Express%' THEN 'PNXN8A'
  WHEN title ILIKE '%Black Beach%' THEN 'PTMWEK'
  WHEN title ILIKE '%Black Sand Autumn Special%' THEN 'PF0PB4'
  WHEN title ILIKE '%Sheep Round-Up%' THEN 'PBGSHQ'
  WHEN title ILIKE '%New Frontiers%' THEN 'PSQ1SG'
  WHEN title ILIKE '%Beyond Kjölur%' THEN 'PMSY1Z'
  WHEN title ILIKE '%Into the far east%' THEN 'PAEGTC'
  WHEN title ILIKE '%Midsummer in the Eastfjords%' THEN 'PMTR1T'
  WHEN title ILIKE '%Ride to Vopnafjörður%' THEN 'PWMS0A'
  WHEN title ILIKE '%Black Sand Trail%' THEN 'PF0PB4'
  WHEN title ILIKE '%Trail of Legends%' THEN 'P0ASPV'
  WHEN title ILIKE '%Southern Comfort%' THEN 'P3MTF0'
  WHEN title ILIKE '%Spirit of Hekla%' THEN 'P1NKTX'
  WHEN title ILIKE '%Spirit of the Highlands%' THEN 'PQSAEX'
  WHEN title ILIKE '%Thorsmörk and Beyond%' THEN 'PSV5QQ'
  WHEN title ILIKE '%Around the Glacier%' THEN 'PMFDST'
  WHEN title ILIKE '%Southern Highland%' THEN 'P1QLKB'
  WHEN title ILIKE '%Solar Eclipse%' THEN 'PHRCTN'
  WHEN title ILIKE '%The Dark Side of the Sun%' THEN 'P0T0R7'
  WHEN title ILIKE '%Magical Snæfellsnes%' THEN 'PWMNK4'
  ELSE code
END
WHERE code IS NULL;