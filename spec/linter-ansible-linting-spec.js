'use babel';

import * as path from 'path';

describe('The Ansible Lint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-ansible-linting');
      return atom.packages.activatePackage('language-ansible').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'test_two.yml'))
      );
    });
  });

  describe('checks a file with multiple issues and', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures', 'test.yml');
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
          expect(messages[0].text).toEqual('Mercurial checkouts must contain explicit revision');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+test\.yml$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[1].type).toBeDefined();
          expect(messages[1].type).toEqual('Warning');
          expect(messages[1].text).toBeDefined();
          expect(messages[1].text).toEqual('git used in place of git module');
          expect(messages[1].filePath).toBeDefined();
          expect(messages[1].filePath).toMatch(/.+test\.yml$/);
          expect(messages[1].range).toBeDefined();
          expect(messages[1].range.length).toBeDefined();
          expect(messages[1].range.length).toEqual(2);
          expect(messages[1].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[2].type).toBeDefined();
          expect(messages[2].type).toEqual('Warning');
          expect(messages[2].text).toBeDefined();
          expect(messages[2].text).toEqual('unzip used in place of unarchive module');
          expect(messages[2].filePath).toBeDefined();
          expect(messages[2].filePath).toMatch(/.+test\.yml$/);
          expect(messages[2].range).toBeDefined();
          expect(messages[2].range.length).toBeDefined();
          expect(messages[2].range.length).toEqual(2);
          expect(messages[2].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[3].type).toBeDefined();
          expect(messages[3].type).toEqual('Warning');
          expect(messages[3].text).toBeDefined();
          expect(messages[3].text).toEqual('Git checkouts must contain explicit version');
          expect(messages[3].filePath).toBeDefined();
          expect(messages[3].filePath).toMatch(/.+test\.yml$/);
          expect(messages[3].range).toBeDefined();
          expect(messages[3].range.length).toBeDefined();
          expect(messages[3].range.length).toEqual(2);
          expect(messages[3].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[4].type).toBeDefined();
          expect(messages[4].type).toEqual('Warning');
          expect(messages[4].text).toBeDefined();
          expect(messages[4].text).toEqual('mismatched braces');
          expect(messages[4].filePath).toBeDefined();
          expect(messages[4].filePath).toMatch(/.+test\.yml$/);
          expect(messages[4].range).toBeDefined();
          expect(messages[4].range.length).toBeDefined();
          expect(messages[4].range.length).toEqual(2);
          expect(messages[4].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[5].type).toBeDefined();
          expect(messages[5].type).toEqual('Warning');
          expect(messages[5].text).toBeDefined();
          expect(messages[5].text).toEqual('mkdir used in place of argument state=directory to file module');
          expect(messages[5].filePath).toBeDefined();
          expect(messages[5].filePath).toMatch(/.+test\.yml$/);
          expect(messages[5].range).toBeDefined();
          expect(messages[5].range.length).toBeDefined();
          expect(messages[5].range.length).toEqual(2);
          expect(messages[5].range).toEqual([[0, 0], [0, 32]]);
          expect(messages[6].type).toBeDefined();
          expect(messages[6].type).toEqual('Warning');
          expect(messages[6].text).toBeDefined();
          expect(messages[6].text).toEqual('deprecated sudo_user feature');
          expect(messages[6].filePath).toBeDefined();
          expect(messages[6].filePath).toMatch(/.+test\.yml$/);
          expect(messages[6].range).toBeDefined();
          expect(messages[6].range.length).toBeDefined();
          expect(messages[6].range.length).toEqual(2);
          expect(messages[6].range).toEqual([[0, 0], [0, 32]]);
          //TODO: add in octal permission when it starts working in ansible-lint
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures', 'test_two.yml');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
