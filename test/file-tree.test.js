import {
  srcDirHandle,
  currentDirectory,
  cssDirectoryEntries,
  indexHtmlFileHandle,
  mainCssFileContents,
  mainCssFileHandle,
  imgDirHandle,
  iconDirHandle,
  cssDirHandle,
  manifestJsonFileHandle, emailPngFileHandle, mainJsFileHandle, jsDirHandle, indexHtmlFile
} from './mocks/directory.js';

import '../src/file-tree.js';

const dirElement = (dir, children) => {
  let classes = [];
  const entries = children || [];

  return {
    dataset: {
      dir
    },
    matches(selector) {
      return selector === 'li[data-dir]';
    },
    classList: {
      toggle(className) {
        if(classes.includes(className)) {
          classes = classes.filter(c => c !== className)
        }
        else {
          classes.push(className);
        }
      },
      contains(className) {
        return classes.includes(className);
      },
      add(className) {
        classes.push(className);
      },
      remove(className) {
        classes = classes.filter(c => c !== className)
      }
    },
    nextElementSibling: {
      childElementCount: 1,
      querySelectorAll() {
        return entries;
      }
    }
  }
};

const fileElement = (file) => {
  let classes = [];

  return {
    dataset: {
      file
    },
    matches(selector) {
      return selector === 'li[data-file]';
    },
    classList: {
      toggle(className) {
        if(classes.includes(className)) {
          classes = classes.filter(c => c !== className)
        }
        else {
          classes.push(className);
        }
      },
      contains(className) {
        return classes.includes(className);
      },
      add(className) {
        classes.push(className);
      },
      remove(className) {
        classes = classes.filter(c => c !== className)
      }
    }
  }
};

