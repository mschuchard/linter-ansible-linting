'use babel';

import * as path from 'path';

describe('The Ansible Lint provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-ansible-linting');
      return atom.packages.activatePackage('language-ansible').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'clean.yml'))
      );
    });
  });

  describe('checks a file with multiple issues and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'normal_checks.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds all the messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(14);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('warning');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[2].severity).toBeDefined();
          expect(messages[2].severity).toEqual('warning');
          expect(messages[2].excerpt).toBeDefined();
          expect(messages[2].location.file).toBeDefined();
          expect(messages[2].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[2].location.position).toBeDefined();
          expect(messages[3].severity).toBeDefined();
          expect(messages[3].severity).toEqual('warning');
          expect(messages[3].excerpt).toBeDefined();
          expect(messages[3].location.file).toBeDefined();
          expect(messages[3].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[3].location.position).toBeDefined();
          expect(messages[4].severity).toBeDefined();
          expect(messages[4].severity).toEqual('warning');
          expect(messages[4].excerpt).toBeDefined();
          expect(messages[4].location.file).toBeDefined();
          expect(messages[4].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[4].location.position).toBeDefined();
          expect(messages[5].severity).toBeDefined();
          expect(messages[5].severity).toEqual('warning');
          expect(messages[5].excerpt).toBeDefined();
          expect(messages[5].location.file).toBeDefined();
          expect(messages[5].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[5].location.position).toBeDefined();
          expect(messages[6].severity).toBeDefined();
          expect(messages[6].severity).toEqual('warning');
          expect(messages[6].excerpt).toBeDefined();
          expect(messages[6].location.file).toBeDefined();
          expect(messages[6].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[6].location.position).toBeDefined();
          expect(messages[7].severity).toBeDefined();
          expect(messages[7].severity).toEqual('warning');
          expect(messages[7].excerpt).toBeDefined();
          expect(messages[7].location.file).toBeDefined();
          expect(messages[7].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[7].location.position).toBeDefined();
          expect(messages[8].severity).toBeDefined();
          expect(messages[8].severity).toEqual('warning');
          expect(messages[8].excerpt).toBeDefined();
          expect(messages[8].location.file).toBeDefined();
          expect(messages[8].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[8].location.position).toBeDefined();
          expect(messages[9].severity).toBeDefined();
          expect(messages[9].severity).toEqual('warning');
          expect(messages[9].excerpt).toBeDefined();
          expect(messages[9].location.file).toBeDefined();
          expect(messages[9].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[9].location.position).toBeDefined();
          expect(messages[10].severity).toBeDefined();
          expect(messages[10].severity).toEqual('warning');
          expect(messages[10].excerpt).toBeDefined();
          expect(messages[10].location.file).toBeDefined();
          expect(messages[10].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[10].location.position).toBeDefined();
          expect(messages[11].severity).toBeDefined();
          expect(messages[11].severity).toEqual('warning');
          expect(messages[11].excerpt).toBeDefined();
          expect(messages[11].location.file).toBeDefined();
          expect(messages[11].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[11].location.position).toBeDefined();
          expect(messages[12].severity).toBeDefined();
          expect(messages[12].severity).toEqual('warning');
          expect(messages[12].excerpt).toBeDefined();
          expect(messages[12].location.file).toBeDefined();
          expect(messages[12].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[12].location.position).toBeDefined();
          expect(messages[13].severity).toBeDefined();
          expect(messages[13].severity).toEqual('warning');
          expect(messages[13].excerpt).toBeDefined();
          expect(messages[13].location.file).toBeDefined();
          expect(messages[13].location.file).toMatch(/.+normal_checks\.yml$/);
          expect(messages[13].location.position).toBeDefined();
        });
      });
    });
  });

  describe('checks a file that would throw an ansible syntax error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'syntax.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the error message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toMatch(/has extra params, which is only allowed in the following modules/);
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+syntax\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[5, 6], [5, 7]]);
        });
      });
    });
  });

  describe('checks a file that would throw a YAML syntax error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'yaml_syntax.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the error message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('Ansible syntax check failed for unknown reason; use syntax checker for more information.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+yaml_syntax\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file that would throw an error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'missing_include.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the error message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("foo:1: load-failure [Errno 2] No such file or directory: 'foo' (filenotfounderror)");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+missing_include\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks an unreadable file that would throw an error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'unreadable_file.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the error message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('Ansible syntax check failed for unknown reason; use syntax checker for more information.');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+unreadable_file\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  // password for this is 'foo' just in case i ever need it
  describe('checks an encrypted file that would throw an error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'vault_encrypted.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the error message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('internal-error: Unexpected error code 1 from execution of: ansible-playbook --syntax-check vault_encrypted.yml');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+vault_encrypted\.yml$/);
        });
      });
    });
  });

  describe('checks a file that has an out bounds warning in an include and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'include_has_issues.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the message in another file', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+include_with_issues\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[8, 0], [8, 1]]);
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('yaml: too many blank lines (7 > 2) (empty-lines)');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+include_with_issues\.yml$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[9, 0], [9, 1]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('warning');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('inline-env-var: Command module does not accept setting environment variables inline');
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'clean.yml');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });

  describe('checks an included file that has an out bounds warning and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'include_with_issues.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the inaccurate message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+include_with_issues\.yml$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[9, 2], [9, 3]]);
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('warning');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("syntax-check: 'command' is not a valid attribute for a Play");
        });
      });
    });
  });
});
