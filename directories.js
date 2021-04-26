/* eslint-disable no-console */
const fs = require('fs');
const readline = require('readline');

const INDENT_VALUE = '  ';

// Root directory
const root = {};

/**
 * Creates a hierarchy of directories
 *
 * @param {string} path of the directory to be created
 * @returns The newly created directory
 */
const createDirectory = (path) => {
  if (!path) {
    throw new Error('Please specify directory name!');
  }
  let node = root;
  path.split('/').forEach((segment) => {
    if (node && !node[segment]) {
      node[segment] = {};
    }
    node = node[segment];
  });
  return node;
};

/**
 * List directories
 */
const listDirectories = () => {
  const output = [];
  const list = (node, indents) => {
    const childDirectories = Object.keys(node).sort((a, b) => a.localeCompare(b));
    childDirectories.forEach((childDir) => {
      output.push(`${indents}${childDir}`);
      list(node[childDir], indents + INDENT_VALUE);
    });
  };
  list(root, '');
  output.forEach((log) => console.log(log));
};

/**
 * Delete directory
 *
 * @param {string} path of the directory to be deleted
 * @returns An array of the deleted directory key and value
 */
const deleteDirectory = (path) => {
  if (!path) {
    throw new Error('Please specify directory path!');
  }
  let node = root;
  let parent;
  let child;
  path.split('/').forEach((segment) => {
    if (!node[segment]) {
      throw new Error(`Cannot delete ${path} - ${segment} does not exist`);
    }
    parent = node;
    child = segment;
    node = node[child];
  });
  delete parent[child];
  return [child, node];
};

/**
 * Move directory to another location
 *
 * @param {string} origin path
 * @param {string} destination path
 */
const moveDirectory = (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Please specify both the origin and destination!');
  }
  const [deletedKey, deletedDirectory] = deleteDirectory(origin);
  const destinationDir = createDirectory(destination);
  destinationDir[deletedKey] = deletedDirectory;
};

/**
 * List of available commands
 */
const AVAILABLE_COMMANDS = [
  {
    name: 'CREATE',
    description: 'Create a hierarchy of directories',
    handler: createDirectory,
  },
  {
    name: 'LIST',
    description: 'List all directories',
    handler: listDirectories,
  },
  {
    name: 'MOVE',
    description: 'Move directory',
    handler: moveDirectory,
  },
  {
    name: 'DELETE',
    description: 'Delete directory',
    handler(...args) {
      try {
        deleteDirectory(...args);
      } catch (err) {
        if (err.message.includes('Cannot delete')) {
          console.error(err.message);
        } else {
          throw err;
        }
      }
    },
  },
];

/**
 * Give helpful hints and abort program
 */
const abort = () => {
  console.log('\n\nHere is a list of available commands:');
  AVAILABLE_COMMANDS.forEach((c) => {
    console.log(`- ${c.name}: ${c.description}`);
  });
  throw new Error('Invalid commmand!');
};

// eslint-disable-next-line consistent-return
((commandsPath) => {
  if (!commandsPath) { return console.error('Please specify an input file!'); }

  const fileStream = fs.createReadStream(commandsPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  });

  rl.on('line', (line) => {
    // Split the given command and arguments
    const [command, ...args] = line.split(' ');
    // Find command handler
    const { handler, name } = AVAILABLE_COMMANDS
      .find((c) => c.name === command.toUpperCase()) || {};
    // Print the received command
    console.log(`${name || command} ${args.join(' ')}`);
    // Execute command or abort program
    (handler || abort)(...args);
  }).on('error', (err) => {
    console.error(err);
  });
})(process.argv[2]);
