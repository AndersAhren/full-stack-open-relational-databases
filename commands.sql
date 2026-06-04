CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES
  ('Dan Abramov', 'https://overreacted.io/on-let-vs-const/', 'On let vs const', 0),
  ('Matti Luukkainen', 'https://www.helsinki.fi/en/news/teaching/when-moocs-came-university-helsinki', 'Kun MOOCit Helsingin yliopistoon tulivat', 0);
