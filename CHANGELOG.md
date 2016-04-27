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
