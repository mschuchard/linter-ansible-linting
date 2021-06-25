### 1.7.0
- Official Ansible-Lint 5 support.
- Fully ignore noise output to stderr.
- Add config option to lint project if open file is not playbook.

### 1.6.1
- Update Ansible-Lint 5 beta opt-in/out to auto-detect/configure.
- Fix regression introduced in path separator fix.
- Support new syntax checking capability in Ansible-Lint 5.

### 1.6.0
- Fix path separator for platform independence.
- Add config option for ansible-lint 5 beta support.
- Add ansible-lint 5 style warning support.

### 1.5.2
- Circumvent ansible-lint/atom-linter path relativization issue for included files.
- Capture Ansible syntax error message output.
- Fix linter display output for newest output format of unreadable file error.
- Circumvent ansible-lint unparseable stderr output in 4.3.5.

### 1.5.1
- Notify details on YAML syntax errors in Ansible files.
- Notify details on Ansible syntax errors in Ansible files.

### 1.5.0
- Change linter scope to project level.
- Bump minimum supported version to 3.5.0.
- Add config option to display severity.

### 1.4.1
- Improve check on satisfying minimum version.
- Made linting timeout configurable.

### 1.4.0
- Support `ansible-lint` >= 3.5.0 and deprecate `ansible-lint` < 3.5.0.
- Future-proof tag/rule skips option.

### 1.3.4
- Updated `atom-linter` dependency.
- Catch linting on nonexistent files.

### 1.3.3
- Added `ansible-advanced` to source scope.

### 1.3.2
- Skips moved to own config subsection and code for them optimized slightly.
- Added capability for project `.ansible-lint` config file.
- Now cleanly notifies on files encrypted by `ansible-vault`.

### 1.3.1
- Added option to exclude `.yml` filenames that match a regexp from linting.
- Simplified using non-default rules directories.
- Updated unreadable/not file error recognition for new ansible-lint message and improving linter display message.

### 1.3.0
- Switched to using Linter v2 API.
- Removed `atom-package-deps` dependency and functionality.

### 1.2.3
- Fixed Rule Skips not working for 10-17 and refactored to prevent issues in the future.
- Warnings for files which are included or roles from the playbook are now displayed.
- ANSIBLE0018 skip added.

### 1.2.2
- Added exclude directories option to package config settings.
- Block linting warnings that come from included files.
- ANSIBLE0016 and ANSIBLE0017 skips added in package config settings.
- Removed unnecessary range 1 where appropriate.

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
- Updated `atom-linter` dependency.
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
