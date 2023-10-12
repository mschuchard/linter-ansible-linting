![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-linting/master/linter_ansible_linting.png)

### Linter-Ansible-Linting
Linter-Ansible-Linting aims to provide functional and robust Ansible-Lint linting functionality within Pulsar.

This package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented (especially bug fixes). However, active development on this package has ceased.

### Installation
Ansible-Lint >= 5.0.0 is required to be installed before using this. If you need support for >= 3.5.0 and < 5.0.0, then please downgrade to version 1.7.1 of this package. The Atom-IDE-UI, and Language-Ansible or Language-Ansible-Advanced packages are also required. Note also that Ansible-Lint >= 5 is slower than previous releases, and more time is therefore needed to display linting information.

All testing is performed with the latest stable version of Pulsar. Any version of Atom or any pre-release version of Pulsar is not supported.

### Usage
- This linter must be used on playbook or role task files.
- `Ansible-Lint` will attempt to lint includes and roles from your playbook. Errors with includes and roles will throw a clean error to your `Atom-Linter` display notifications. Syntax errors in the current file, includes, and roles will be caught, and a notification displayed via the linter.
- Adding any one nonexistent rules directory to the custom rules directories array will cause Ansible-Lint to not function.
- To quickly and easily access issues in other files, you will need to change the settings inside Linter-UI-Default. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
