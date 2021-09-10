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
    ruleSkips: {
      title: 'Tag/Rule Skips',
      type: 'string',
      description: 'List of comma-delimited tags and/or rules to skip when performing checks.',
      default: '',
    },
    timeout: {
      title: 'Linting Timeout',
      type: 'number',
      description: 'Number of seconds to wait on lint attempt before timing out.',
      default: 10,
    },
    displaySeverity: {
      title: 'Display Severity',
      type: 'boolean',
      description: 'Display the severity of the warning inside the message.',
      default: false,
    },
    lintProject: {
      title: 'Lint Project',
      type: 'boolean',
      description: 'Lint entire project if open file is not a playbook (useful if your projects are playbook collections, roles, or role collections)',
      default: false,
    },
    versionFive: {
      title: 'Ansible-Lint 5',
      type: 'boolean',
      description: 'Ansible-lint 5 detected and support enabled.',
      default: false,
    }
  },

  // activate linter
  activate() {
    const helpers = require('atom-linter');

    // check ansible-lint version
    helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), ['-T']).then(output => {
      if (/no-loop-var-prefix/.exec(output))
        // ansible-lint >= 5
        atom.config.set('linter-ansible-linting.versionFive', true)
      else {
        // ansible-lint < 5
        atom.config.set('linter-ansible-linting.versionFive', false)

        // check ansible-lint >= 3.5
        helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), ['-T']).then(output => {
          if (!(/repeatability/.exec(output))) {
            atom.notifications.addWarning(
              'ansible-lint < 3.5 is unsupported. Backwards compatibility should exist, but is not guaranteed.',
              {
                detail: "Please upgrade your version of ansible-lint to >= 3.5.\n",
                dismissable: true
              }
            );
          }
        });
      }
    });
  },

  deactivate() {
    this.idleCallbacks.forEach((callbackID) => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Ansible-Lint',
      grammarScopes: ['source.ansible', 'source.ansible-advanced'],
      scope: 'project',
      lintsOnChange: false,
      lint: async (textEditor) => {
        // setup variables
        const helpers = require('atom-linter');
        const lintRegex = /(.*):(\d+):\s\[E\d{3}\]\s(.*)/;
        const lintRegexNew = /(.*.ya?ml):(\d+):\s([a-z-]+)\s(.*)/;
        const lintRegexSyntax = /(.*.ya?ml):(\d+):(\d+):\s([a-z-]+)\s(.*)/;
        const lintRegexGeneric = /(\w+:\d+:.*)/;
        const lintRegexSyntaxUnknown = /Ansible syntax check failed/
        const lintRegexSyntaxUnknownMessage = /ERROR! (.*)/
        const file = textEditor.getPath();
        const dir = require('path').dirname(file);
        const correctFile = new RegExp(file);
        // cannot cwd in project path and then add file relative path to args because ansible relies on pathing relative to directory execution for includes
        var projectPath = atom.project.relativizePath(dir)[0];

        // bail out if this is on the blacklist
        if (atom.config.get('linter-ansible-linting.blacklist') !== '') {
          blacklist = new RegExp(atom.config.get('linter-ansible-linting.blacklist'))
          if (blacklist.exec(file))
            return [];
        }

        // pep8 output and no color
        var args = ['-p', '--nocolor'];
        // also offline if version 5
        if (atom.config.get('linter-ansible-linting.versionFive'))
          args.push('--offline');

        // add parseable severity flag if requested
        if (atom.config.get('linter-ansible-linting.displaySeverity'))
          args.push('--parseable-severity');

        // use config file if specified
        if (atom.config.get('linter-ansible-linting.useProjectConfig')) {
          // use ansible-lint config file in root project level
          args.push(...['-c', projectPath + '/.ansible-lint'])
        }
        else {
          // skip checks that user has opted to skip
          if (atom.config.get('linter-ansible-linting.ruleSkips') != '')
            args.push(...['-x', atom.config.get('linter-ansible-linting.ruleSkips')])

          // add additional rules directories
          if (atom.config.get('linter-ansible-linting.rulesDirs')[0] !== '') {
            if (atom.config.get('linter-ansible-linting.rulesDirDefault'))
              args.push('-R')

            for (i = 0; i < atom.config.get('linter-ansible-linting.rulesDirs').length; i++)
              args.push(...['-r', atom.config.get('linter-ansible-linting.rulesDirs')[i]]);
          }

          // exclude certain directories from checks
          if (atom.config.get('linter-ansible-linting.excludeDirs')[0] != '')
            for (i = 0; i < atom.config.get('linter-ansible-linting.excludeDirs').length; i++)
              args.push(...['--exclude', atom.config.get('linter-ansible-linting.excludeDirs')[i]]);
        }

        // lint file if playbook, else lint project
        if ((atom.config.get('linter-ansible-linting.lintProject')) && (!(/hosts:/.exec(textEditor.getText()))) && (!(projectPath == null)))
          args.push(projectPath);
        else
          args.push(file);

        // initialize variable for linter return here for either linter output or errors
        var toReturn = [];
        // initialize variable to track whether syntax error has unknown info
        var syntaxUnknown = false;
        // fix file not in a project; need that null coalescing operator
        projectPath = projectPath == null ? '' : projectPath + require('path').sep

        return helpers.exec(atom.config.get('linter-ansible-linting.ansibleLintExecutablePath'), args, {cwd: projectPath, stream: 'both', timeout: atom.config.get('linter-ansible-linting.timeout') * 1000}).then(output => {
          output.stdout.split(/\r?\n/).forEach((line) => {
            const lintMatches = lintRegex.exec(line);
            const lintMatchesNew = lintRegexNew.exec(line);
            const lintMatchesSyntax = lintRegexSyntax.exec(line);
            const lintMatchesGeneric = lintRegexGeneric.exec(line);
            const lintMatchesSyntaxUnknown = lintRegexSyntaxUnknown.exec(line);
            const lintMatchesSyntaxUnknownMessage = lintRegexSyntaxUnknownMessage.exec(line);
            const correctFileMatches = correctFile.exec(line);

            // check for normal linter checks output
            if (lintMatches != null && correctFileMatches != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: lintMatches[3],
                location: {
                  file: file,
                  position: [[Number.parseInt(lintMatches[2]) - 1, 0], [Number.parseInt(lintMatches[2]) - 1, 1]],
                },
              });
            }
            // check for linting issues in other files
            else if (lintMatches != null) {
              toReturn.push({
                severity: 'warning',
                excerpt: lintMatches[3],
                location: {
                  // ansible-lint plus atom-linter combined now lose pathing info for this kind of parsing
                  // prepend dir to file
                  file: projectPath + lintMatches[1],
                  position: [[Number.parseInt(lintMatches[2]) - 1, 0], [Number.parseInt(lintMatches[2]) - 1, 1]],
                },
              });
            }
            // check for ansible-lint 5 output linting issues
            else if (atom.config.get('linter-ansible-linting.versionFive') && (lintMatchesNew != null)) {
              toReturn.push({
                severity: 'warning',
                excerpt: lintMatchesNew[3] + ': ' + lintMatchesNew[4],
                location: {
                  // ansible-lint plus atom-linter combined now lose pathing info for this kind of parsing
                  // prepend dir to file
                  file: projectPath + lintMatchesNew[1],
                  position: [[Number.parseInt(lintMatchesNew[2]) - 1, 0], [Number.parseInt(lintMatchesNew[2]) - 1, 1]],
                },
              });
            }
            // check for ansible-lint 5 syntax issues with unknown info
            else if (atom.config.get('linter-ansible-linting.versionFive') && (lintMatchesSyntaxUnknown != null))
              syntaxUnknown = true
            // display ansible-lint 5 syntax issue with unknown info
            else if (atom.config.get('linter-ansible-linting.versionFive') && syntaxUnknown && (lintMatchesSyntaxUnknownMessage != null)) {
              syntaxUnknown = false
              toReturn.push({
                severity: 'error',
                excerpt: lintMatchesSyntaxUnknownMessage[1],
                location: {
                  file: file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
            // check for ansible-lint 5 syntax issues
            else if (atom.config.get('linter-ansible-linting.versionFive') && (lintMatchesSyntax != null)) {
              toReturn.push({
                severity: 'error',
                excerpt: lintMatchesSyntax[4] + ': ' + lintMatchesSyntax[5],
                location: {
                  // ansible-lint plus atom-linter combined now lose pathing info for this kind of parsing
                  // prepend dir to file
                  file: projectPath + lintMatchesSyntax[1],
                  position: [[Number.parseInt(lintMatchesSyntax[2]) - 1, Number.parseInt(lintMatchesSyntax[3]) - 1], [Number.parseInt(lintMatchesSyntax[2]) - 1, Number.parseInt(lintMatchesSyntax[3])]],
                },
              });
            }
            // check for generic failure in version five (super greedy, so must be last conditional)
            else if (atom.config.get('linter-ansible-linting.versionFive') && (lintMatchesGeneric != null)) {
              toReturn.push({
                severity: 'warning',
                excerpt: lintMatchesGeneric[1],
                location: {
                  file: file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          // parse stderr
          stderr = output.stderr
          // check for unusual issues with playbook files
          const missingFileMatches = /WARNING: Couldn't open (.*) - No such file or directory/.exec(stderr);
          const unreadableFileMatches = /the file_name (.*) does not exist, or is not readable|Could not find or access '(.*)'|error occurred while trying to read the file '(.*)':/.exec(stderr);
          const yamlSyntaxMatches = /Syntax Error while loading YAML/.exec(stderr);
          const syntaxMatches = /(?:raise Ansible(Parser)?Error|Couldn't parse task at|AttributeError)/.exec(stderr);
          const vaultMatches = /vault password.*decrypt/.exec(stderr);
          const stdinMatches = /\.dirname/.exec(stderr);
          const extraOutputMatches = /skip specific rules/.exec(stderr);
          const warningMatches = /WARNING/.exec(stderr)

          // check for missing file or directory
          if (missingFileMatches != null) {
            toReturn.push({
              severity: 'error',
              excerpt: 'Missing file ' + missingFileMatches[1] + '. Please fix before continuing linter use.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // check for unreadable file
          else if (unreadableFileMatches != null) {
            // the unreadable filename might be in either 1, 2, or 3 depending upon the message, which depends upon the version of ansible-lint; if we join the array of substrings, this efficiently assigns the captured file name
            var unreadableFile = [unreadableFileMatches[1], unreadableFileMatches[2], unreadableFileMatches[3]].join('')

            toReturn.push({
              severity: 'error',
              excerpt: unreadableFile + ' is unreadable or not a file. Please fix before continuing linter use.',
              location: {
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // check for yaml syntax issue
          else if (yamlSyntaxMatches != null) {
            // capture file and line info
            const fileMatches = /The error appears to be in '(.*)':/.exec(stderr);
            const rangeMatches = /line\s(\d+),\scolumn\s(\d+)/.exec(stderr);

            toReturn.push({
              severity: 'error',
              excerpt: 'YAML syntax error.',
              location: {
                file: fileMatches[1],
                position: [[Number.parseInt(rangeMatches[1]) - 1, Number.parseInt(rangeMatches[2]) - 1], [Number.parseInt(rangeMatches[1]) - 1, Number.parseInt(rangeMatches[2])]],
              },
            });
          }
          // check for syntax issue
          else if (syntaxMatches != null) {
            // attempt to guess location of error message and parse it
            const errorMatches = /\.ya?ml:\d+ (.*)/.exec(stderr);
            error = errorMatches[1] == null ? 'Ansible syntax error.' : errorMatches[1]
            // capture file info
            const fileMatches = /The error appears to be in '(.*)':|parse task at (.*):\d+/.exec(stderr);
            localFile = file
            // capture as much line and col info as possible
            const rangeMatches = /line\s(\d+),\scolumn\s(\d+)|\.ya?ml:(\d+)/.exec(stderr);
            range = [1, 1]

            toReturn.push({
              severity: 'error',
              excerpt: error,
              location: {
                file: localFile,
                // range now an array instead of regexp matches
                position: [[Number.parseInt(range[0]) - 1, Number.parseInt(range[1]) - 1], [Number.parseInt(range[0]) - 1, Number.parseInt(range[1])]],
              },
            });
          }
          // check for vault encrypted file
          else if (vaultMatches != null) {
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
          else if (stdinMatches != null) {
            toReturn.push({
              severity: 'info',
              excerpt: 'Ansible-Lint cannot reliably lint on stdin due to nonexistent pathing on includes and roles. Please save this playbook to your filesystem.',
              location: {
                file: 'Save this playbook.',
                position: [[0, 0], [0, 1]],
              },
            });
          }
          // output other errors directly to Atom notification display, and ignore noisy output
          else if ((extraOutputMatches == null) && (warningMatches == null) && (stderr != '')) {
            atom.notifications.addError(
              'An unexpected error with ansible, ansible-lint, linter-ansible-linting, atom, linter, and/or your playbook, has occurred.',
              {
                detail: stderr
              }
            );
          };
          return toReturn;
        });
      }
    };
  }
};
