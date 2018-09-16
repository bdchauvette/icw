const sortedAppend = require("./plop/actions/sortedAppend");

module.exports = plop => {
  plop.setActionType("sortedAppend", sortedAppend);

  plop.setGenerator("New Function", {
    description: "Adds a new function",

    prompts: [
      {
        name: "name",
        message: "Name?",
        type: "input"
      },
      {
        name: "returnType",
        message: "Return Type?",
        type: "list",
        choices: [
          {
            name: "Iterator (e.g.  filter, map, take)",
            value: "iterator"
          },
          {
            name: "Promise (e.g. first, reduce, toArray)",
            value: "promise"
          }
        ]
      },
      {
        name: "methodHasCallback",
        message: "Has callback?",
        type: "confirm",
        default: false
      },
      {
        name: "callbackLength",
        message: "Number of callback params?",
        type: "input",
        default: 2,
        when: answers => answers.methodHasCallback,
        validate: input => {
          let numParams = Number(input);
          if (Number.isInteger(numParams) && numParams > 0) return true;
          return "Number of params must be an integer >= 0";
        }
      }
    ],

    actions: answers => {
      let actions = [];

      // Standalone files
      actions.push(
        {
          type: "add",
          path: "src/{{name}}.ts",
          templateFile: {
            iterator: "plop/templates/iterator-fn.hbs",
            promise: "plop/templates/promise-fn.hbs"
          }[answers.returnType]
        },
        {
          type: "add",
          path: "test/{{name}}.spec.js",
          templateFile: {
            iterator: "plop/templates/iterator-fn-spec.hbs",
            promise: "plop/templates/promise-fn-spec.hbs"
          }[answers.returnType]
        }
      );

      // Add exports to index.ts
      actions.push(
        {
          type: "sortedAppend",
          path: "src/index.ts",
          startPattern: "plop: Functions",
          template: 'export { {{name}} } from "./{{name}}";'
        },
        {
          type: "sortedAppend",
          path: "test/index.spec.js",
          startPattern: "plop: Exports",
          template: '  "{{ name }}",'
        }
      );

      return actions;
    }
  });
};
