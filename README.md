![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-linting/master/linter_ansible_linting.png)

### linter-ansible-linting
Linter-Ansible-Linting aims to provide working and robust Ansible linting functionality within Atom.  Adapted from my other linter plugin 'linter-puppet-parsing'.

### Installation
Ansible-Lint >= 2.1.0 (because of the pep8 parseable output argument) is required to be installed (preferably from a package or a pip) before using this.  The 'linter' atom package is also required but should be automatically installed as a dependency thanks to steelbrain's package-deps.

### Usage
- Ansible-Lint also parses includes when linting.  This throws ansible-lint stack trace errors for missing includes and incorrect lines will be displayed for warnings resulting from included files.
- Adding any one nonexistent rules directory to the custom rules directories array will cause ansible-lint to not function.
