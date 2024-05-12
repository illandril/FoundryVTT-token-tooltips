import fs from 'fs-extra';

const packageJSON = fs.readJSONSync('package.json');
const id = packageJSON.name.replace('@illandril/foundryvtt', 'illandril');
const version = packageJSON.version;
const [title, description] = packageJSON.description.split(': ', 2);
const bugs = packageJSON.bugs.url;
const repositoryURL = packageJSON.repository.url;

export default {
  moduleMetadata: {
    id,
    version,
    title,
    bugs,
  },
};

export { description, repositoryURL };
