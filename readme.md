# file-tree
`<file-tree>` is a Web Component which provides access to the file system of the user's device using the 
[File System Access API](https://wicg.github.io/file-system-access/) and displays it as a file tree.

It is currently supported on desktop only in Chrome 86+ and Edge 86+.

### Getting started
To install file-tree run:

```
npm install @dannymoerkerke/file-tree
```

Then simply `import` it in your script:

```
import './node_modules/@dannymoerkerke/file-tree/src/file-tree.js';
```

Or include it with a script tag as an ES6 module:

```
<script src="node_modules/@dannymoerkerke/file-tree/src/file-tree.js" type="module"></script>
```

Add the HTML tag:

```
<file-tree></file-tree>
```

...and you're in business!

Include a button inside `<file-tree>` which will open the native browser dialog to open a directory. To do this, add the
`slot="browse-button"` attribute to this button:

```html
<file-tree>
  <button type="button" slot="browse-button">Open directory</button>
</file-tree>
```

The browser dialog can also be opened programmatically:
```javascript
const fileTree = document.querySelector('file-tree');

fileTree.openDirectory();
```

After a directory is chosen, the browser will open two dialogs to ask for permission to open and save changes to files in
the chosen directory.

After that, the contents of the directory will be displayed.

Whenever a file inside the directory is clicked, a `file-selected` event will be thrown with the following data in its
`detail` property:

* `file`:
 * `name`: String, file name
 * `type`: String, MIME type
 * `contents`: String, textual content of the file or base-64 encoded in case of an image.
* `path`: String, the path to the file
* `handle`: FileSytemFileHandle, the native file handle object

To save the file back to disk:

```javascript
fileTree.saveFile(contents, handle = currentFileHandle)
```

where `contents` is the content of the file and `handle` defaults to the handle of the  currently opened file.

To save the file under another name:

```javascript
fileTree.saveFileAs(contents)
```

which will open the native browser dialog to select another file or enter a name.

### Demo
Check the demo on [https://dannymoerkerke.github.io/file-tree/](https://dannymoerkerke.github.io/file-tree/)

To run the demo locally, run `npm install` once and then `npm start` and view the demo on
[http://localhost:8080/file-tree](http://localhost:8080/file-tree)

### Testing
Run `npm test` and view the results on [http://localhost:8888/](http://localhost:8888/)

This repo also contains the configuration file `wallaby.cjs` to run the
tests from your IDE using [Wallaby.js](https://wallabyjs.com/)

### API

***Properties***

`ignoredDirectories`: string[], directories that will not be indexed for searching, defaults to `['.git', 'dist', 'node_modules']`

`filesToIndex`: string[], file extensions that will be indexed for searching in files, defaults to `['txt', 'js', 'ts', 'css', 'html', 'json']`

***Methods***

`openDirectory(): void`, displays the native browser dialog to open a directory

`saveFile(contents: string, handle: FileSystemFileHandle): {file: {name: string, contents: string, type: string}, handle: FileSystemFileHandle}`, 
saves the file content `contents` to disk as the file represented by `handle`. `handle` defaults to the file that was previously selected.

`saveFileAs(contents: string): void`, displays the native browser dialog to save a file and saves the file to disk as the file that was selected
in the dialog or the filename that was entered in this dialog

`newFile({startIn: string | FileSystemDirectoryHandle}?): {file: {name: string, contents: string, type: string}, handle: FileSystemFileHandle}`, displays the native 
browser dialog to create a new file in the directory specified in the `startIn` argument (optional)

`deleteEntry({handle: FileSystemDirectoryHandle | FileSystemFileHandle, parentHandle: FileSystemDirectoryHandle}): void`, deletes the file or 
directory represented by `handle`, `parentHandle` represents the directory the entry to be deleted is in

`pasteEntry(dirHandle, source: {path: string, handle: FileSystemDirectoryHandle | FileSystemFileHandle, entries: {}}): void`, pastes the file
or directory represented by `source` in the directory represented by `dirHandle`

`renameEntry(oldName: string, newName: string): void`, renames the file or directory `oldName` to `newName`, both `oldName` and `newName` are
 fully qualified paths

*Currently the native API does not provide a method to rename a file or directory. This means that the item to be renamed will 
have be copied and then the item with the old name will be removed. This means that  renaming a directory with a lot of 
files and subfolders may take a very long time.*

`duplicateEntry(oldName: string, newName: string): void`, duplicates the file or directory `oldName` to `newName`, both `oldName` and `newName` are
fully qualified paths


