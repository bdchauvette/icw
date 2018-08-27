module.exports = plop => {
  plop.setGenerator("New Method", {
    description: "Adds a new method",

    prompts: [
      {
        name: "name",
        type: "input",
        message: "Name?"
      },
      {
        name: "methodType",
        type: "list",
        choices: ["lazy", "eager", "static"],
        message: "Type?",
        default: false
      },
      {
        name: "methodHasCallback",
        type: "confirm",
        message: "Has callback?",
        default: false
      }
    ],

    actions: data => {
      let actions = [];

      // Standalone files
      actions.push(
        {
          type: "add",
          path: "src/{{name}}.ts",
          templateFile: "plop-templates/standalone-method.hbs"
        },
        {
          type: "add",
          path: "test/{{name}}.spec.js",
          templateFile: "plop-templates/standalone-test.hbs"
        },
        {
          type: "add",
          path: "test/suites/run{{properCase name}}Suite.js",
          templateFile: `plop-templates/${data.methodType}-test-suite.hbs`
        }
      );

      // Add new method to index.ts
      actions.push({
        type: "append",
        path: "src/index.ts",
        pattern: "// $plop: Import methods",
        template: 'export { {{name}} } from "./{{name}}";'
      });

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
            data.methodType === "static"
              ? "// $plop: Static methods"
              : "// $plop: Prototype methods",
          templateFile: "plop-templates/icw-method.hbs"
        }
      );

      // ICW tests
      actions.push(
        {
          type: "append",
          path: "test/ICW.spec.js",
          pattern: "// $plop: Import suites",
          template:
            'import { run{{properCase name}}Suite } from "./suites/run{{properCase name}}Suire";'
        },
        {
          type: "append",
          path: "test/ICW.spec.js",
          pattern:
            data.methodType === "static"
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
