![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-linting/master/linter_ansible_linting.png)

### Linter-Ansible-Linting
`Linter-Ansible-Linting` aims to provide functional and robust `Ansible-Lint` linting functionality within Atom.

### Installation
`Ansible-Lint >= 2.5.0` (because of the pep8 parseable output argument, enhanced handling of include and role issues, `-R` argument, and the removal of ANSIBLE0003) is required to be installed (preferably from a package or a pip) before using this. `Ansible-Lint >= 3.0.1` and `Ansible >= 2.0.0.2` are recommended to be installed. The `Linter` and `Language-Ansible` Atom packages are also required but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- This linter must be used from playbook files.
- `Ansible-Lint` will attempt to lint includes and roles from your playbook. Missing includes and roles, or an include with file issues, will throw a clean error to your `Atom-Linter` display notifications. Syntax errors in the current file, includes, and roles, will be caught and a notification displayed via the linter.
- Adding any one nonexistent rules directory to the custom rules directories array will cause `Ansible-Lint` to not function.
- To quickly and easily access issues in other files, you will need to change the settings inside `Linter-UI-Default`. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
