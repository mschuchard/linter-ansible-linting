"use babel";
export default {
  config: {
    ansibleLintExecutablePath: {
      title: "Ansible-Lint Executable Path",
      type: 'string',
      description: "Path to Ansible-Lint executable (e.g. ~/.local/bin/ansible-lint) if not in shell env path",
      default: 'ansible-lint'
    },
    //TODO: make this a nice checkbox interface
    ansibleLintArgs: {
      title: "Ansible-Lint Arguments",
      type: 'array',
      description: "Arguments (e.g. -r RULESDIR -x SKIPLIST) to pass to ansible-lint",
      default: [''],
      items: {
        type: 'string'
      }
    }
  },

  activate: () => {
    require('atom-package-deps').install('linter-ansible-linting');
  },

  provideLinter: () => {
    return {
      name: "Ansible",
      grammarScopes: ["source.ansible"],
      scope: "file",
//TODO: lintonfly
      lintOnFly: false,
      lint: (activeEditor) => {
        const helpers = require("atom-linter");
        const path = require("path");
        const regex = /^.*:(\d+).*ANSIBLE(\d{4})\]\s(.*)$/;
        const file = activeEditor.getPath();

        var args = []
        if (atom.config.get("linter-ansible-linting.ansibleLintArgs")[0] !== '') {
          args = args.concat(atom.config.get("linter-ansible-linting.ansibleLintArgs"));
        }
        args = args.concat(['-p', file]);

        return helpers.exec(atom.config.get("linter-ansible-linting.ansibleLintExecutablePath"), args, {stream: 'stdout', cwd: path.dirname(file)}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            if (matches[2] == '0002' || matches[2] == '0003') {
              rowAdjust = 1;
            }
            else {
              rowAdjust = 0;
            }
            toReturn.push({
              type: 'Warning',
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1] - rowAdjust)),
              text: matches[3],
              filePath: file
            });
          });
          return toReturn;
        });
      }
    };
  }
};
