'use babel';

export default {
  config: {
    ansibleLintExecutablePath: {
      title: 'Ansible-Lint Executable Path',
      type: 'string',
      description: 'Path to Ansible-Lint executable (e.g. /usr/bin/ansible-lint) if not in shell env path.',
      default: 'ansible-lint',
    },
    rulesDirDefault: {
      title: 'Additionally use the default rules directories with Ansible-Lint (only if using non-default rules directories).',
      type: 'boolean',
      default: false,
    },
    rulesDirs: {
      title: 'Rules Directories',
      type: 'array',
      description: 'Non-default rules directories to use with Ansible-Lint.',
      default: [''],
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
    useProjectConfig: {
      title: 'Use project Ansible-Lint config file.',
      type: 'boolean',
      description: 'Use an ansible-lint configuration file named `.ansible-lint` in the root level of the project directory. Overrides other settings besides executable path and blacklist.',
      default: false,
    },
    blacklist: {
      title: 'Exclude Regexp for .yml',
      type: 'string',
      description: 'Regular expression for .yml filenames to ignore (e.g. travis|docker would ignore docker-compose.yml and .travis.yml).',
      default: '',
    },
    skips: {
      title: 'Rule Skips',
      type: 'object',
      properties: {
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
      }
    }
  },

  // activate linter
  activate() {
    const helpers = require("atom-linter");

    // check for ansible-lint >= minimum version
    helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), ['--version']).then(output => {
      const version = /ansible-lint (.*)/.exec(output)[1];

      if (parseFloat(version) < 3.5) {
        atom.notifications.addError(
          'The ansible-lint installed in your path is too old to support standard linter-ansible-linting features.',
          {
            detail: "Please upgrade your version of ansible-lint to >= 3.5.\n"
          }
        );
      }
    });
  },

  provideLinter() {
    return {
      name: 'Ansible-Lint',
      grammarScopes: ['source.ansible', 'source.ansible-advanced'],
      scope: 'file',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // setup variables
        const helpers = require('atom-linter');
        const lint_regex = /(.*):(\d+).*ANSIBLE\d{4}\]\s(.*)/;
        const file = activeEditor.getPath();
        const correct_file = new RegExp(file);

        // bail out if this is on the blacklist
        if (atom.config.get('linter-ansible-linting.blacklist') !== '') {
          blacklist = new RegExp(atom.config.get('linter-ansible-linting.blacklist'))
          if (blacklist.exec(file))
            return [];
        }

        // pep8 output and no color
        var args = ['-p', '--nocolor']

        // use config file if specified
        if (atom.config.get('linter-ansible-linting.useProjectConfig')) {
          // grab the project path
          const filePath = activeEditor.getPath();
          // cannot cwd in project path and then add file relative path to args because ansible relies on pathing relative to directory execution for includes
          const [projectPath, projectRelativeFilePath] = atom.project.relativizePath(filePath);

          // use ansible-lint config file in root project level
          args = args.concat(['-c', projectPath + '/.ansible-lint'])
        }
        else {
          // generate array of possible skips
          var skips = []
          for (var skip in atom.config.getAll('linter-ansible-linting.skips')[0].value)
            skips.push(skip)

          // this doesn't work for some reason
          // var skips = atom.config.getAll('linter-ansible-linting.skips')[0].value.filter(function(skip) {
          //   return /^ANSIBLE/.test(skip);
          // });

          // skip checks that user has opted to skip
          var skipList = ''

          for (i = 0; i < skips.length; i++)
            if (atom.config.get('linter-ansible-linting.skips.' + skips[i]))
              skipList += skips[i] + ',';

          if (skipList != '')
            args = args.concat(['-x', skipList])

          // add additional rules directories
          if (atom.config.get('linter-ansible-linting.rulesDirs')[0] !== '') {
            if (atom.config.get('linter-ansible-linting.rulesDirDefault'))
              args.push('-R')

            for (i = 0; i < atom.config.get('linter-ansible-linting.rulesDirs').length; i++)
              args = args.concat(['-r', atom.config.get('linter-ansible-linting.rulesDirs')[i]]);
          }

          // exclude certain directories from checks
          if (atom.config.get('linter-ansible-linting.excludeDirs')[0] != '')
            for (i = 0; i < atom.config.get('linter-ansible-linting.excludeDirs').length; i++)
              args = args.concat(['--exclude', atom.config.get('linter-ansible-linting.excludeDirs')[i]]);
        }

        // add file to check
        args.push(file);

        // initialize variable for linter return here for either linter output or errors
        var toReturn = [];

        return helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), args, {cwd: require('path').dirname(file), ignoreExitCode: true}).then(output => {
          output.split(/\r?\n/).forEach(function (line) {
            const lint_matches = lint_regex.exec(line);
            const correct_file_matches = correct_file.exec(line);

            // check for normal linter checks output
            if (lint_matches != null && correct_file_matches != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: lint_matches[3],
                location: {
                  file: file,
                  position: [[Number.parseInt(lint_matches[2]) - 1, 0], [Number.parseInt(lint_matches[2]) - 1, 1]],
                },
              });
            }
            // check for linting issues in other files
            else if (lint_matches != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: lint_matches[3],
                location: {
                  file: lint_matches[1],
                  position: [[Number.parseInt(lint_matches[2]) - 1, 0], [Number.parseInt(lint_matches[2]) - 1, 1]],
                },
              });
            }
          });
          return toReturn;
        })
        .catch(error => {
          // check for unusual issues with playbook files
          const missing_file_matches = /WARNING: Couldn't open (.*) - No such file or directory/.exec(error.message);
          const unreadable_file_matches = /the file_name (.*) does not exist, or is not readable|Could not find or access '(.*)'/.exec(error.message);
          const syntax_matches = /(?:raise Ansible(Parser)?Error|Syntax Error while loading YAML|Couldn't parse task at|AttributeError)/.exec(error.message);
          const vault_matches = /vault password.*decrypt/.exec(error.message);
          const stdin_matches = /\.dirname/.exec(error.message);

          // check for missing file or directory
          if (missing_file_matches != null) {
            toReturn.push({
              severity: 'error',
              excerpt: 'Missing file ' + missing_file_matches[1] + '. Please fix before continuing linter use.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // check for unreadable file
          else if (unreadable_file_matches != null) {
            // the unreadable filename might be in either 1 or 2 depending upon the message which depends upon the version of ansible-lint
            unreadable_file = unreadable_file_matches[1] == null ? unreadable_file_matches[2] : unreadable_file_matches[1]

            toReturn.push({
              severity: 'error',
              excerpt: unreadable_file + ' is unreadable or not a file. Please fix before continuing linter use.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // check for syntax issue
          else if (syntax_matches != null) {
            toReturn.push({
              severity: 'error',
              excerpt: 'This file, an include, or role, has a syntax error. Please fix before continuing linter use.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // check for vault encrypted file
          else if (vault_matches != null) {
            toReturn.push({
              severity: 'info',
              excerpt: 'File must be decrypted with ansible-vault prior to linting.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // check for stdin lint attempt
          else if (stdin_matches != null) {
            toReturn.push({
              severity: 'info',
              excerpt: 'Ansible-Lint cannot reliably lint on stdin due to nonexistent pathing on includes and roles. Please save this playbook to your filesystem.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // output other errors directly to Atom notification display
          else {
            atom.notifications.addError(
              'An unexpected error with ansible, ansible-lint, linter-ansible-linting, atom, linter, and/or your playbook, has occurred.',
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
