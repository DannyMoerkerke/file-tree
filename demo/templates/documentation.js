export const template = `
<h1>Documentation</h1>

<h2>Properties</h2>

<ul>
  <li><code>ignoredDirectories</code>: string[], directories that will not be indexed for searching, defaults to
    <code>['.git', 'dist', 'node_modules']</code></li>
  
  <li><code>filesToIndex</code>: string[], file extensions that will be indexed for searching in files, defaults to
    <code>['txt', 'js', 'ts', 'css', 'html', 'json']</code></li>
</ul>

<h2>Methods</h2>

<ul>
  <li><code>openDirectory(): void</code>, displays the native browser dialog to open a directory</li>
  
  <li><code>saveFile(contents: string, handle: FileSystemFileHandle): {file: {name: string, contents: string, type:
    string}, handle: FileSystemFileHandle}</code>,
    saves the file content <code>contents</code> to disk as the file represented by <code>handle</code>. <code>handle</code>
      defaults to the file that was previously selected.</li>
  
  <li><code>saveFileAs(contents: string): void</code>, displays the native browser dialog to save a file and saves
    the file to disk as the file that was selected
    in the dialog or the filename that was entered in this dialog</li>
  
  <li><code>newFile({startIn: string | FileSystemDirectoryHandle}?): {file: {name: string, contents: string, type:
    string}, handle: FileSystemFileHandle}</code>, displays the native
    browser dialog to create a new file in the directory specified in the <code>startIn</code> argument (optional)</li>
  
  <li><code>deleteEntry({handle: FileSystemDirectoryHandle | FileSystemFileHandle, parentHandle:
    FileSystemDirectoryHandle}): void</code>, deletes the file or
    directory represented by <code>handle</code>, <code>parentHandle</code> represents the directory the entry to
    be deleted is in</li>
  
  <li><code>pasteEntry(dirHandle, source: {path: string, handle: FileSystemDirectoryHandle | FileSystemFileHandle,
    entries: {}}): void</code>, pastes the file
    or directory represented by <code>source</code> in the directory represented by <code>dirHandle</code></li>
  
  <li><code>renameEntry(oldName: string, newName: string): void</code>, renames the file or directory
    <code>oldName</code> to <code>newName</code>, both <code>oldName</code> and <code>newName</code> are
    fully qualified paths
  
    <p><em>Currently the native API does not provide a method to rename a file or directory. This means that the item
      to be renamed will
      have be copied and then the item with the old name will be removed. This means that renaming a directory with
      a lot of
      files and subfolders may take a very long time.</em></p>
  </li>
  
  <li><code>duplicateEntry(oldName: string, newName: string): void</code>, duplicates the file or directory <code>oldName</code>
    to <code>newName</code>, both <code>oldName</code> and <code>newName</code> are
    fully qualified paths</li>
</ul>
`;
