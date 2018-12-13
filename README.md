![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-linting/master/linter_ansible_linting.png)

### Linter-Ansible-Linting
[![Build Status](https://travis-ci.org/mschuchard/linter-ansible-linting.svg?branch=master)](https://travis-ci.org/mschuchard/linter-ansible-linting)

`Linter-Ansible-Linting` aims to provide functional and robust `Ansible-Lint` linting functionality within Atom.

### Installation
`Ansible-Lint >= 2.5.0 < 3.5.0` is required to be installed (preferably from a package or a pip) before using this. The `Linter` and `Language-Ansible` Atom packages are also required.

**Notice** Due to several non-backwards compatible changes to `Ansible-Lint` output in `3.5.0`, the next version of this package will require that as a minimum. Do not upgrade past version `1.3.4` if you are using `Ansible-Lint < 3.5.0`.

### Usage
- This linter must be used on playbook files.
- `Ansible-Lint` will attempt to lint includes and roles from your playbook. Missing includes and roles, or an include with file issues, will throw a clean error to your `Atom-Linter` display notifications. Syntax errors in the current file, includes, and roles, will be caught and a notification displayed via the linter.
- Adding any one nonexistent rules directory to the custom rules directories array will cause `Ansible-Lint` to not function.
- To quickly and easily access issues in other files, you will need to change the settings inside `Linter-UI-Default`. For `Panel Represents` and/or `Statusbar Represents`, you will need to change their options to `Entire Project`. This will allow you to use either display to quickly access issues in other files by clicking on the displayed information.
