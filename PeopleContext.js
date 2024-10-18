import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  const STORAGE_KEY = "people";

  // Load people from AsyncStorage
  useEffect(() => {
    const loadPeople = async () => {
      const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));
    };
    loadPeople();
    console.log(people);
  }, []);

  const addPerson = async (name, dob) => {
    const newPerson = {
      id: randomUUID(),
      name,
      dob,
      ideas: [],
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const deletePerson = async (id) => {
    const updatedPeople = people.filter((person) => person.id !== id);
    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  const saveIdeas = async (personId, idea) => {
    const updatedPeople = people.map((person) => {
      if (person.id === personId) {
        return {
          ...person,
          ideas: [...person.ideas, idea],
        };
      }
      return person;
    });

    setPeople(updatedPeople);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
  };

  // Define the getIdeasForPerson function
  const getIdeasForPerson = async (personId) => {
    try {
      console.log("checkpoint 0 person id", personId);
      const person = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));
      return person.filter((person) => person.id === personId)[0].ideas;
    } catch (error) {
      console.error("Failed to fetch ideas", error);
      return [];
    }
  };

  // Define the deleteIdea function
  const deleteIdea = async (ideaId, personId) => {
    try {
      const ideas = await getIdeasForPerson(personId);
      console.log("checkpoint 1, ideas", ideas);
      const updatedIdeas = ideas.filter((idea) => idea.id !== ideaId);
      console.log("checkpoint 2", updatedIdeas);
      const updatedPeople = people.map((person) => {
        if (person.id === personId) {
          return {
            ...person,
            ideas: updatedIdeas,
          };
        }
        return person;
      });
      setPeople(updatedPeople);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
    } catch (error) {
      console.error("Failed to delete idea", error);
    }
  };

  return (
    <PeopleContext.Provider
      value={{ people, addPerson, deletePerson, saveIdeas, deleteIdea }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
