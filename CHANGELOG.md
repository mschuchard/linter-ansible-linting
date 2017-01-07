### Next (Roadmap)
- Added exclude directories option to package config settings.
- Block linting warnings that come from included files.
- ANSIBLE0016 and ANSIBLE0017 skips added in package config settings.
- enable non-playbook linting from ansible-lint 3.3.0 with role directory trick
- travisci
- jasmine babel
- use trace for issues in other files

### 1.2.1
- Unexpected errors are now thrown with details to Atom notifications instead of vague AtomLinter displays.
- Added severity key.
- Removed option to lint all yaml by default since `language-ansible` now identifies all `.yml` as Ansible.

### 1.2.0
- Required `ansible-lint` version bumped from `2.1.0` to `2.5.0`.
- Updated atom-linter dependency.
- Improved error catching, especially on syntax error output thrown from recent versions of Ansible.
- Code, config page, and linting display cleanup, which also delivered very minor linter package speedup.
- ANSIBLE0010-0015 skips added.
- 'Additionally use default rules' option added.

### 1.1.2
- Updated atom-linter dependency.
- Added capability to lint all yaml files.
- Fixed issue where skip ANSIBLE0008 and ANSIBLE0009 were being ignored in code.
- Added error catching for a variety of `ansible-lint` errors thrown because of issues with linted playbooks.
- ANSIBLE0003 skip removed.
- Automatic check for `ansible-lint >= 2.1.0` installed in path.
- Minor code optimization.

### 1.1.1
- Updated atom-linter dependencies.
- Minor code cleanup and optimization.
- Issue with wrong or unintended row number sometimes being displayed in linter fixed.
- Support for Rules 8 and 9 added.

### 1.1.0
- Fixed issue where wrong row displayed in linter for ANSIBLE0002 and ANSIBLE0003.
- Reworked interface from arguments array to easier and cleaner selections for rules directories and skip list.
- Some code cleanup, doc revising, and testing improvements.

### 1.0.0
- Initial version ready for wide usage.
