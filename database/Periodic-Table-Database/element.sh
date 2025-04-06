#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

if [[ -z $1 ]]; then
  echo "Please provide an element as an argument."
  exit 0
fi

# Query based on input type
if [[ $1 =~ ^[0-9]+$ ]]; then
  QUERY="SELECT e.atomic_number, e.name, e.symbol, t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius
         FROM elements e
         JOIN properties p ON e.atomic_number = p.atomic_number
         JOIN types t ON p.type_id = t.type_id
         WHERE e.atomic_number = $1"
elif [[ $1 =~ ^[A-Za-z]{1,2}$ ]]; then
  QUERY="SELECT e.atomic_number, e.name, e.symbol, t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius
         FROM elements e
         JOIN properties p ON e.atomic_number = p.atomic_number
         JOIN types t ON p.type_id = t.type_id
         WHERE e.symbol = '$1'"
else
  QUERY="SELECT e.atomic_number, e.name, e.symbol, t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius
         FROM elements e
         JOIN properties p ON e.atomic_number = p.atomic_number
         JOIN types t ON p.type_id = t.type_id
         WHERE e.name = '$1'"
fi

RESULT=$($PSQL "$QUERY")

if [[ -z $RESULT ]]; then
  echo "I could not find that element in the database."
else
  echo "$RESULT" | while IFS="|" read ATOMIC_NUMBER NAME SYMBOL TYPE MASS MELTING BOILING; do
    echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $MASS amu. $NAME has a melting point of $MELTING celsius and a boiling point of $BOILING celsius."
  done
fi
