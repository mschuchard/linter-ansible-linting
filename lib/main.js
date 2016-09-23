'use babel';

export default {
  config: {
    ansibleLintExecutablePath: {
      title: 'Ansible-Lint Executable Path',
      type: 'string',
      description: 'Path to Ansible-Lint executable (e.g. /usr/bin/ansible-lint) if not in shell env path.',
      default: 'ansible-lint',
    },
    defaultYaml: {
      title: 'Lint all YAML files with Ansible-Lint by default (requires reload or restart after changing).',
      type: 'boolean',
      default: false,
    },
    useRulesDirs: {
      title: 'Use non-default rules directories with Ansible-Lint.',
      type: 'boolean',
      default: false,
    },
    rulesDirDefault: {
      title: 'Additionally use the default rules directories with Ansible-Lint (only if use non-default rules directories checked).',
      type: 'boolean',
      default: false,
    },
    rulesDirs: {
      title: 'Rules Directories',
      type: 'array',
      description: 'Non-default rules directories to use with Ansible-Lint. (only if use non-default rules directories checked)',
      default: ['/usr/local/lib/python2.7/site-packages/ansiblelint/rules', '/usr/local/lib/python2.7/dist-packages/ansiblelint/rules'],
      items: {
        type: 'string'
      }
    },
    ANSIBLE0002: {
      title: 'Skip trailing whitespace.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0004: {
      title: 'Skip Git checkouts must contain explicit version.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0005: {
      title: 'Skip Mercurial checkouts must contain explicit revision.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0006: {
      title: 'Skip using command rather than module.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0007: {
      title: 'Skip using command rather than an argument to e.g. file.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0008: {
      title: 'Skip deprecated sudo.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0009: {
      title: 'Skip octal file permissions must contain leading zero.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0010: {
      title: 'Skip package installs should not use latest.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0011: {
      title: 'Skip all tasks should be named.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0012: {
      title: 'Skip commands should not change things if nothing needs doing.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0013: {
      title: 'Skip use shell only when shell functionality is required.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0014: {
      title: 'Skip environment variables don\'t work as part of command.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0015: {
      title: 'Skip using bare variables is deprecated.',
      type: 'boolean',
      default: false,
    }
  },

  activate: () => {
    require('atom-package-deps').install('linter-ansible-linting');

    const helpers = require("atom-linter");

    helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), ['--version'], {ignoreExitCode: true}).then(output => {
      const version = /ansible-lint (.*)/.exec(output)[1];

      if (parseFloat(version) < 2.5) {
        atom.notifications.addError(
          'The ansible-lint installed in your path is too old to support standard linter-ansible-linting features.',
          {
            detail: "Please upgrade your version of ansible-lint to >= 2.5.\n"
          }
        );
      }
    });
  },

  provideLinter: () => {
    return {
      name: 'Ansible-Lint',
      grammarScopes: atom.config.get('linter-ansible-linting.defaultYaml') ? ['source.ansible', 'source.yaml'] : ['source.ansible'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        const helpers = require('atom-linter');
        const regex = /^.*:(\d+).*ANSIBLE\d{4}\]\s(.*)$/;
        const path = require('path');
        const file = activeEditor.getPath();

        var args = ['-p']

        var skipList = ''
        for (i = 2; i <= 15; i++) {
          if (atom.config.get("linter-ansible-linting.ANSIBLE000" + i)) {
            skipList += "ANSIBLE000" + i + ",";
          }
        }
        if (skipList != '') {
          args = args.concat(['-x', skipList])
        }

        if (atom.config.get('linter-ansible-linting.useRulesDirs')) {
          if (atom.config.get('linter-ansible-linting.rulesDirDefault')) {
            args = args.concat(['-R'])
          }

          for (i = 0; i < atom.config.get('linter-ansible-linting.rulesDirs').length; i++) {
            args = args.concat(['-r', atom.config.get('linter-ansible-linting.rulesDirs')[i]]);
          }
        }
        args.push(file);

        if (/hosts:/.exec(activeEditor.getText())) {
          var toReturn = [];
          return helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), args, {cwd: path.dirname(file), ignoreExitCode: true}).then(output => {
            output.split(/\r?\n/).forEach(function (line) {
              const matches = regex.exec(line);
              if (matches != null) {
                toReturn.push({
                  type: 'Warning',
                  severity: 'Warning',
                  range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1] - 1)),
                  text: matches[2],
                  filePath: file,
                });
              }
            });
            return toReturn;
          })
          .catch(error => {
            const matches = /WARNING: Couldn't open (.*) - No such file or directory/.exec(error.message);
            const matches_two = /the file_name (.*) does not exist, or is not readable/.exec(error.message);
            const matches_three = /(?:raise Ansible(Parser)?Error|Syntax Error while loading YAML|Couldn't parse task at|AttributeError)/.exec(error.message);
            const matches_four = /Line number.*greater than maximum line/.exec(error.message);
            if (matches != null) {
              toReturn.push({
                type: 'Error',
                severity: 'Error',
                range: 1,
                text: 'Missing file ' + matches[1] + '. Please fix before continuing linter use',
                filePath: file,
              });
            }
            else if (matches_two != null) {
              toReturn.push({
                type: 'Error',
                severity: 'Error',
                range: 1,
                text: 'Unreadable or not file ' + matches_two[1] + '. Please fix before continuing linter use',
                filePath: file,
              });
            }
            else if (matches_three != null) {
              toReturn.push({
                type: 'Error',
                severity: 'Error',
                range: 1,
                text: 'This file, an include, or role, has a syntax error. Please fix before continuing linter use',
                filePath: file,
              });
            }
            else if (matches_four != null) {
              toReturn.push({
                type: 'Error',
                severity: 'Error',
                range: 1,
                text: 'An include or role has a linting issue which cannot display for this file. Please fix before continuing linter use',
                filePath: file,
              });
            }
            else {
              atom.notifications.addError(
                'An unexpected error with ansible, ansible-lint, linter-ansible-linting, atom, atom-linter, and/or your playbook, has occurred.',
                {
                  detail: error.message
                }
              );
            };
            return toReturn;
          });
        }
      }
    };
  }
};
