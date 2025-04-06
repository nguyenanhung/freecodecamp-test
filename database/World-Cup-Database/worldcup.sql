CREATE
DATABASE worldcup;

-- Connect to the database (for psql CLI)
-- \c worldcup

CREATE TABLE teams
(
    team_id SERIAL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE games
(
    game_id        SERIAL PRIMARY KEY,
    year           INT         NOT NULL,
    round          VARCHAR(50) NOT NULL,
    winner_id      INT         NOT NULL REFERENCES teams (team_id),
    opponent_id    INT         NOT NULL REFERENCES teams (team_id),
    winner_goals   INT         NOT NULL,
    opponent_goals INT         NOT NULL
);
