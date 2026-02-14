-- seed.sql

insert into companies (name, homepage_url, logo_url) values
('Samsung Fire & Marine', 'https://www.samsungfire.com', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Samsung_logo.svg/200px-Samsung_logo.svg.png'),
('Hyundai Marine & Fire', 'https://www.hi.co.kr', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hyundai_Marine_%26_Fire_Insurance_logo.svg/200px-Hyundai_Marine_%26_Fire_Insurance_logo.svg.png'),
('Meritz Fire', 'https://www.meritzfire.com', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Meritz_Financial_Group_logo.svg/200px-Meritz_Financial_Group_logo.svg.png');

-- Assuming IDs are generated, we can't hardcode foreign keys easily in basic SQL script without variables or knowing IDs.
-- But for a simple seed referencing names works if we use DO block or just insert and look up.
-- For simplicity, let's just assume the user runs this line by line or we use a more complex script.
-- Creating a reusable DO block:

DO $$
DECLARE
  samsung_id uuid;
  hyundai_id uuid;
  meritz_id uuid;
BEGIN
  SELECT id INTO samsung_id FROM companies WHERE name = 'Samsung Fire & Marine';
  SELECT id INTO hyundai_id FROM companies WHERE name = 'Hyundai Marine & Fire';
  SELECT id INTO meritz_id FROM companies WHERE name = 'Meritz Fire';

  INSERT INTO riders (company_id, name, category, summary, notes) VALUES
  (samsung_id, 'Cancer Care 100', 'cancer', 'Covers all cancer types up to 100M KRW', '90 days waiting period'),
  (samsung_id, 'Brain & Heart 2030', 'brain_heart', 'Brain hemorrhage and stroke coverage', 'Diagnosis only'),
  (hyundai_id, 'Good Health Injury', 'injury', 'Injury hospitalization and surgery coverage', 'Recurring injuries covered'),
  (hyundai_id, 'Comprehensive Surgery', 'surgery', '1-5 type surgery coverage', 'Dental excluded'),
  (meritz_id, 'Alpha Plus Medical', 'hospitalization', 'Daily hospitalization allowance', 'From day 1'),
  (meritz_id, 'Drive Safe 365', 'driver', 'Driver liability and fines', 'Only for non-commercial');

END $$;
