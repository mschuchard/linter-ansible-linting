![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-linting/master/linter_ansible_linting.png)

todo: add whitespace while doing screenshot

### linter-ansible-linting
Linter-Ansible-Linting aims to provide working and robust Ansible linting functionality within Atom.  Adapted from my other linter plugin 'linter-puppet-parsing'.

### Installation
Ansible-Lint is required to be installed (preferably from a package or a pip) before using this.  The 'linter' atom package is also required but should be automatically installed as a dependency thanks to steelbrain's package-deps.

### Usage
- Avoid specifying arguments (e.g. -L -T) that greatly affect the formatting of the parser output.  These will cause issues.  Note that '-p' is already passed by default for parseable pep8 output and therefore '-q' does nothing.
- Ansible-Lint also parses includes when linting.  This could potentially cause some bizarre output.
