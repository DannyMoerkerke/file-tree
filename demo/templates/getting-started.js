export const template = `
<h1>Getting started</h1>

  <p>
  To install file-tree run:

  <pre>
npm install @dannymoerkerke/file-tree
  </pre>

  <p>Then simply <code>import</code> it in your script:</p>

  <pre>
import './node_modules/@dannymoerkerke/file-tree/src/file-tree.js';
  </pre>

  <p>Or include it with a script tag as an ES6 module:</p>

  <pre>
&lt;script src="node_modules/@dannymoerkerke/file-tree/src/file-tree.js" type="module"&gt;&lt;/script&gt;
  </pre>

  <p>Add the HTML tag:</p>

  <pre>
&lt;file-tree&gt;&lt;/file-tree&gt;
  </pre>

  <p>...and you're in business!</p>

  <p>Include a button inside <code>&lt;file-tree&gt;</code> which will open the native browser dialog
    to open a directory.</p>

  <p>To do this, add the
    <code>slot="browse-button"</code> attribute to this button:</p>

  <pre>
&lt;file-tree&gt;
&lt;button type="button" slot="browse-button"&gt;Open directory&lt;/button&gt;
&lt;/file-tree&gt;
  </pre>

  <p>The browser dialog can also be opened programmatically:</p>

  <pre>
const fileTree = document.querySelector('file-tree');

fileTree.openDirectory();
  </pre>

  <p>After a directory is chosen, the browser will open two dialogs to ask for permission to open and save changes
    to files in
    the chosen directory.</p>

  <p>After that, the contents of the directory will be displayed.</p>

  <p>Whenever a file inside the directory is clicked, a <code>file-selected</code> event will be thrown with the
    following data in its
    <code>detail</code> property:</p>

  <ul>
    <li><code>file</code>:
      <ul>
        <li><code>name</code>: String, file name</li>
        <li><code>type</code>: String, MIME type</li>
        <li><code>contents</code>: String, textual content of the file or base-64 encoded in case of an image.</li>
        <li><code>path</code>: String, the path to the file</li>
        <li><code>handle</code>: FileSytemFileHandle, the native file handle object</li>
      </ul>
    </li>
  </ul>

  <p>To save the file back to disk:</p>

  <pre>
fileTree.saveFile(contents, handle = currentFileHandle)
  </pre>

  <p>where <code>contents</code> is the content of the file and <code>handle</code> defaults to the handle of the
    currently opened file.</p>

  <p>To save the file under another name:</p>

  <pre>
fileTree.saveFileAs(contents)
  </pre>

  <p>which will open the native browser dialog to select another file or enter a name.</p>
`;
