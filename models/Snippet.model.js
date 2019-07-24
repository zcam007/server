const fs = require('fs').promises;
const path = require('path');
const shortid = require('shortid');
const { readJsonFromDb, writeJsonToDb } = require('../utils/db.utils.js');

/**
 * @typedef {Object} Snippet
 * @property {sring} id
 * @property {string} author
 * @property {string} code
 * @property {sring} title
 * @property {string} author
 * @property {string} description
 * @property {string} language
 * @property {string} comments
 * @property {number} favorites
 */

/** Read
 *Select a number from db.
 *can accept optional query object to filter results
 * @param {Object} [query]
 * @returns {Promise<[Object]>}
 */

exports.select = async (query = {}) => {
  try {
    const snippets = await readJsonFromFile('snippets');
    const filtered = snippets.filter(snippet =>
      Object.keys(query).every(key => query[key] === snippet[key])
    );

    return filtered;
  } catch (err) {
    console.log('ERROR in Snippet');
    throw err;
  }
};

// CREATE

exports.insert = async ({ author, code, title, description, language }) => {
  try {
    if (!author || !code || !title || !description || !language)
      throw Error('Missing property');
    const snippets = await readJsonFromFile('snippets');

    // read snippets.json
    // grab data
    // parse datat
    // write to the file
    snippets.push({
      id: shortid.generate(),
      author,
      code,
      title,
      description,
      language,
      comments: [],
      favorites: 0,
    });

    await writeJsonToDb('snippets', snippets);
    return snippets[snippets.length[-1]];
  } catch (err) {
    console.log(err, 'ERROR from snippets');
    throw err;
  }
};

// DELETE
exports.delete = async id => {
  // Read in the db file
  const snippets = await readJsonFromDb('snippets');
  // filter snippets for everything except snippet.id
  const filteredSnips = await snippets.filter(snippet => snippet.id !== id);
  console.log(filteredSnips);
  // write the file
  if (filteredSnips.length === snippets.length) return;
  return writeJsonToDb('snippets', filteredSnips);
};

exports.update = async (id, newData) => {
  // read in file
  const snippets = await readJsonFromDb('snippets');
  // why am i using a map
  const updateSnips = snippets.map(snippet => {
    if (snippet.id !== id) return snippet;
    // new obj generates a new array
    Object.keys(newData).forEach(key => {
      // checking if newData has a key
      if (key in snippet) snippet[key] = newData;
      snippet[key] = newData[key];
    });
    return snippet;
  });
  return writeJsonToDb('snippets', updateSnips);
  console.log(filteredSnips);

  // find the entry with id
};
