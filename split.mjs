import Papa from 'papaparse';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { pick } from 'lodash-es';

const inputStream = createReadStream('./questions.csv');

Papa.parse(inputStream, {
  worker: true,
  header: true,
  complete: async (results) => {
    const shows = new Map();

    for (const question of results.data) {
      if (!shows.has(question.showNumber)) {
        shows.set(question.showNumber, []);
      }

      shows
        .get(question.showNumber)
        .push(
          pick(question, ['round', 'category', 'value', 'question', 'answer'])
        );
    }

    for (const [showNumber, questions] of shows.entries()) {
      await writeFile(
        `./trivia/shows/${showNumber}.json`,
        JSON.stringify({
          showNumber,
          questions
        })
      );
    }
  }
});
