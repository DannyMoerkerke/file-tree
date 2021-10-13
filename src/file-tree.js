import './material-loader.js';
import './material-dialog.js';
import './material-button.js';
import './context-menu.js';
import {worker} from './iterateWorker.js';

import {onOutsideClick, removeOutsideClick} from './on-outside-click.js';

export class FileTree extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
        :host {
          --font-family: Arial;
          --font-color: #000000;
          --hover-font-color: var(--font-color);
          --hover-color: #efefef;
          --selected-color: #cccccc;
          --selected-font-color: var(--font-color);
          --width: auto;
          --font-size: .8em;
          --padding-dir: 6px;
          --padding-file: 6px;
          display: flex;
          width: var(--width);
          max-width: var(--width);
          font-size: var(--font-size);
          max-height: 100vh;
          overflow: scroll;
          font-family: var(--font-family);
        }
        
        #container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        #file-container {
          overflow: scroll;
        }
        
        material-loader {
          margin-top: 20px;
          display: none;
        }
        
        :host([loading]) material-loader {
          display: block;
        }
        
        #filelist {
          list-style-type: none;
          margin: 0;
          padding: 0;
          opacity: 0;
        }
        
        #filelist.ready {
          opacity: 1; 
        }
  
        #filelist ul {
          display: none;
          list-style-type: none;
          padding: 5px 0 5px 15px;
        }
  
        #filelist li {
          cursor: pointer;
          display: flex;
          color: var(--font-color);
        }
        
        #filelist li.dir {
          align-items: center;
          padding: var(--padding-dir);
        }
        
        #filelist li[data-file] {
          padding: var(--padding-file);
        }
  
        #filelist li:hover {
          color: var(--hover-font-color);
          background-color: var(--hover-color);
        }
  
        #filelist li.selected {
          color: var(--selected-font-color);
          background-color: var(--selected-color);
        }
  
        #filelist li[data-dir] span:not(.arrow) {
          font-weight: bold;
          display: block;
          padding: 6px;
          white-space: nowrap;
        }
        #filelist li[data-dir] .arrow {
          display: inline-block;
          width: var(--font-size);
          height: var(--font-size);
          mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi9taWNyby9jaGV2cm9uL3JpZ2h0PC90aXRsZT4KICAgIDxnIGlkPSJkaXItYXJyb3ciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwb2x5Z29uIGlkPSJiYWNrZ3JvdW5kIiBwb2ludHM9IjAgMCAxNiAwIDE2IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICA8cG9seWdvbiBpZD0ic2hhcGUiIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iNiAxMS4wNiA5LjA5MDQxODM1IDggNiA0Ljk0IDYuOTUxNDE3IDQgMTEgOCA2Ljk1MTQxNyAxMiI+PC9wb2x5Z29uPgogICAgPC9nPgo8L3N2Zz4K");
          mask-size: var(--font-size);
          -webkit-mask-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi9taWNyby9jaGV2cm9uL3JpZ2h0PC90aXRsZT4KICAgIDxnIGlkPSJkaXItYXJyb3ciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwb2x5Z29uIGlkPSJiYWNrZ3JvdW5kIiBwb2ludHM9IjAgMCAxNiAwIDE2IDE2IDAgMTYiPjwvcG9seWdvbj4KICAgICAgICA8cG9seWdvbiBpZD0ic2hhcGUiIGZpbGw9IiMwMDAwMDAiIHBvaW50cz0iNiAxMS4wNiA5LjA5MDQxODM1IDggNiA0Ljk0IDYuOTUxNDE3IDQgMTEgOCA2Ljk1MTQxNyAxMiI+PC9wb2x5Z29uPgogICAgPC9nPgo8L3N2Zz4K");
          -webkit-mask-size: var(--font-size);
          background-color: var(--font-color);
          transform: rotate(0deg);
        }
        
        #filelist ul > li[data-file] {
          margin-left: 17px;
        }
        
        #filelist ul ~ li[data-file] {
          margin-left: 25px;
        }
        
        #filelist li.open + ul {
          display: block;
        }
  
        #filelist li[data-dir].open .arrow {
          transform: rotate(90deg);
          transform-origin: center center;
          transition: transform 0.3s ease-out;
        }
        
        #confirm-dialog-cancel {
          margin-right: 10px;
        }
        
        material-dialog material-button {
          margin-bottom: 10px;
        }
        
        .not-supported {
          color: #ff0000;
          display: none;
        }
      </style>
      
      <div id="container">
        <p class="not-supported">
          Unfortunately the File System Access API is not supported on your device.
        </p>
        <slot name="browse-button"></slot>
        <div id="file-container">
          <material-loader size="32"></material-loader>
          <ul id="filelist"></ul>       
        </div>
      </div>
      
      <context-menu></context-menu>
      
      <material-dialog id="confirm-dialog">
        <h3 slot="header">Are you sure?</h3>
        <div slot="body"></div>
  
        <material-button label="Cancel" id="confirm-dialog-cancel" raised slot="footer"></material-button>
        <material-button label="OK" id="confirm-dialog-ok" raised slot="footer"></material-button>
      </material-dialog>
    `;

    this.selectedFileElement = null;
  }

  connectedCallback() {
    if(!this.isSupported()) {
      this.shadowRoot.querySelector('.not-supported').style.display = 'block';
    }

    this.ignoredDirectories = ['.git', 'node_modules', 'dist'];
    this.filesToIndex = ['txt', 'js', 'ts', 'css', 'html', 'json'];
    this.openDirs = new Set();
    this.fileList = this.shadowRoot.querySelector('#filelist');
    this.fileContainer = this.shadowRoot.querySelector('#file-container');

    this.confirmDialog = this.shadowRoot.querySelector('#confirm-dialog');
    this.confirmCancelButton = this.shadowRoot.querySelector('#confirm-dialog-cancel');
    this.confirmOkButton = this.shadowRoot.querySelector('#confirm-dialog-ok');

    this.confirmCancelButton.addEventListener('click', () => this.confirmDialog.close());

    const browseButton = this.shadowRoot.querySelector('slot[name="browse-button"]').assignedNodes()[0];

    if(browseButton) {
      browseButton.addEventListener('click', () => this.openDirectory());

      if(!this.isSupported()) {
        browseButton.disabled = true;
      }
    }

    this.fileList.addEventListener('click', e => this.openFileOrDirectory(e));

    this.fileList.addEventListener('contextmenu', (e) => this.handleRightClick(e));
  }

  isSupported() {
    return 'showDirectoryPicker' in window;
  }

  async confirm({body, callback}) {
    this.confirmDialog.body = body;

    this.confirmDialog.open();

    return new Promise((resolve) => {
      this.confirmCancelButton.onclick = () => {
        this.confirmDialog.close();
        resolve(false);
      };

      this.confirmOkButton.onclick = async () => {
        await callback();
        this.confirmDialog.close();
        resolve(true);
      };
    });

  }

  async hasReadWritePermission(handle) {
    return await handle.queryPermission({mode: 'readwrite'}) === 'granted';
  }

  async getReadWritePermission(handle) {
    if(!(await this.hasReadWritePermission(handle))) {
      const permission = await handle.requestPermission({mode: 'readwrite'});

      if(permission !== 'granted') {
        throw new Error('No permission to open file');
      }
    }

    return true;
  }

  async getFileFromHandle(handle) {
    const file = await handle.getFile();
    const name = file.name;
    const contents = await this.getFileContents(file);
    const {type} = file; //this.getFileType(file);

    return {name, contents, type};
  }

  async getFileContents(file) {
    switch(file.type) {
      case 'image/png':
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/gif':
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.addEventListener('loadend', () => resolve(reader.result));
          reader.readAsDataURL(file);
        });

      default:
        return file.text();
    }
  }

  async openFileByPath(filePath) {
    const [_, {handle}] = this.findEntry(filePath, this.currentDirectory);

    if(handle) {
      await this.openFileHandle(handle);
      this.highlightFile(filePath);
    }
  }

  async openFileHandle({path, handle}) {
    this.currentFileHandle = handle;

    await this.getReadWritePermission(handle);

    const file = await this.getFileFromHandle(handle);

    this.dispatchEvent(new CustomEvent('file-selected', {
      composed: true,
      bubbles: true,
      detail: {file, path, handle}
    }));

    this.highlightFile(path);
  }

  async saveFile(contents, handle = this.currentFileHandle) {
    const writable = await handle.createWritable();

    await writable.write({type: 'write', data: contents});
    await writable.close();

    this.currentFileHandle = handle;

    const file = await this.getFileFromHandle(handle);

    await this.refresh();

    return {file, handle};
  }


  async saveFileAs(contents) {
    const handle = await window.showSaveFilePicker({
      suggestedName: this.currentFileHandle.name
    });

    await this.saveFile(contents, handle);
    await this.openFileHandle(handle);
  }

  async newFile(config) {
    const handle = await window.showSaveFilePicker(config);
    const file = await this.getFileFromHandle(handle);
    this.currentFileHandle = handle;

    await this.refresh();

    return {file, handle};
  }

  async entryExists(directoryHandle, entryName) {
    for await (const [name, _] of directoryHandle.entries()) {
      if(name === entryName) {
        return true;
      }
    }

    return false;
  }

  async deleteEntry({handle, parentHandle}) {
    const recursive = handle.kind === 'directory';

    const body = `Are you sure you want to delete ${handle.name}?`;

    const callback = async () => {
      await parentHandle.removeEntry(handle.name, {recursive});
      await this.refresh();
    };

    return this.confirm({body, callback});
  }

  async pasteEntry(dirHandle, source) {
    const sourceName = source.path.split('/').pop();

    const callback = async () => {
      await this.createEntry(dirHandle, source, sourceName);
      await this.refresh();
    };

    if(await this.entryExists(dirHandle, sourceName)) {
      const body = `${sourceName} already exists, overwrite?`;
      await this.confirm({body, callback});
    }
    else {
      await callback();
    }
  }

  async createEntry(destinationHandle, source, sourceName) {
    const sourceHandle = source.handle;

    if(sourceHandle.kind === 'file') {
      const newFileHandle = await destinationHandle.getFileHandle(sourceName, {create: true});
      const {contents} = await this.getFileFromHandle(sourceHandle);

      await this.saveFile(contents, newFileHandle);

      return newFileHandle;
    }

    const newDirectoryHandle = await destinationHandle.getDirectoryHandle(sourceName, {create: true});
    const sourceDir = await this.iterateFiles(sourceHandle, source, true);

    for(const [path, entry] of Object.entries(sourceDir.entries)) {
      const name = path.split('/').pop();
      await this.createEntry(newDirectoryHandle, entry, name);
    }

    return newDirectoryHandle;
  }

  async renameEntry(oldName, newName) {
    const [path, {handle, parentHandle, entries}] = this.findEntry(oldName);
    const name = newName.split('/').pop();
    const recursive = handle.kind === 'directory';

    await this.createEntry(parentHandle, {path, handle, entries}, name);
    await parentHandle.removeEntry(handle.name, {recursive});
    await this.refresh();
  }

  async duplicateEntry(oldName, newName) {
    const [path, {handle, parentHandle, entries}] = this.findEntry(oldName);
    const name = newName.split('/').pop();

    await this.createEntry(parentHandle, {path, handle, entries}, name);
    await this.refresh();
  }

  async openFile() {
    const [handle] = await window.showOpenFilePicker();

    await this.openFileHandle(handle);
  }

  async openDirectory() {
    try {

      this.currentDirectoryHandle = await window.showDirectoryPicker();

      await this.browseDirectory(this.currentDirectoryHandle);

      return this.currentDirectoryHandle;
    }
    catch(err) {
      console.log('Request aborted');
    }
  }

  async browseDirectory(dirHandle) {
    this.dispatchEvent(new CustomEvent('browsing'));

    await this.getReadWritePermission(dirHandle);

    this.fileList.innerHTML = '';
    this.loading = true;
    this.currentDirectoryHandle = dirHandle;

    const dir = {
      path: this.currentDirectoryHandle.name,
      indexed: false,
      handle: this.currentDirectoryHandle,
      entries: {}
    };

    this.currentDirectory = await this.iterateFiles(this.currentDirectoryHandle, dir);

    this.loading = false;

    this.listFiles(this.currentDirectory, this.fileList);

    if(!this.currentDirectory.indexed) {
      await this.indexDirectory();
    }

    this.fileList.classList.add('ready');
    this.dispatchEvent(new CustomEvent('ready'));
  }

  async iterateFiles(directoryHandle, dir = {}, recursive = false) {
    for await (const [name, handle] of directoryHandle.entries()) {
      const path = `${dir.path}/${name}`;

      dir.entries[path] = {
        path,
        handle,
        parentHandle: directoryHandle,
        ...(handle.kind === 'directory' && {entries: {}})
      };

      if(handle.kind === 'directory' && recursive) {
        await this.iterateFiles(handle, dir.entries[path], recursive);
      }
    }

    return dir;
  }

  listFiles(directory, fileList) {
    Object.entries(directory.entries)
    .sort()
    .sort(([_, a], [__, b]) => a.handle.kind === 'file' && b.handle.kind !== 'file' ? 1 : b.handle.kind === 'file' && a.handle.kind !== 'file' ? -1 : 0)
    .forEach(([path, entry]) => {
      const name = path.split('/').pop();

      if(entry.handle.kind === 'file') {
        fileList.insertAdjacentHTML('beforeend', `<li data-file="${path}"><span>${name}</span></li>`);
      }
      else {
        const cl = this.openDirs.has(path) ? 'dir open' : 'dir';

        fileList.insertAdjacentHTML('beforeend', `<li class="${cl}" data-dir="${path}">
          <span class="arrow"></span>
          <span>${name}</span>
        </li>`);

        const list = fileList.insertAdjacentElement('beforeend', document.createElement('ul'));
        this.listFiles(entry, list);
      }
    });
  }

  async indexDirectory() {
    const dir = {
      path: this.currentDirectoryHandle.name,
      handle: this.currentDirectoryHandle,
      entries: {}
    };

    const iterateWorker = new Worker(worker);

    iterateWorker.addEventListener('message', ({data}) => {
      this.currentDirectory = data;

      this.dispatchEvent(new CustomEvent('indexed'));
    });

    const payload = {
      handle: this.currentDirectoryHandle,
      ignoredDirectories: this.ignoredDirectories,
      filesToIndex: this.filesToIndex,
      dir
    };
    iterateWorker.postMessage(payload);
  }

  async indexFileContent() {
    return new Promise((resolve, reject) => {
      const dir = {
        path: this.currentDirectoryHandle.name,
        handle: this.currentDirectoryHandle,
        entries: {}
      };

      const iterateWorker = new Worker(worker);

      iterateWorker.addEventListener('message', ({data}) => {
        this.currentDirectory = data;
        resolve(data);
      });

      iterateWorker.addEventListener("messageerror", (e) => {
        console.log('error from worker', e);
        reject(e);
      });

      const payload = {
        handle: this.currentDirectoryHandle,
        ignoredDirectories: this.ignoredDirectories,
        filesToIndex: this.filesToIndex,
        includeFileContent: true,
        dir
      };

      iterateWorker.postMessage(payload);
    });
  }

  async openFileOrDirectory(e) {
    const file = [...e.composedPath()].find(el => el.matches && el.matches('li[data-file]'));
    const dir = [...e.composedPath()].find(el => el.matches && el.matches('li[data-dir]'));

    if(file) {
      const filePath = file.dataset.file;
      const [path, {handle}] = this.findEntry(filePath, this.currentDirectory);

      if(handle) {
        try {
          await this.openFileHandle({path, handle});
          this.highlightFile(filePath);
        }
        catch(e) {
          await this.refresh();
        }
      }
    }

    if(dir) {
      dir.classList.toggle('open');
      const dirPath = dir.dataset.dir;
      const [_, dirObj] = this.findEntry(dirPath, this.currentDirectory);

      if(dir.classList.contains('open')) {
        this.openDirs.add(dirPath);
      }
      else {
        this.openDirs.delete(dirPath);
      }

      const entriesList = dir.nextElementSibling;

      // lazily iterate directory
      if(Object.entries(dirObj.entries).length === 0) {
        await this.iterateFiles(dirObj.handle, dirObj);
      }

      // lazily populate file list of directory
      if(entriesList.childElementCount === 0) {
        this.listFiles(dirObj, entriesList);
      }

      // recursively close directory and any of its subdirectories
      if(!dir.classList.contains('open')) {
        entriesList.querySelectorAll('.dir').forEach(entry => {
          if(entry.classList.contains('open')) {
            entry.classList.remove('open');

            const dirPath = entry.dataset.dir;
            this.openDirs.delete(dirPath);
          }
        });
      }
    }
  }

  async handleRightClick(e) {
    e.preventDefault();

    const domElement = [...e.composedPath()].find(el => el.matches('li[data-file]') || el.matches('li[data-dir]'));

    if(domElement) {
      const path = domElement.dataset.file || domElement.dataset.dir;
      const [_, entryObj] = this.findEntry(path, this.currentDirectory);

      if(entryObj) {
        const {path, handle, parentHandle, entries} = entryObj;

        try {
          await this.getReadWritePermission(handle);

          const {pageX: x, pageY: y} = e;
          const detail = {path, handle, parentHandle, entries, x, y, domElement};

          if(handle.kind === 'file') {
            this.highlightFile(path);

            detail.file = await this.getFileFromHandle(handle);
          }

          this.dispatchEvent(new CustomEvent('right-click', {
            composed: true,
            bubbles: true,
            detail
          }));

          this.openContextMenu(detail);
        }
        catch(e) {
          console.log(e);
          await this.refresh();
        }
      }
    }
  }

  openContextMenu(detail) {
    const {path, handle, parentHandle, entries, x, y, domElement} = detail;
    this.contextMenu = this.shadowRoot.querySelector('context-menu');
    const entryType = handle.kind === 'file' ? 'file' : 'directory';

    this.contextMenu.options = [
      {
        label: 'Delete',
        callback: e => {
          this.deleteEntry({handle, parentHandle});
        }
      },
      {
        label: 'Copy',
        callback: async e => {
          this.copiedEntry = {path, handle, entries};
        }
      },
      {
        label: 'Paste',
        callback: async () => {
          await this.pasteEntry(handle, this.copiedEntry);
          this.copiedEntry = null;
        },
        disabled: !this.copiedEntry
      },
      {
        label: 'Rename',
        callback: e => {
          const input = document.createElement('input');
          const orgName = domElement.querySelector('span').textContent;
          input.value = orgName;

          const fullyQualifiedName = domElement.dataset.file || domElement.dataset.dir;

          const removeInput = () => {
            input.remove();
            domElement.querySelector('span').textContent = orgName;

            removeOutsideClick(removeInput);
          };

          setTimeout(() => {
            onOutsideClick(input, removeInput);
          });

          input.addEventListener('keydown', async ({key}) => {
            if(key === 'Escape') {
              removeInput();
            }

            if(key === 'Enter') {
              const newName = input.value.trim();

              if(newName === orgName) {
                removeInput();
              }
              else if(newName !== '') {
                const parts = fullyQualifiedName.split('/');
                parts.pop();
                parts.push(newName);

                const fullyQualifiedNewName = parts.join('/');

                removeInput();
                await this.renameEntry(fullyQualifiedName, fullyQualifiedNewName);
              }
              else {
                input.value = orgName;
              }

            }
          });

          domElement.querySelector('span').textContent = '';
          domElement.querySelector('span').appendChild(input);
          input.focus();
        }
      },
      {
        label: `Copy ${entryType}`,
        callback: e => {
          const fullyQualifiedName = domElement.dataset.file || domElement.dataset.dir;
          this.duplicateEntry(fullyQualifiedName);
        }
      },
      {
        label: `New file`,
        callback: async () => {
          const startIn = entryType === 'directory' ? handle : parentHandle;
          await this.newFile({startIn});
        }
      }
    ];

    this.contextMenu.show({x, y});
  }

  highlightFile(filePath) {
    const [_, fileObj] = this.findEntry(filePath, this.currentDirectory);

    if(fileObj) {
      this.currentFileHandle = fileObj.handle;

      if(this.selectedFileElement) {
        this.selectedFileElement.classList.toggle('selected');
      }

      this.selectedFileElement = this.shadowRoot.querySelector(`li[data-file="${filePath}"]`);

      if(this.selectedFileElement) {
        this.selectedFileElement.classList.toggle('selected');
      }

      const parts = fileObj.path.split('/');

      parts.slice(1).reduce((acc, item, index) => {
        acc.push(item);

        const isFile = index + 1 === parts.length - 1;
        const path = acc.join('/');
        const selector = isFile ? `li[data-file="${path}"]` : `li[data-dir="${path}"]`;
        const className = isFile ? `selected` : `open`;

        const entry = this.shadowRoot.querySelector(selector);

        if(entry) {
          entry.classList.add(className);

          if(isFile) {
            this.selectedFileElement = this.shadowRoot.querySelector(`li[data-file="${path}"]`);

            if(!this.elementIsInView(this.selectedFileElement)) {
              this.fileContainer.scrollTop = this.selectedFileElement.offsetTop;
            }
          }
          else {
            this.openDirs.add(path);
            const [_, dirObj] = this.findEntry(path, this.currentDirectory);
            const entriesList = entry.nextElementSibling;

            entriesList.innerHTML = '';
            this.listFiles(dirObj, entriesList);
          }
        }

        return acc;
      }, parts.slice(0, 1));
    }
  }

  elementIsInView(element) {
    const {top, bottom} = element.getBoundingClientRect();

    return top >= 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight);
  }

  unhighlightFile(filePath) {
    const fileElement = this.shadowRoot.querySelector(`li[data-file="${filePath}"]`);

    if(fileElement) {
      if(fileElement.classList.contains('selected')) {
        fileElement.classList.remove('selected');

        this.selectedFileElement = null;
        this.currentFileHandle = null;
      }
    }
  }

  isIgnoredEntry(path) {
    return path.split('/').some(part => this.ignoredDirectories.includes(part));
  }

  getSearchRegex(query, {matchWholeWord, caseSensitive, regex}) {
    const regexString = matchWholeWord ? `\\b${query}\\b` : query;
    return caseSensitive ? new RegExp(regexString) : new RegExp(regexString, 'i');
  }

  findEntry(fileName, directory = this.currentDirectory) {
    const entries = [...Object.entries(directory.entries)];

    return entries.find(([path, handle]) => fileName === path) ||
      entries
      .filter(([path, {handle}]) => handle.kind === 'directory')
      .flatMap(([path, entry]) => fileName === path ? entry : this.findEntry(fileName, entry));
  }

  async findInFiles(query, config = {matchWholeWord: false, caseSensitive: false, regex: false}) {
    if(!this.currentDirectory.hasFileContent) {
      await this.indexFileContent();
    }
    const searchRegex = this.getSearchRegex(query, config);
    const result = this.searchInFiles(searchRegex);

    const results = result.map(({path, fileContent}) => {
      const rows = fileContent
      .split('\n')
      .map((row, index) => ({line: index + 1, content: row}))
      .filter(({content}) => searchRegex.test(content)) // whole word: new RegExp(`\\b${query}\\b`).test(content)
      .map(({content, line}) => ({
        line,
        content: content.trim().replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(query, `<span class="highlight">${query}</span>`)
      }));

      return {path, rows};
    });

    return {query, results};
  }

  searchInFiles(searchRegex, directory = this.currentDirectory) {
    const entries = [...Object.values(directory.entries)];

    const findInFile = ({handle, path, fileContent}) => {
      return handle.kind === 'file' && !this.isIgnoredEntry(path) && searchRegex.test(fileContent);
    };

    return [
      ...entries.filter(findInFile),
      ...entries
      .filter(({handle, path}) => handle.kind === 'directory' && !this.isIgnoredEntry(path))
      .flatMap((entry) => findInFile(entry) ? entry : this.searchInFiles(searchRegex, entry))
    ];
  }

  findFile(query) {
    const results = this.searchFile(query);

    return {query, results};
  }

  searchFile(query, directory = this.currentDirectory) {
    const entries = [...Object.values(directory.entries)];

    const fuzzyFindFile = (entry) => this.fuzzysearch(query, entry.path.split('/').pop());

    return query === '' ? [] : [
      ...entries.filter(fuzzyFindFile),
      ...entries
      .filter(({handle, path}) => handle.kind === 'directory' && !this.isIgnoredEntry(path))
      .flatMap((entry) => fuzzyFindFile(entry) ? entry : this.searchFile(query, entry))
    ]
    .sort((a, b) => a.path.includes(query) ? -1 : b.path.includes(query) ? 1 : 0)
    .map((entry) => {
      const copy = {...entry};
      copy.highlight = this.fuzzyHighlight(query, entry.path);
      return copy;
    });
  }

  fuzzyHighlight(needle, path) {
    const pathParts = path.split('/');
    const haystack = pathParts.pop();
    const needleParts = [...needle];
    const haystackParts = [...haystack];

    if(haystack.includes(needle)) {
      return [pathParts.join('/'), haystack.replace(needle, `<span class="highlight">${needle}</span>`)];
    }

    const parts = haystackParts.map((part) => {
      if(part === needleParts[0]) {
        needleParts.shift();
        return `<span class="highlight">${part}</span>`;
      }

      return part;
    });

    return [pathParts.join('/'), parts.join('')];
  }

  fuzzysearch(needle, haystack) {
    const nlen = needle.length;
    const hlen = haystack.length;

    if(nlen > hlen) {
      return false;
    }

    if(nlen === hlen) {
      return needle === haystack;
    }

    const needleParts = [...needle];
    const haystackParts = [...haystack];

    haystackParts.forEach((part) => {
      if(part === needleParts[0]) {
        needleParts.shift();
      }
    });

    return needleParts.length === 0;
  }

  async refresh() {
    await this.browseDirectory(this.currentDirectoryHandle);

    const openDirs = [...this.openDirs];

    for(const dirPath of openDirs) {
      const [_, dirObj] = this.findEntry(dirPath, this.currentDirectory);

      // previously opened directory no longer exists
      if(dirObj === undefined) {
        this.openDirs.delete(dirPath);
      }
      else if(Object.entries(dirObj.entries).length === 0) {
        await this.iterateFiles(dirObj.handle, dirObj);

        const fileList = this.shadowRoot.querySelector(`li[data-dir="${dirPath}"] + ul`);

        this.listFiles(dirObj, fileList);
      }
    }
  }

  set loading(isLoading) {
    isLoading ? this.setAttribute('loading', '') : this.removeAttribute('loading');
  }

  get loading() {
    return this.hasAttribute('loading');
  }
}

customElements.define('file-tree', FileTree);
