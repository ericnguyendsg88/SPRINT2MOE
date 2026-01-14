-- Insert 5 sample courses
INSERT INTO public.courses (name, provider, billing_cycle, fee, status, mode_of_training, description) VALUES
('Python Programming Fundamentals', 'National University of Singapore', 'monthly', 250.00, 'active', 'online', 'Learn the fundamentals of Python programming from basics to advanced concepts'),
('Digital Marketing Essentials', 'Singapore Polytechnic', 'quarterly', 480.00, 'active', 'hybrid', 'Master digital marketing strategies and tools for modern businesses'),
('Data Analytics with Excel', 'Temasek Polytechnic', 'monthly', 150.00, 'active', 'online', 'Learn data analysis techniques using Microsoft Excel'),
('UI/UX Design Principles', 'Nanyang Technological University', 'yearly', 2800.00, 'active', 'in-person', 'Comprehensive course on user interface and user experience design'),
('Financial Literacy', 'Singapore Management University', 'monthly', 120.00, 'active', 'online', 'Essential financial literacy skills for personal finance management')
ON CONFLICT DO NOTHING;
