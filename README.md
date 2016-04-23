![Preview](https://raw.githubusercontent.com/mschuchard/linter-ansible-linting/master/linter_ansible_linting.png)

### linter-ansible-linting
`Linter-Ansible-Linting` aims to provide functional and robust `Ansible` linting functionality within Atom. Adapted from my other linter plugin `linter-puppet-parsing`.

### Installation
`Ansible-Lint >= 2.1.0` (because of the pep8 parseable output argument) is required to be installed (preferably from a package or a pip) before using this. `Ansible-Lint >= 2.5.0` (because of enhanced handling of include and role issues) is recommended to be installed. The `linter` and `language-ansible` Atom packages are also required but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- `Ansible-Lint` will ordinarily attempt to lint includes and roles. Missing includes and roles will be displayed by the linter as a warning and missing roles will throw a clean error to your Atom display notifications. Syntax errors in includes and roles will be caught and and a notification displayed via the linter. Linter warnings from includes and roles may display strangely or throw out-of-bounds type errors which will error silently. Therefore, reasonably responsible behavior is recommended with this linter as there are numerous unusual situations I either cannot fully compensate for or expect.
- Adding any one nonexistent rules directory to the custom rules directories array will cause `ansible-lint` to not function.
