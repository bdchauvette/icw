module.exports = plop => {
  plop.setGenerator("New Method", {
    description: "Adds a new method",

    prompts: [
      {
        name: "name",
        message: "Name?",
        type: "input"
      },
      {
        name: "methodType",
        message: "Type?",
        type: "list",
        choices: [
          {
            name: "Lazy (e.g. map, filter)",
            value: "lazy"
          },
          {
            name: "Eager (e.g. forEach, toArray)",
            value: "eager"
          },
          {
            name: "Static (e.g. of, from)",
            value: "static"
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
          templateFile:
            answers.methodType === "eager"
              ? "plop/templates/eager-method.hbs"
              : "plop/templates/lazy-method.hbs"
        },
        {
          type: "add",
          path: "test/{{name}}.spec.js",
          templateFile: "plop/templates/standalone-test.hbs"
        },
        {
          type: "add",
          path: "test/suites/run{{properCase name}}Suite.js",
          templateFile: `plop/templates/${answers.methodType}-test-suite.hbs`
        }
      );

      // Add new method to index.ts
      actions.push(
        {
          type: "append",
          path: "src/index.ts",
          pattern: "// $plop: Functions",
          template: 'export { {{name}} } from "./{{name}}";'
        },
        {
          type: "append",
          path: "test/index.spec.js",
          pattern: "// $plop: Exported functions",
          template: '  "{{ name }}",'
        }
      );

      // ICW
      actions.push(
        {
          type: "append",
          path: "src/ICW.ts",
          pattern: "// $plop: Import methods",
          template: 'import { {{name}} } from "./{{name}}";'
        },
        {
          type: "append",
          path: "src/ICW.ts",
          pattern:
            answers.methodType === "static"
              ? "// $plop: Static methods"
              : "// $plop: Prototype methods",
          templateFile: {
            eager: "plop/templates/icw-eager-method.hbs",
            lazy: "plop/templates/icw-lazy-method.hbs",
            static: "plop/templates/icw-lazy-method.hbs"
          }[answers.methodType]
        }
      );

      // ICW tests
      actions.push(
        {
          type: "append",
          path: "test/ICW.spec.js",
          pattern: "// $plop: Import suites",
          template:
            'import { run{{properCase name}}Suite } from "./suites/run{{properCase name}}Suite";'
        },
        {
          type: "append",
          path: "test/ICW.spec.js",
          pattern:
            answers.methodType === "static"
              ? /staticMethod\s+\| runSuite/
              : /prototypeMethod\s+\| runSuite/,
          // eslint-disable-next-line no-template-curly-in-string
          template: '  ${"{{name}}"} | ${run{{properCase name}}Suite}'
        }
      );

      return actions;
    }
  });
};
