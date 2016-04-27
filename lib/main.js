"use babel";

//TODO: travisci; jasmine babel

export default {
  config: {
    ansibleLintExecutablePath: {
      title: 'Ansible-Lint Executable Path',
      type: 'string',
      description: 'Path to Ansible-Lint executable (e.g. /usr/bin/ansible-lint) if not in shell env path',
      default: 'ansible-lint'
    },
    defaultYaml: {
      title: 'Lint all YAML files with Ansible-Lint by default (requires reload or restart after changing).',
      type: 'boolean',
      default: false
    },
    useRulesDirs: {
      title: 'Use non-default rules directories with Ansible-Lint.',
      type: 'boolean',
      default: false
    },
    rulesDirs: {
      title: 'Rules Directories',
      type: 'array',
      description: 'Rules directories to use with Ansible-Lint. (only if use non-default rules directories checked)',
      default: ['~/.local/lib/python2.7/site-packages/ansiblelint/rules /usr/lib/python2.7/site-packages/ansiblelint/rules'],
      items: {
        type: 'string'
      }
    },
    ANSIBLE0002: {
      title: 'Skip trailing whitespace check.',
      type: 'boolean',
      default: false
    },
    ANSIBLE0004: {
      title: 'Skip Git checkouts must contain explicit version check.',
      type: 'boolean',
      default: false
    },
    ANSIBLE0005: {
      title: 'Skip Mercurial checkouts must contain explicit revision check.',
      type: 'boolean',
      default: false
    },
    ANSIBLE0006: {
      title: 'Skip using command rather than module check.',
      type: 'boolean',
      default: false
    },
    ANSIBLE0007: {
      title: 'Skip using command rather than an argument to e.g. file check.',
      type: 'boolean',
      default: false
    },
    ANSIBLE0008: {
      title: 'Skip instead of sudo/sudo_user, use become/become_user.',
      type: 'boolean',
      default: false
    },

    ANSIBLE0009: {
      title: 'Skip numeric file permissions without leading zero can behave in unexpected ways.',
      type: 'boolean',
      default: false
    }
  },

  activate: () => {
    require('atom-package-deps').install('linter-ansible-linting');

    const helpers = require("atom-linter");

    helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), ['--version']).then(output => {
      const version = /ansible-lint (.*)/.exec(output)[1];

      //TODO: eventually change to 2.5 for improved error checking
      if (parseFloat(version) < 2.1) {
        atom.notifications.addError(
          'The ansible-lint installed in your path is too old to support pep8 output.',
          {
            detail: "Please upgrade your version of ansible-lint.\n"
          }
        );
      }
    });
  },

  provideLinter: () => {
    return {
      name: 'Ansible',
      grammarScopes: atom.config.get('linter-ansible-linting.defaultYaml') ? ['source.ansible', 'source.yaml'] : ['source.ansible'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        const helpers = require('atom-linter');
        const regex = /^.*:(\d+).*ANSIBLE(\d{4})\]\s(.*)$/;
        const path = require('path');
        const file = activeEditor.getPath();

        var args = ['-p']
        var skipList = ''
        for (i = 2; i <= 9; i++) {
          if (atom.config.get("linter-ansible-linting.ANSIBLE000" + i)) {
            skipList += "ANSIBLE000" + i + ",";
          }
        }
        if (skipList[0] != null) {
          args = args.concat(['-x', skipList])
        }
        if (atom.config.get('linter-ansible-linting.useRulesDirs')) {
          for (i = 0; i < atom.config.get('linter-ansible-linting.rulesDirs').length; i++) {
            args = args.concat(['-r', atom.config.get('linter-ansible-linting.rulesDirs')[i]]);
          }
        }
        args.push(file);

        return helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), args, {cwd: path.dirname(file)}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            const matches = regex.exec(line);
            if (matches != null) {
              toReturn.push({
                type: 'Warning',
                range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1] - 1)),
                text: matches[3],
                filePath: file
              });
            }
          });
          return toReturn;
        })
        .catch(error => {
          var toReturn = [];
          error.message.split(/\r?\n/).forEach(function (line) {
            const matches = /WARNING: Couldn't open (.*) - No such file or directory/.exec(line);
            const matches_two = /the file_name (.*) does not exist, or is not readable/.exec(line);
            const matches_three = /raise AnsibleParserError/.exec(line);
            if (matches != null) {
              toReturn.push({
                type: 'Error',
                range: 1,
                text: 'Missing file ' + matches[1] + '. Please fix before continuing linter use',
                filePath: file
              });
            }
            else if (matches_two != null) {
              toReturn.push({
                type: 'Error',
                range: 1,
                text: 'Unreadable or not file ' + matches_two[1] + '. Please fix before continuing linter use',
                filePath: file
              });
            }
            else if (matches_three != null) {
              toReturn.push({
                type: 'Error',
                range: 1,
                text: 'This file, an include, or role has a syntax error. Please fix before continuing linter use',
                filePath: file
              });
            }
            //TODO: missing role
          });
          return toReturn;
        })
      }
    };
  }
};