describe('file-tree', () => {
  let element;
  let getReadWritePermissionStub;
  let indexDirectoryStub;
  let indexFileContentStub;


  beforeEach(async () => {
    element = document.createElement('file-tree');

    document.body.appendChild(element);

    // getReadWritePermissionStub = sinon.stub(element, 'getReadWritePermission');

    const indexDirectory = () => {
      currentDirectory.entries['src/css'].entries = {...cssDirectoryEntries};
      element.currentDirectory = currentDirectory
    };

    indexDirectoryStub = sinon.stub(element, 'indexDirectory').callsFake(indexDirectory);
    indexFileContentStub = sinon.stub(element, 'indexFileContent').callsFake(indexDirectory);

    await element.browseDirectory(srcDirHandle);
  });

  afterEach(() => {
    document.body.removeChild(element);
    sinon.reset();
    sinon.restore();
  });

  it('should create a directory representation', async () => {
    assert.equal(element.currentDirectoryHandle, srcDirHandle);
    assert.deepEqual(element.currentDirectory, currentDirectory);
  });

  it('should lazily iterate a directory when it is clicked ', async () => {
    const stub = sinon.stub(element, 'listFiles');
    const dirEl = dirElement('src/css');
    dirEl.nextElementSibling.childElementCount = 0;
    const event = {
      composedPath() {
        return [dirEl];
      }
    };

    await element.openFileOrDirectory(event);

    assert.equal(stub.called, true);
  });

  it('should open the native file picker and open the selected file', async () => {
    const stub = sinon.stub(window, 'showOpenFilePicker').resolves([mainCssFileHandle]);
    const spy = sinon.spy(element, 'openFileHandle');

    await element.openFile();

    assert.equal(stub.called, true);
    assert.equal(spy.calledWith(mainCssFileHandle), true);
  });

  it('should open the native directory picker and open the selected directory', async () => {
    const stub = sinon.stub(window, 'showDirectoryPicker').resolves(cssDirHandle);
    const spy = sinon.spy(element, 'browseDirectory');

    const actual = await element.openDirectory();

    assert.equal(stub.called, true);
    assert.equal(spy.calledWith(cssDirHandle), true);
    assert.equal(actual, cssDirHandle);
  });

  it('should query for permission on a handle', async () => {
    const handle = {
      queryPermission() {

      }
    };

    const spy = sinon.spy(handle, 'queryPermission');

    await element.hasReadWritePermission(handle);

    assert.equal(spy.calledWith({mode: 'readwrite'}), true);
  });

  it('should request for readwrite permission on a file when not granted', async () => {
    sinon.stub(element, 'hasReadWritePermission').resolves(false);
    const handle = {
      requestPermission() {
        return Promise.resolve('granted');
      }
    };
    const spy = sinon.spy(handle, 'requestPermission');

    const actual = await element.getReadWritePermission(handle);

    assert.equal(spy.calledWith({mode: 'readwrite'}), true);
    assert.equal(actual, true);
  });


  it('should open a file when it is clicked', async () => {
    const spy = sinon.spy(element, 'openFileHandle');
    const path = 'src/index.html';
    const fileEl = fileElement(path);

    const event = {
      composedPath() {
        return [fileEl];
      }
    };

    await element.openFileOrDirectory(event);

    assert.equal(spy.calledWith(indexHtmlFileHandle), true);
  });

  it('should open a closed directory when it is clicked', async () => {
    const spy1 = sinon.spy(element.openDirs, 'add');
    const spy2 = sinon.spy(element, 'iterateFiles');
    const path = 'src/js';

    const dirEl = dirElement(path);

    const event = {
      composedPath() {
        return [dirEl];
      }
    };

    await element.openFileOrDirectory(event);

    assert.equal(spy1.calledWith(path), true);
    assert.equal(spy2.called, true);
  });

  it('should close an open directory when it is clicked', async () => {
    const spy = sinon.spy(element.openDirs, 'delete');
    const path = 'src/js';

    const dirEl = dirElement(path);
    dirEl.classList.toggle('open');

    const event = {
      composedPath() {
        return [dirEl];
      }
    };

    await element.openFileOrDirectory(event);

    assert.equal(spy.calledWith(path), true);
  });

  it('should recursively close all subdirectories of an open directory when it is clicked', async () => {
    const spy1 = sinon.spy(element.openDirs, 'delete');
    const iconsDirElement = dirElement('src/img/icons');
    const imgDirElement = dirElement('src/img', [iconsDirElement]);

    const event1 = {
      composedPath() {
        return [imgDirElement];
      }
    };

    await element.openFileOrDirectory(event1);

    const event2 = {
      composedPath() {
        return [iconsDirElement];
      }
    };

    await element.openFileOrDirectory(event2);
    await element.openFileOrDirectory(event1);

    assert.equal(spy1.calledWith('src/img', ), true);
    assert.equal(spy1.calledWith('src/img/icons', ), true);
  });

  it('should highlight a file when it\'s right-clicked, throw an event and open a context menu', async () => {
    const spy1 = sinon.spy(element, 'highlightFile');
    const spy2 = sinon.spy(element, 'dispatchEvent');
    const spy3 = sinon.spy(element, 'openContextMenu');
    sinon.stub(element, 'getReadWritePermission').resolves(true);
    sinon.stub(element, 'getFileFromHandle').resolves(indexHtmlFile);

    const path = 'src/index.html';
    const fileEl = fileElement(path);
    const event = {
      pageX: 1,
      pageY: 2,
      composedPath() {
        return [fileEl];
      },
      preventDefault() {

      }
    };

    const detail = {
      path,
      handle: indexHtmlFileHandle,
      parentHandle: srcDirHandle,
      entries: undefined,
      x: 1,
      y: 2,
      domElement: fileEl,
      file: indexHtmlFile
    };

    const customEvent = new CustomEvent('right-click', {
      composed: true,
      bubbles: true,
      detail
    });

    await element.handleRightClick(event);

    assert.equal(spy1.calledWith(path), true);
    assert.equal(spy2.calledWith(customEvent), true);
    assert.equal(spy3.calledWith(detail), true);
  });

  it('should throw an event and open a context menu when a directory is right-clicked', async () => {
    const spy1 = sinon.spy(element, 'dispatchEvent');
    const spy2 = sinon.spy(element, 'openContextMenu');
    sinon.stub(element, 'getReadWritePermission').resolves(true);
    sinon.stub(element, 'getFileFromHandle').resolves(indexHtmlFile);

    const path = 'src/css';
    const dirEl = dirElement(path);
    const event = {
      pageX: 1,
      pageY: 2,
      composedPath() {
        return [dirEl];
      },
      preventDefault() {

      }
    };

    const detail = {
      path,
      handle: cssDirHandle,
      parentHandle: srcDirHandle,
      entries: cssDirectoryEntries,
      x: 1,
      y: 2,
      domElement: dirEl
    };

    const customEvent = new CustomEvent('right-click', {
      composed: true,
      bubbles: true,
      detail
    });

    await element.handleRightClick(event);

    assert.equal(spy1.calledWith(customEvent), true);
    assert.equal(spy2.calledWith(detail), true);
  });

  it('should recursively open all parent directories of a file when it\'s opened directly through its path', async () => {
    const spy = sinon.spy(element.openDirs, 'add');

    await element.openFileByPath('src/img/icons/close.png');

    assert.equal(spy.calledWith('src/img'), true);
    assert.equal(spy.calledWith('src/img/icons'), true);
  });

  it('should unhighlight a highlighted file', () => {
    const path = 'src/manifest.json';
    const fileEl = fileElement(path);

    fileEl.classList.add('selected');

    const spy = sinon.spy(fileEl.classList, 'remove');
    sinon.stub(element.shadowRoot, 'querySelector').returns(fileEl);

    element.unhighlightFile(path);

    assert.equal(spy.calledWith('selected'), true);
  });

  it('should refresh the file tree when an entry is clicked that no longer exists', () => {
    sinon.stub(element, 'getReadWritePermission').throws();
    const spy = sinon.spy(element, 'refresh');

    const path = 'src/index.html';
    const fileEl = fileElement(path);
    const event = {
      pageX: 1,
      pageY: 2,
      composedPath() {
        return [fileEl];
      },
      preventDefault() {

      }
    };

    element.handleRightClick(event);

    assert.equal(spy.called, true);
  });

  it('should remove a directory from the list of open directories when it no longer exists after the tree is refreshed', async () => {
    element.openDirs.add('foo/bar');

    await element.refresh();

    assert.equal(element.openDirs.has('foo/bar'), false);
  });

  it('should find a file by its path and open it', async () => {
    const spy1 = sinon.spy(element, 'openFileHandle');
    const spy2 = sinon.spy(element, 'highlightFile');

    const path = 'src/index.html';

    await element.openFileByPath(path);

    assert.deepEqual(spy1.calledWith(indexHtmlFileHandle), true);
    assert.equal(spy2.calledWith(path), true);
  });

  it('should refresh the tree view when an error occurs when opening a file', async () => {
    sinon.stub(element, 'openFileHandle').throws();
    const spy = sinon.spy(element, 'refresh');
    const path = 'src/index.html';
    const fileEl = fileElement(path);

    const event = {
      composedPath() {
        return [fileEl];
      }
    };

    await element.openFileOrDirectory(event);

    assert.equal(spy.called, true);
  });

  it('should retrieve the file from a file handle', async () => {
    const actual = await element.getFileFromHandle(mainCssFileHandle);
    const expected = {
      name: 'main.css',
      contents: mainCssFileContents,
      type: 'text/css'
    };

    assert.deepEqual(actual, expected);
  });

  it('should throw an event when a file is opened', async () => {
    const spy = sinon.spy(element, 'dispatchEvent');
    const path = 'main.css';
    const handle = mainCssFileHandle;
    const file = {
      name: 'main.css',
      contents: mainCssFileContents,
      type: 'text/css'
    };
    const detail = {file, path, handle};

    const event = new CustomEvent('file-selected', {
      composed: true,
      bubbles: true,
      detail
    });

    await element.openFileHandle(handle);

    assert.equal(spy.args[0][0].composed, true);
    assert.equal(spy.args[0][0].bubbles, true);
    assert.equal(spy.args[0][0].type, 'file-selected');
    assert.deepEqual(spy.args[0][0].detail, event.detail);
  });

  it('should save a selected file to disk', async () => {
    const writable = {
      write() {

      },
      close() {

      }
    };

    const spy1 = sinon.spy(writable, 'write');
    const spy2 = sinon.spy(writable, 'close');
    const spy3 = sinon.spy(element, 'getFileFromHandle');
    sinon.stub(mainCssFileHandle, 'createWritable').resolves(writable);

    const data = `body {}`;
    const file = {
      name: 'main.css',
      contents: mainCssFileContents,
      type: 'text/css'
    };

    const expected = {file, handle: mainCssFileHandle};

    const actual = await element.saveFile(data, mainCssFileHandle);

    assert.equal(spy1.calledWith({type: 'write', data}), true);
    assert.equal(spy2.called, true);
    assert.equal(spy3.calledWith(mainCssFileHandle), true);
    assert.deepEqual(actual, expected);
  });

  it('should save a file to disk under a different file name while suggesting the original name', async () => {
    const stub = sinon.stub(window, 'showSaveFilePicker').resolves(mainCssFileHandle);
    const spy1 = sinon.spy(element, 'saveFile');
    const spy2 = sinon.spy(element, 'openFileHandle');

    const suggestedName = indexHtmlFileHandle.name;

    element.currentFileHandle = indexHtmlFileHandle;

    const contents = `body {}`;

    await element.saveFileAs(contents);

    assert.equal(stub.calledWith({suggestedName}), true);
    assert.equal(spy1.calledWith(contents, mainCssFileHandle), true);
    assert.equal(spy2.calledWith(mainCssFileHandle), true);
  });

  it('should create a new file and refresh the tree to display it', async () => {
    sinon.stub(window, 'showSaveFilePicker').resolves(mainCssFileHandle);
    const spy1 = sinon.spy(element, 'getFileFromHandle');
    const spy2 = sinon.spy(element, 'refresh');

    const file = {
      name: 'main.css',
      contents: mainCssFileContents,
      type: 'text/css'
    };

    const expected = {file, handle: mainCssFileHandle};

    const actual = await element.newFile();

    assert.equal(spy1.calledWith(mainCssFileHandle), true);
    assert.equal(spy2.called, true);
    assert.deepEqual(element.currentFileHandle, mainCssFileHandle);
    assert.deepEqual(actual, expected);
  });

  it('should correctly assert whether or not an entry exists', async () => {
    assert.equal(await element.entryExists(srcDirHandle, 'index.html'), true);
    assert.equal(await element.entryExists(srcDirHandle, 'notfound.html'), false);
    assert.equal(await element.entryExists(imgDirHandle, 'index.html'), false);
    assert.equal(await element.entryExists(imgDirHandle, 'header.png'), true);
    assert.equal(await element.entryExists(imgDirHandle, 'email.png'), false);
    assert.equal(await element.entryExists(iconDirHandle, 'email.png'), true);
    assert.equal(await element.entryExists(srcDirHandle, 'icons'), false);
    assert.equal(await element.entryExists(imgDirHandle, 'icons'), true);
  });

  it('should paste a previously copied entry', async () => {
    const spy1 = sinon.spy(element, 'createEntry');
    const spy2 = sinon.spy(element, 'refresh');

    const copiedEntry = {
      path: 'css/main.css',
      handle: mainCssFileHandle
    };

    await element.pasteEntry(imgDirHandle, copiedEntry);

    assert.equal(spy1.calledWith(imgDirHandle, copiedEntry, 'main.css'), true);
    assert.equal(spy2.called, true);
  });

  it('should ask for confirmation when a pasted entry already exists', async () => {
    const spy1 = sinon.spy(element, 'createEntry');
    const spy2 = sinon.spy(element, 'refresh');
    const stub = sinon.stub(element, 'confirm').resolves(true);

    const copiedEntry = {
      path: 'css/main.css',
      handle: mainCssFileHandle
    };

    await element.pasteEntry(cssDirHandle, copiedEntry);

    assert.equal(spy1.called, false);
    assert.equal(spy2.called, false);
    assert.equal(stub.called, true);
  });

  it('should correctly rename a file', async () => {
    const spy1 = sinon.spy(element, 'createEntry');
    const spy2 = sinon.spy(srcDirHandle, 'removeEntry');
    const spy3 = sinon.spy(element, 'refresh');

    await element.renameEntry('src/index.html', 'src/main.html');

    assert.equal(spy1.args[0][0], srcDirHandle);
    assert.equal(spy1.args[0][1].path, 'src/index.html');
    assert.deepEqual(spy1.args[0][1].handle, indexHtmlFileHandle);
    assert.equal(spy1.args[0][2], 'main.html');

    assert.equal(spy2.args[0][0], 'index.html');
    assert.deepEqual(spy2.args[0][1], {recursive: false});

    assert.equal(spy3.called, true);
  });

  it('should correctly rename a directory', async () => {
    const spy1 = sinon.spy(element, 'createEntry');
    const spy2 = sinon.spy(srcDirHandle, 'removeEntry');
    const spy3 = sinon.spy(element, 'refresh');

    await element.renameEntry('src/img', 'src/images');

    assert.equal(spy1.args[0][0], srcDirHandle);
    assert.equal(spy1.args[0][1].path, 'src/img');
    assert.deepEqual(spy1.args[0][1].handle, imgDirHandle);
    assert.equal(spy1.args[0][2], 'images');

    assert.equal(spy2.args[0][0], 'img');
    assert.deepEqual(spy2.args[0][1], {recursive: true});

    assert.equal(spy3.called, true);
  });

  it('should correctly duplicate a file', async () => {
    const spy1 = sinon.spy(element, 'createEntry');
    const spy2 = sinon.spy(element, 'refresh');

    await element.duplicateEntry('src/index.html', 'src/main.html');

    assert.equal(spy1.args[0][0], srcDirHandle);
    assert.equal(spy1.args[0][1].path, 'src/index.html');
    assert.deepEqual(spy1.args[0][1].handle, indexHtmlFileHandle);
    assert.equal(spy1.args[0][2], 'main.html');

    assert.equal(spy2.called, true);
  });

  it('should correctly duplicate a directory', async () => {
    const spy1 = sinon.spy(element, 'createEntry');
    const spy2 = sinon.spy(element, 'refresh');

    await element.duplicateEntry('src/css', 'src/styles');

    assert.equal(spy1.args[0][0], srcDirHandle);
    assert.equal(spy1.args[0][1].path, 'src/css');
    assert.deepEqual(spy1.args[0][1].handle, cssDirHandle);
    assert.equal(spy1.args[0][2], 'styles');

    assert.equal(spy2.called, true);
  });

  it('should correctly delete a file', (done) => {
    const spy1 = sinon.spy(cssDirHandle, 'removeEntry');
    const spy2 = sinon.spy(element, 'refresh');

    element.deleteEntry({handle: mainCssFileHandle, parentHandle: cssDirHandle})
    .then((actual) => {
      assert.equal(spy1.calledWith('main.css', {recursive: false}), true);
      assert.equal(spy2.called, true);
      assert.equal(actual, true);

      done();
    })
    .catch(done);

    element.confirmOkButton.click();
  });

  it('should correctly delete a directory', (done) => {
    const spy1 = sinon.spy(srcDirHandle, 'removeEntry');
    const spy2 = sinon.spy(element, 'refresh');

    element.deleteEntry({handle: cssDirHandle, parentHandle: srcDirHandle})
    .then((actual) => {
      assert.equal(spy1.calledWith('css', {recursive: true}), true);
      assert.equal(spy2.called, true);
      assert.equal(actual, true);

      done();
    })
    .catch(done);

    element.confirmOkButton.click();
  });

  it('should open the save file picker in the correct directory when directory is right-clicked to add a file', () => {
    const stub = sinon.stub(element, 'newFile');
    const {path, handle, parentHandle, entries} = currentDirectory.entries['src/css'];
    const domElement = dirElement('src/css');

    const detail = {path, handle, parentHandle, entries, x: 0, y: 0, domElement};

    element.openContextMenu(detail);

    const li = element.contextMenu.shadowRoot.querySelector('li[data-action="new-file"]');
    li.click();

    assert.equal(stub.calledWith({startIn: handle}), true);
  });

  it('should open the save file picker in the parent directory when a file in that directory is right-clicked to add a file', () => {
    const stub = sinon.stub(element, 'newFile');
    const {path, handle, parentHandle, entries} = cssDirectoryEntries['src/css/main.css'];
    const domElement = fileElement('src/css/main.css');

    const detail = {path, handle, parentHandle, entries, x: 0, y: 0, domElement};

    element.openContextMenu(detail);

    const li = element.contextMenu.shadowRoot.querySelector('li[data-action="new-file"]');
    li.click();

    assert.equal(stub.calledWith({startIn: parentHandle}), true);
  });

  it('should perform a fuzzy search on all files in the current directory', async () => {
    const query = 'main';

    const expected = [
      {
        path: 'src/js/main.js',
        handle: mainJsFileHandle,
        parentHandle: jsDirHandle,
        highlight: [
          'src/js',
          '<span class="highlight">main</span>.js'
        ]
      },
      {
        path: 'src/css/main.css',
        handle: mainCssFileHandle,
        parentHandle: cssDirHandle,
        fileContent: mainCssFileContents,
        highlight: [
          'src/css',
          '<span class="highlight">main</span>.css'
        ]
      },
      {
        path: 'src/manifest.json',
        handle: manifestJsonFileHandle,
        parentHandle: srcDirHandle,
        highlight: [
          'src',
          '<span class="highlight">m</span><span class="highlight">a</span>n<span class="highlight">i</span>fest.jso<span class="highlight">n</span>'
        ]
      },
      {
        path: 'src/img/icons/email.png',
        handle: emailPngFileHandle,
        parentHandle: iconDirHandle,
        highlight: [
          'src/img/icons',
          'e<span class="highlight">m</span><span class="highlight">a</span><span class="highlight">i</span>l.p<span class="highlight">n</span>g'
        ]
      }
    ];

    const actual = element.searchFile(query);

    assert.deepEqual(actual, expected);
  });

  it('should return an empty array when searching for a file with an empty query', () => {
    const actual = element.searchFile('');

    assert.deepEqual(actual, []);
  });

  it('should find a string in all files in the currently opened directory', async () => {
    const query = 'main';

    const expected = {
      query,
      results: [
        {
          path: 'src/index.html',
          rows: [
            {
              content: '&lt;<span class="highlight">main</span>&gt;&lt;/main&gt;',
              line: 4
            }
          ]
        },
        {
          path: 'src/css/main.css',
          rows: [
            {
              content: '<span class="highlight">main</span> {',
              line: 6
            }
          ]
        }
      ]
    };

    const actual = await element.findInFiles(query);

    assert.equal(indexFileContentStub.called, true);
    assert.deepEqual(actual.results, expected.results);
  });
});

