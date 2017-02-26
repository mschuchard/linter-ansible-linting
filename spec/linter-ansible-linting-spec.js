'use babel';

import * as path from 'path';

describe('The Ansible Lint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

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

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Warning');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('Package installs should not use latest');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Warning');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual('Use shell only when shell functionality is required');
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[2].type).toBeDefined();
          expect(messages[2].type).toEqual('Warning');
          expect(messages[2].text).toBeDefined();
          expect(messages[2].text).toEqual('Octal file permissions must contain leading zero');
          expect(messages[2].filePath).toBeDefined();
          expect(messages[2].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[2].range).toBeDefined();
          expect(messages[2].range.length).toBeDefined();
          expect(messages[2].range.length).toEqual(2);
          expect(messages[2].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[3].type).toBeDefined();
          expect(messages[3].type).toEqual('Warning');
          expect(messages[3].text).toBeDefined();
          expect(messages[3].text).toEqual('All tasks should be named');
          expect(messages[3].filePath).toBeDefined();
          expect(messages[3].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[3].range).toBeDefined();
          expect(messages[3].range.length).toBeDefined();
          expect(messages[3].range.length).toEqual(2);
          expect(messages[3].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[4].type).toBeDefined();
          expect(messages[4].type).toEqual('Warning');
          expect(messages[4].text).toBeDefined();
          expect(messages[4].text).toEqual('Commands should not change things if nothing needs doing');
          expect(messages[4].filePath).toBeDefined();
          expect(messages[4].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[4].range).toBeDefined();
          expect(messages[4].range.length).toBeDefined();
          expect(messages[4].range.length).toEqual(2);
          expect(messages[4].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[5].type).toBeDefined();
          expect(messages[5].type).toEqual('Warning');
          expect(messages[5].text).toBeDefined();
          expect(messages[5].text).toEqual('git used in place of git module');
          expect(messages[5].filePath).toBeDefined();
          expect(messages[5].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[5].range).toBeDefined();
          expect(messages[5].range.length).toBeDefined();
          expect(messages[5].range.length).toEqual(2);
          expect(messages[5].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[6].type).toBeDefined();
          expect(messages[6].type).toEqual('Warning');
          expect(messages[6].text).toBeDefined();
          expect(messages[6].text).toEqual('hg used in place of hg module');
          expect(messages[7].filePath).toBeDefined();
          expect(messages[7].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[7].range).toBeDefined();
          expect(messages[7].range.length).toBeDefined();
          expect(messages[7].range.length).toEqual(2);
          expect(messages[7].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[7].type).toBeDefined();
          expect(messages[7].type).toEqual('Warning');
          expect(messages[7].text).toBeDefined();
          expect(messages[7].text).toEqual("Found a bare variable 'items' used in a 'with_items' loop. You should use the full variable syntax ('{{items}}')");
          expect(messages[8].filePath).toBeDefined();
          expect(messages[8].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[8].range).toBeDefined();
          expect(messages[8].range.length).toBeDefined();
          expect(messages[8].range.length).toEqual(2);
          expect(messages[8].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[8].type).toBeDefined();
          expect(messages[8].type).toEqual('Warning');
          expect(messages[8].text).toBeDefined();
          expect(messages[8].text).toEqual('Git checkouts must contain explicit version');
          expect(messages[9].filePath).toBeDefined();
          expect(messages[9].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[9].range).toBeDefined();
          expect(messages[9].range.length).toBeDefined();
          expect(messages[9].range.length).toEqual(2);
          expect(messages[9].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[9].type).toBeDefined();
          expect(messages[9].type).toEqual('Warning');
          expect(messages[9].text).toBeDefined();
          expect(messages[9].text).toEqual('Environment variables don\'t work as part of command');
          expect(messages[10].filePath).toBeDefined();
          expect(messages[10].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[10].range).toBeDefined();
          expect(messages[10].range.length).toBeDefined();
          expect(messages[10].range.length).toEqual(2);
          expect(messages[10].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[10].type).toBeDefined();
          expect(messages[10].type).toEqual('Warning');
          expect(messages[11].text).toBeDefined();
          expect(messages[11].text).toEqual('deprecated sudo_user feature');
          expect(messages[11].filePath).toBeDefined();
          expect(messages[11].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[11].range).toBeDefined();
          expect(messages[11].range.length).toBeDefined();
          expect(messages[11].range.length).toEqual(2);
          expect(messages[11].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[12].text).toBeDefined();
          expect(messages[12].text).toEqual('Tasks that run when changed should likely be handlers');
          expect(messages[12].filePath).toBeDefined();
          expect(messages[12].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[12].range).toBeDefined();
          expect(messages[12].range.length).toBeDefined();
          expect(messages[12].range.length).toEqual(2);
          expect(messages[12].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[13].text).toBeDefined();
          expect(messages[13].text).toEqual('become_user requires become to work as expected');
          expect(messages[13].filePath).toBeDefined();
          expect(messages[13].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[13].range).toBeDefined();
          expect(messages[13].range.length).toBeDefined();
          expect(messages[13].range.length).toEqual(2);
          expect(messages[13].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[14].text).toBeDefined();
          expect(messages[14].text).toEqual('Deprecated always_run');
          expect(messages[14].filePath).toBeDefined();
          expect(messages[14].filePath).toMatch(/.+normal_checks\.yml$/);
          expect(messages[14].range).toBeDefined();
          expect(messages[14].range.length).toBeDefined();
          expect(messages[14].range.length).toEqual(2);
          expect(messages[14].range).toEqual([[0, 0], [0, 32]]);
        });
      });
    });
  });

  describe('checks a file that would throw an error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'syntax.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual('This file, an include, or role has a syntax error. Please fix before continuing linter use.');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+syntax\.yml$/);
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

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toMatch(/Missing file/);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+missing_include\.yml$/);
        });
      });
    });
  });

  describe('checks a file that would throw an error and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'unreadable_file.yml');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        })
      );
    });

    it('verifies the message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toMatch(/Unreadable or not file/);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+unreadable_file\.yml$/);
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

    it('finds one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the message in another file', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[9].filePath).toBeDefined();
          expect(messages[9].filePath).toMatch(/.+include_has_issues\.yml$/);
          expect(messages[9].range).toBeDefined();
          expect(messages[9].range.length).toBeDefined();
          expect(messages[9].range.length).toEqual(2);
          expect(messages[9].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[9].type).toBeDefined();
          expect(messages[9].type).toEqual('Warning');
          expect(messages[9].text).toBeDefined();
          expect(messages[9].text).toEqual('Environment variables don\'t work as part of command');
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

  it('ignores an included file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'issues.yml');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
