#!/bin/bash

# Database connection string
PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

# Function to create the database and table if they don't exist
setup_database() {
  psql --username=freecodecamp --dbname=postgres -t --no-align -c "CREATE DATABASE number_guess;" >/dev/null 2>&1
  $PSQL "CREATE TABLE IF NOT EXISTS games(username VARCHAR(22) PRIMARY KEY, games_played INT DEFAULT 0, best_game INT);" >/dev/null 2>&1
}

# Generate random number between 1 and 1000
SECRET_NUMBER=$(( RANDOM % 1000 + 1 ))
echo "$SECRET_NUMBER"
NUMBER_OF_GUESSES=0

# Prompt for username
echo "Enter your username:"
read USERNAME

# Setup database
setup_database

# Get user data with separate queries
GAMES_PLAYED=$($PSQL "SELECT games_played FROM games WHERE username='$USERNAME'")
BEST_GAME=$($PSQL "SELECT best_game FROM games WHERE username='$USERNAME'")

if [[ -z $GAMES_PLAYED ]]
then
  # New user
  echo "Welcome, $USERNAME! It looks like this is your first time here."
  $PSQL "INSERT INTO games(username, games_played) VALUES('$USERNAME', 0)" >/dev/null 2>&1
  GAMES_PLAYED=0
  BEST_GAME=0
else
  # Existing user - ensure values are trimmed and valid
  GAMES_PLAYED=$(echo "$GAMES_PLAYED" | tr -d '[:space:]')
  BEST_GAME=$(echo "$BEST_GAME" | tr -d '[:space:]')

  # Handle NULL best_game
  if [[ -z "$BEST_GAME" || "$BEST_GAME" == "null" ]]
  then
    BEST_GAME=0
  fi

  # Exact welcome message for returning users
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

# Start the game
echo "Guess the secret number between 1 and 1000:"
read GUESS

while [[ "$GUESS" != "$SECRET_NUMBER" ]]
do
  if [[ ! $GUESS =~ ^[0-9]+$ ]]
  then
    echo "That is not an integer, guess again:"
  elif [[ $GUESS -gt $SECRET_NUMBER ]]
  then
    echo "It's lower than that, guess again:"
  else
    echo "It's higher than that, guess again:"
  fi

  ((NUMBER_OF_GUESSES++))
  read GUESS
done

# Increment for the correct guess
((NUMBER_OF_GUESSES++))

# Update database
((GAMES_PLAYED++))
CURRENT_BEST=$($PSQL "SELECT best_game FROM games WHERE username='$USERNAME'")

if [[ -z "$CURRENT_BEST" || "$CURRENT_BEST" == "null" ]] || [[ $NUMBER_OF_GUESSES -lt $CURRENT_BEST ]]
then
  $PSQL "UPDATE games SET best_game=$NUMBER_OF_GUESSES, games_played=$GAMES_PLAYED WHERE username='$USERNAME'" >/dev/null 2>&1
else
  $PSQL "UPDATE games SET games_played=$GAMES_PLAYED WHERE username='$USERNAME'" >/dev/null 2>&1
fi

# Exact winning message
echo "You guessed it in $NUMBER_OF_GUESSES tries. The secret number was $SECRET_NUMBER. Nice job!"
