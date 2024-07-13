async function fetchQuestions(language) {
  try {
    const response = await fetch(`questions_${language}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
