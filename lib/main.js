'use babel';

export default {
  config: {
    ansibleLintExecutablePath: {
      title: 'Ansible-Lint Executable Path',
      type: 'string',
      description: 'Path to Ansible-Lint executable (e.g. /usr/bin/ansible-lint) if not in shell env path.',
      default: 'ansible-lint',
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
    excludeDirs: {
      title: 'Exclude Directories',
      type: 'array',
      description: 'Absolute path directories to exclude during linting.',
      default: [''],
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
    },
    ANSIBLE0016: {
      title: 'Skip tasks that run when changed should likely be handlers.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0017: {
      title: 'Skip become_user requires become to work as expected.',
      type: 'boolean',
      default: false,
    },
    ANSIBLE0018: {
      title: 'Skip deprecated always_run.',
      type: 'boolean',
      default: false,
    }
  },

  // activate linter
  activate() {
    require('atom-package-deps').install('linter-ansible-linting');

    const helpers = require("atom-linter");

    // check for ansible-lint >= minimum version
    helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), ['--version']).then(output => {
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

  provideLinter() {
    return {
      name: 'Ansible-Lint',
      grammarScopes: ['source.ansible'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        // setup variables
        const helpers = require('atom-linter');
        const lint_regex = /(.*):(\d+).*ANSIBLE\d{4}\]\s(.*)/;
        const path = require('path');
        const file = activeEditor.getPath();
        const correct_file = new RegExp(file);

        // pep8 output
        var args = ['-p']

        // generate array of possible skips
        var skips = []
        for (var skip in atom.config.getAll('linter-ansible-linting')[0].value)
          if (/^ANSIBLE/.exec(skip))
            skips.push(skip)

        // this doesn't work for some reason
        // var skips = atom.config.getAll('linter-ansible-linting')[0].value.filter(function(skip) {
        //   return /^ANSIBLE/.test(skip);
        // });

        // skip checks that user has opted to skip
        var skipList = ''

        for (i = 0; i < skips.length; i++)
          if (atom.config.get('linter-ansible-linting.' + skips[i]))
            skipList += skips[i] + ',';

        if (skipList != '')
          args = args.concat(['-x', skipList])

        // add additional rules directories
        if (atom.config.get('linter-ansible-linting.useRulesDirs')) {
          if (atom.config.get('linter-ansible-linting.rulesDirDefault'))
            args = args.concat(['-R'])

          for (i = 0; i < atom.config.get('linter-ansible-linting.rulesDirs').length; i++)
            args = args.concat(['-r', atom.config.get('linter-ansible-linting.rulesDirs')[i]]);
        }

        // exclude certain directories from checks
        if (atom.config.get('linter-ansible-linting.excludeDirs')[0] != '')
          for (i = 0; i < atom.config.get('linter-ansible-linting.excludeDirs').length; i++)
            args = args.concat(['--exclude', atom.config.get('linter-ansible-linting.excludeDirs')[i]]);

        // add file to check
        args.push(file);

        // initialize variable for linter return here for either linter output or errors
        var toReturn = [];

        return helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), args, {cwd: path.dirname(file), ignoreExitCode: true}).then(output => {
          output.split(/\r?\n/).forEach(function (line) {
            const lint_matches = lint_regex.exec(line);
            const correct_file_matches = correct_file.exec(line);

            // check for normal linter checks output
            if (lint_matches != null && correct_file_matches != null) {
              toReturn.push({
                type: 'Warning',
                severity: 'warning',
                range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(lint_matches[2] - 1)),
                text: lint_matches[3],
                filePath: file,
              });
            }
            // check for linting issues in other files
            else if (lint_matches != null) {
              toReturn.push({
                type: 'Warning',
                severity: 'warning',
                range: [[Number.parseInt(lint_matches[2]) - 1, 0], [Number.parseInt(lint_matches[2]) - 1, 1]],
                text: lint_matches[3],
                filePath: lint_matches[1],
              });
            }
          });
          return toReturn;
        })
        .catch(error => {
          // check for unusual issues with playbook files
          const missing_file_matches = /WARNING: Couldn't open (.*) - No such file or directory/.exec(error.message);
          const unreadable_file_matches = /the file_name (.*) does not exist, or is not readable/.exec(error.message);
          const syntax_matches = /(?:raise Ansible(Parser)?Error|Syntax Error while loading YAML|Couldn't parse task at|AttributeError)/.exec(error.message);

          // check for missing file or directory
          if (missing_file_matches != null) {
            toReturn.push({
              type: 'Error',
              severity: 'error',
              text: 'Missing file ' + missing_file_matches[1] + '. Please fix before continuing linter use.',
              filePath: file,
            });
          }
          // check for unreadable file
          else if (unreadable_file_matches != null) {
            toReturn.push({
              type: 'Error',
              severity: 'error',
              text: 'Unreadable or not file ' + unreadable_file_matches[1] + '. Please fix before continuing linter use.',
              filePath: file,
            });
          }
          // check for syntax issue
          else if (syntax_matches != null) {
            toReturn.push({
              type: 'Error',
              severity: 'error',
              text: 'This file, an include, or role, has a syntax error. Please fix before continuing linter use.',
              filePath: file,
            });
          }
          // output other errors directly to Atom notification display
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
    };
  }
};
