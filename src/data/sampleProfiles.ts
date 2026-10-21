// SAMPLE DATA: invented placeholder values for the demo only. They are NOT real facts about these riders. Set SHOW_SAMPLE_PROFILE_DATA to false (or delete this file) before the site goes public, and replace the values with club-verified information.
import type { Cyclist } from "./cyclists";

export const SHOW_SAMPLE_PROFILE_DATA = true;

function qa(answers: [string, string, string, string, string]) {
  const questions = [
    "What is your favorite snack?",
    "What is the first thing you do after finishing a race?",
    "What do you enjoy doing on a rest day?",
    "Who would win: you on your bike or you on a dance floor?",
    "What is your hobby?",
  ];
  return questions.map((question, i) => ({ question, answer: answers[i] }));
}

export const sampleProfiles: Record<string, Partial<Cyclist>> = {
  "phocas-nshimiyimana": {
    qa: qa(["Roasted corn", "Stretching and drinking water", "Sleeping in and a slow walk", "The bike, always", "Playing football with friends"]),
    quote: "Small gains every day add up to big results.",
  },
  "espoir-uhiriwe": {
    qa: qa(["Fresh mango", "Calling my family", "Visiting friends", "The dance floor, I love music", "Listening to music"]),
    quote: "Stay patient, the road rewards those who keep going.",
  },
  "jean-claude-niyomugabo": {
    qa: qa(["Bananas", "Eating a big meal", "Washing and checking my bike", "The bike, I only dance at weddings", "Cooking"]),
    quote: "Every climb ends at the top.",
  },
  "noah-brits": {
    birthplace: "Ghent",
    qa: qa(["Waffles", "A cold drink and a shower", "Coffee with friends", "The bike, no doubt", "Photography"]),
    quote: "Race smart, finish strong.",
  },
  "foeke-dubois": {
    qa: qa(["Dark chocolate", "Checking the results", "A long walk outside", "The bike, my dancing is terrible", "Gardening"]),
    quote: "Experience is the best teammate.",
  },
  "sybren-nicolaides": {
    birthplace: "Leuven",
    age: 20,
    height: "178cm",
    weight: "68kg",
    discipline: "Road Cycling",
    team: "Benediction Cycling Club",
    qa: qa(["Peanut butter sandwiches", "A recovery drink", "Playing video games", "The bike", "Board games"]),
    quote: "Never stop learning from every race.",
  },
  "jelle-roelandt": {
    birthplace: "Mechelen",
    age: 27,
    height: "183cm",
    weight: "72kg",
    qa: qa(["Fruit cake", "Talking with the team about the race", "Resting and reading", "The dance floor, if the music is good", "Reading"]),
    quote: "Teamwork wins races.",
  },
  "glen-van-nuffelen": {
    birthplace: "Antwerp",
    age: 30,
    height: "180cm",
    weight: "70kg",
    qa: qa(["Cheese sandwiches", "Stretching", "Cooking for friends", "The bike", "Fishing"]),
    quote: "Keep your head up and your cadence high.",
  },
  "diane-ingabire": {
    height: "165cm",
    weight: "55kg",
    qa: qa(["Sweet potatoes", "Drinking water and resting", "Spending time with family", "The bike, I love racing more", "Singing"]),
    quote: "Strong legs, stronger mind.",
  },
  "valentine-nzayisengwa": {
    height: "167cm",
    weight: "57kg",
    qa: qa(["Fresh fruit", "Stretching with my teammates", "Watching movies", "The dance floor, I enjoy dancing", "Dancing"]),
    quote: "Believe in the work you put in.",
  },
  "jackson-nkurikiyinka": {
    qa: qa(["Bananas", "Calling my family", "Playing with friends", "The bike", "Football"]),
    quote: "Dream big and keep pedalling.",
  },
};
